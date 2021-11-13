<?php
namespace Webeak\Bundle\HeavyTaskBundle;

use Cron\CronExpression;
use Symfony\Component\Process\Process;
use Webeak\Bundle\DebugBundle\Logger;
use Webeak\Bundle\EssentialBundle\Exception\StopException;
use Webeak\Bundle\SharedStorageBundle\LockInterface;
use Webeak\Bundle\SharedStorageBundle\SharedStorageInterface;
use Webeak\Component\Utils\RandomGenerator;
use Webeak\Component\Utils\StringUtils;
use Webeak\Component\Utils\UtilPhp;

class Supervisor
{
    const SHARED_STORAGE_LOCK_TIMEOUT = 120;

    /**
     * Random id for this supervisor instance.
     * The goal is to add a new layer of insurance preventing two Supervisor instances to run at the same time.
     *
     * @var string
     */
    private $id;

    /** @var SharedStorageInterface */
    private $sharedStorage;

    /** @var Logger */
    private $logger;

    /** @var SupervisorBridge */
    private $bridge;

    /** @var integer */
    private $maxParallelProcesses;

    /** @var integer */
    private $historySize;

    /** @var integer */
    private $maxConsecutiveCrashes;

    /** @var integer */
    private $tickInterval;

    /** @var array */
    private $data;

    /** @var LockInterface */
    private $dataLock;

    /** @var array */
    private $runningProcesses;

    /** @var boolean */
    private $started;

    /** @var string */
    private $projectDir;

    public function __construct(SharedStorageInterface $sharedStorage,
                                Logger $logger,
                                SupervisorBridge $bridge,
                                int $maxParallelProcesses,
                                int $historySize,
                                int $maxConsecutiveCrashes,
                                int $tickInterval,
                                string $projectDir)
    {
        $this->sharedStorage = $sharedStorage;
        $this->logger = $logger;
        $this->bridge = $bridge;
        $this->maxParallelProcesses = $maxParallelProcesses;
        $this->historySize = $historySize;
        $this->maxConsecutiveCrashes = $maxConsecutiveCrashes;
        $this->tickInterval = $tickInterval;
        $this->started = false;
        $this->data = null;
        $this->dataLock = null;
        $this->runningProcesses = [];
        $this->projectDir = $projectDir;
        \register_shutdown_function([$this, 'stop']);
    }

    /**
     * Start the supervisor.
     *
     * \!/ WARNING \!/ This method is infinite and blocking, you should not call this manually
     * but use the "wb:heavy-task:start-supervisor" command instead.
     */
    public function start()
    {
        set_time_limit(0);
        $this->logger->autoPersist();
        $this->logger->notice(sprintf('Starting supervisor on pid %d', getmypid()));
        $this->id = RandomGenerator::randomString(64, RandomGenerator::HEXADECIMAL);
        $this->bridge->initialize($this->id);
        $this->loadData();
        $this->logger->debug('Supervisor initialized.');
        $this->started = true;
        $this->loop();
    }

    /**
     * Stop the supervisor.
     *
     * @param boolean $andSave (optional, default true)
     */
    public function stop($andSave = true)
    {
        if ($this->started) {
            $this->logger->debug('Stopping supervisor...');
            $this->bridge->destroy($this->id);
            $this->started = false;
            if ($andSave) {
                $this->saveData(false);
            }
            if (!$this->dataLock) {
                $this->dataLock->release();
            }
            $this->logger->notice('Supervisor stopped.');
        }
    }



    /**
     * Start the infinite processing loop.
     */
    private function loop()
    {
        while (true) {
            try {
                if (!$this->tick()) {
                    break;
                }
            } catch (StopException $e) {
                $this->stop();
                break ;
            } catch (\Throwable $e) {
                $this->logger->error(
                    sprintf('An uncaught exception has been thrown while running a supervisor tick. Error: "%s".', $e->getMessage()),
                    ['exception' => $e]
                );
            }
            $this->saveData();
            usleep($this->tickInterval * 1000);
        }
    }

    /**
     * Load the internal data array of the supervisor from the local storage.
     * This method also locks the storage until the next save.
     */
    private function loadData()
    {
        $defaultData = [
            'tasks' => [],
            'history' => [],
            'queues' => [
                HeavyTaskStatus::SCHEDULED => [],
                HeavyTaskStatus::WAITING => [],
                HeavyTaskStatus::CRASHED => [],
                HeavyTaskStatus::RUNNING => [],
                HeavyTaskStatus::PAUSED => []
            ]
        ];
        $isFirstLoad = $this->data === null;
        $this->data = $this->sharedStorage->getAndLockUntilNextSet(
            SharedStorageKeys::SUPERVISOR,
            SharedStorageKeys::NAMESPACE,
            self::SHARED_STORAGE_LOCK_TIMEOUT,
            self::SHARED_STORAGE_LOCK_TIMEOUT  + 10,
            $this->dataLock
        );
        if (!is_array($this->data) || count(array_diff(array_keys($this->data), array_keys($defaultData)))) {
            $this->data = $defaultData;
        }
        if ($isFirstLoad) {
            foreach ($this->data as $key => $values) {
                if ($key === 'queues') {
                    foreach ($values as $queue => $tasks) {
                        $this->data[$key][$queue] = $this->unserializeTasks($tasks);
                    }
                } else {
                    $this->data[$key] = $this->unserializeTasks($values);
                }
            }
            $this->data['queues'] = $defaultData['queues'];
            foreach ($this->data['tasks'] as $task) {
                /** @var SupervisorTask $task */
                // The task was running when the previous supervisor instance stopped.
                // We need to check its status using its internal data.
                if ($task->status === HeavyTaskStatus::RUNNING) {
                    $context = $this->sharedStorage->get(HeavyTaskContext::getStorageKey($task->publicId), SharedStorageKeys::NAMESPACE);
                    if (!($context instanceof HeavyTaskContext) || $context->isCompleted()) {
                        $task->status = HeavyTaskStatus::FINISHED;
                    } else if ($context->hasError()) {
                        $task->status = HeavyTaskStatus::CRASHED;
                    } else {
                        $task->status = HeavyTaskStatus::WAITING;
                    }
                }
                if (array_key_exists($task->status, $this->data['queues'])) {
                    $this->data['queues'][$task->status][] = $task;
                }
            }
            // So public data are generated.
            $this->saveData();
        }
    }

    /**
     * Save the internal data array into the local storage and refresh the lock.
     *
     * @param boolean $refreshLock (optional, default: true)
     */
    private function saveData($refreshLock = true)
    {
        $this->sharedStorage->set(SharedStorageKeys::SUPERVISOR, $this->data, SharedStorageKeys::NAMESPACE);
        if ($refreshLock) {
            // To refresh the lock.
            $this->loadData();
        }
        $this->sharedStorage->set(SharedStorageKeys::SUPERVISOR_PUBLIC, $this->buildPublicData(), SharedStorageKeys::NAMESPACE);

    }

    /**
     * Execute a process cycle.
     *
     * @return boolean
     *
     * @throws
     */
    private function tick(): bool
    {
        $startTime = time();
        $timeout = self::SHARED_STORAGE_LOCK_TIMEOUT * 0.8; // 80% of the timeout to be safe.
        while (($command = $this->bridge->getNextCommand($this->id)) !== null) {
            if ($command === false) {
                $this->logger->warning('No more data available for this supervisor instance.');
                $this->stop(false);
                return false;
            }
            $this->executeCommand($command);
            // In case we have so much commands to process that we come close to the lock timeout.
            // In such a case we must stop and let the tick go to ensure the lock is refreshed.
            if (time() - $startTime >= $timeout) {
                // Take no risk and skip the processing of queues for this one, we need to refresh the lock fast.
                return true;
            }
        }
        $this->processScheduledQueue();
        $this->processWaitingQueue();
        $this->processCrashedQueue();
        $this->watchRunningProcesses();
        return true;
    }

    /**
     * Execute a command.
     *
     * @param SupervisorCommand $command
     *
     * @throws
     */
    private function executeCommand(SupervisorCommand $command)
    {
        $this->logger->debug('Executing command.', ['command' => $command]);
        switch ($command->name) {
            case SupervisorCommands::EXECUTE_TASK: {
                $this->registerTask($command->payload);
            } break ;

            case SupervisorCommands::PAUSE_TASK: {
                $this->pauseTask($command->payload);
            } break ;

            case SupervisorCommands::RESUME_TASK: {
                $this->resumeTask($command->payload);
            } break ;

            case SupervisorCommands::STOP_TASK: {
                $this->stopTask($command->payload);
            } break ;

            case SupervisorCommands::CLEAR_HISTORY: {
                $this->clearHistory();
            } break ;

            case SupervisorCommands::STOP: {
                throw new StopException();
            } break ;

            default: {
                $this->logger->warning(sprintf('Unknown command "%s".', $command->name), ['command' => $command]);
            } break ;
        }
    }

    /**
     * Move tasks from the scheduled queue into the waiting queue if the time has come.
     */
    private function processScheduledQueue()
    {
        $now = time();
        for ($i = 0, $c = count($this->data['queues'][HeavyTaskStatus::SCHEDULED]); $i < $c; ++$i) {
            /** @var SupervisorTask $candidate */
            $candidate = $this->data['queues'][HeavyTaskStatus::SCHEDULED][$i];
            if (!$candidate->time || $now >= $candidate->time) {
                array_splice($this->data['queues'][HeavyTaskStatus::SCHEDULED], $i--, 1);
                --$c;
                $candidate->status = HeavyTaskStatus::WAITING;
                $this->data['queues'][HeavyTaskStatus::WAITING][] = $candidate;
            }
        }
    }

    /**
     * Move tasks from the waiting queue to the running queue if there is available slots.
     */
    private function processWaitingQueue()
    {
        $runningTasksCount = count($this->data['queues'][HeavyTaskStatus::RUNNING]);
        $newRunningTasks = array_splice(
            $this->data['queues'][HeavyTaskStatus::WAITING],
            0,
            $this->maxParallelProcesses <= 0 ? count($this->data['queues'][HeavyTaskStatus::WAITING]) : max(0, $this->maxParallelProcesses - $runningTasksCount)
        );
        foreach ($newRunningTasks as $newRunningTask) {
            /** @var SupervisorTask $newRunningTask */
            $this->executeTask($newRunningTask->supervisorId);
        }
    }

    /**
     * Move tasks from the crashed queue to the running queue if there is available slots.
     */
    private function processCrashedQueue()
    {
        // Only add crashed process when there is nothing else to do.
        if (count($this->data['queues'][HeavyTaskStatus::RUNNING]) + count($this->data['queues'][HeavyTaskStatus::WAITING]) >= $this->maxParallelProcesses) {
            return ;
        }
        $this->data['queues'][HeavyTaskStatus::WAITING] = $this->data['queues'][HeavyTaskStatus::CRASHED];
        $this->data['queues'][HeavyTaskStatus::CRASHED] = [];
    }

    /**
     * Register a task to execute.
     *
     * @param array $payload
     */
    private function registerTask(array $payload)
    {
        $this->logger->debug('Register task.', ['payload' => $payload]);

        $task = new SupervisorTask();
        $task->publicId = $payload['id'];
        $task->supervisorId = $this->generateTaskUniqueId();
        $task->name = $payload['name'];
        $task->description = $payload['description'];
        $task->serviceName = $payload['serviceName'];
        $task->options = $payload['options'];
        $task->time = $payload['time'];
        $task->recurrencePattern = $payload['recurrencePattern'];
        $task->status = HeavyTaskStatus::SCHEDULED;
        $task->consecutiveCrashesCount = 0;

        if (array_key_exists('unique', $task->options) && $task->options['unique'] === true) {
            foreach ($this->data['tasks'] as $id => $candidate) {
                /** @var SupervisorTask $candidate */
                if ($candidate->serviceName === $task->serviceName) {
                    $this->logger->info(sprintf(
                        'Registering of task "%s" has been ignored because another task '.
                        'of this type is already running and it has been marked as unique.',
                        $candidate->serviceName
                    ));
                    return ;
                }
            }
        }
        $this->data['tasks'][$task->supervisorId] = $task;
        $this->data['queues'][HeavyTaskStatus::SCHEDULED][] = $task;
    }

    /**
     * Pause the execution of a task.
     *
     * @param array $payload
     */
    private function pauseTask(array $payload)
    {
        foreach ($this->data['tasks'] as $taskId => $task) {
            /** @var SupervisorTask $task */
            if ($task->publicId === $payload['id']) {
                $this->updateTaskStatus($taskId, HeavyTaskStatus::PAUSED);
            }
        }
        $this->saveData();
    }

    /**
     * Resume the execution of a paused task.
     *
     * @param array $payload
     */
    private function resumeTask(array $payload)
    {
        foreach ($this->data['tasks'] as $taskId => $task) {
            /** @var SupervisorTask $task */
            if ($task->publicId === $payload['id']) {
                $this->updateTaskStatus($taskId, HeavyTaskStatus::SCHEDULED);
            }
        }
        $this->saveData();
    }

    /**
     * Stop the execution of a task.
     *
     * @param array $payload
     */
    private function stopTask(array $payload)
    {
        foreach ($this->data['tasks'] as $taskId => $task) {
            /** @var SupervisorTask $task */
            if ($task->publicId === $payload['id']) {
                $task->status = HeavyTaskStatus::ABORTED;
                $this->addToHistory($task);
            }
        }
        $this->saveData();
    }

    /**
     * Clear the finished tasks history.
     */
    private function clearHistory()
    {
        $this->data['history'] = [];
        $this->saveData();
    }

    /**
     * Start the execution of a task, by supervisor id.
     *
     * @param string $id
     */
    private function executeTask(string $id)
    {
        if (!array_key_exists($id, $this->data['tasks'])) {
            $this->logger->error(sprintf('No task id "%s" has been found.', $id));
            return ;
        }
        /** @var SupervisorTask $task */
        $task = $this->data['tasks'][$id];
        $task->status = HeavyTaskStatus::RUNNING;
        $this->data['queues'][HeavyTaskStatus::RUNNING][] = $task;

        $process = new Process(['php', $this->projectDir . '/bin/console', 'wb:heavy-task:execute-task', base64_encode(serialize($task))]);
        $process->start();
        $task->pid = $process->getPid();
        $this->runningProcesses[] = ['task' => $task, 'process' => $process];
    }

    /**
     * Check all running processes.
     */
    private function watchRunningProcesses()
    {
        $exitCodesMap = [
            200 => HeavyTaskStatus::FINISHED,
            0 => HeavyTaskStatus::WAITING,
            1 => HeavyTaskStatus::CRASHED
        ];
        for ($i = 0, $c = count($this->runningProcesses); $i < $c; ++$i) {
            /** @var Process $runningProcess */
            $runningProcess = $this->runningProcesses[$i]['process'];
            if (!$runningProcess->isRunning()) {
                /** @var SupervisorTask $task */
                $task = $this->runningProcesses[$i]['task'];
                $exitCode = $runningProcess->getExitCode();
                $this->logger->notice(sprintf('Process %d exited with code %d.', $task->pid, $exitCode), [
                    'stdout' => $runningProcess->getOutput(),
                    'stderr' => $runningProcess->getErrorOutput()
                ]);
                array_splice($this->runningProcesses, $i--, 1);
                --$c;

                if (array_key_exists($exitCode, $exitCodesMap)) {
                    $newStatus = $exitCodesMap[$exitCode];
                } else  {
                    $this->logger->warning(sprintf(
                        'Unsupported exit code %d for task %d.',
                        $exitCode,
                        $task->supervisorId
                    ));
                    $newStatus = HeavyTaskStatus::FINISHED;
                }
                if (!$this->isInQueue($task, HeavyTaskStatus::PAUSED)) {
                    $this->updateTaskStatus($task->supervisorId, $newStatus);
                }
            }
        }
    }

    /**
     * Update the status of a task and moves it in the corresponding queue if applicable.
     *
     * @param string $id
     * @param string $newStatus
     */
    private function updateTaskStatus(string $id, string $newStatus)
    {
        if (!array_key_exists($id, $this->data['tasks'])) {
            return ;
        }
        /** @var SupervisorTask $task */
        $task = $this->data['tasks'][$id];
        if (array_key_exists($task->status, $this->data['queues'])) {
            for ($i = 0, $c = count($this->data['queues'][$task->status]); $i < $c; ++$i) {
                if ($this->data['queues'][$task->status][$i]->supervisorId === $id) {
                    array_splice($this->data['queues'][$task->status], $i, 1);
                    break ;
                }
            }
        }
        if (array_key_exists($newStatus, $this->data['queues'])) {
            $this->data['queues'][$newStatus][] = $task;
        }
        $task->status = $newStatus;
        if ($task->status === HeavyTaskStatus::CRASHED) {
            $context = $this->sharedStorage->get(HeavyTaskContext::getStorageKey($task->publicId), SharedStorageKeys::NAMESPACE);
            $task->lastError = $context instanceof HeavyTaskContext ? $context->getError() : $task->lastError;
            $task->consecutiveCrashesCount++;
            if ($task->consecutiveCrashesCount >= $this->maxConsecutiveCrashes) {
                $this->addToHistory($task);
            }
        } else {
            $task->consecutiveCrashesCount = 0;
        }
        if ($task->status === HeavyTaskStatus::FINISHED) {
            if (!$this->maybeRequeueForRecurrence($task)) {
                $this->addToHistory($task);
            }
        }
    }

    private function maybeRequeueForRecurrence(SupervisorTask $task): bool
    {
        if ($task->recurrencePattern) {
            try {
                $cron = CronExpression::factory($task->recurrencePattern);
                $nextRunDate = $cron->getNextRunDate();
                if ($nextRunDate instanceof \DateTime) {
                    $timestamp = $nextRunDate->getTimestamp();
                    $task->time = $timestamp;
                    $task->status = HeavyTaskStatus::SCHEDULED;
                    $this->data['queues'][HeavyTaskStatus::SCHEDULED][] = $task;
                    return true;
                }
            } catch (\Throwable $e) {
                $this->logger->error(sprintf(
                    'Failed to requeue task "%s" using recurrence pattern "%s". Original error: %s',
                    $task->name,
                    $task->recurrencePattern,
                    $e->getMessage()
                ), ['task' => $task, 'exception' => $e]);
            }
        }
        return false;
    }

    /**
     * Check if a task is in a queue.
     *
     * @param SupervisorTask $task
     * @param string         $queueName
     *
     * @return boolean
     */
    private function isInQueue(SupervisorTask $task, string $queueName): bool
    {
        if (!array_key_exists($queueName, $this->data['queues'])) {
            return false;
        }
        return in_array($task, $this->data['queues'][$queueName], true);
    }

    /**
     * Archive a task.
     *
     * @param SupervisorTask $task
     */
    private function addToHistory(SupervisorTask $task)
    {
        if (array_key_exists($task->status, $this->data['queues'])) {
            $pos = array_search($task, $this->data['queues'][$task->status]);
            if ($pos !== false) {
                array_splice($this->data['queues'][$task->status], $pos, 1);
            }
        }
        array_unshift($this->data['history'], $task);
        if (count($this->data['history']) > $this->historySize) {
            array_pop($this->data['history']);
        }
        unset($this->data['tasks'][$task->supervisorId]);
    }

    /**
     * Generate a unique id for a task.
     *
     * @return string
     */
    private function generateTaskUniqueId(): string
    {
        $tries = 0;
        $maxTries = 1000;
        do {
            $id = RandomGenerator::randomString(12, RandomGenerator::HEXADECIMAL);
            if (!array_key_exists($id, $this->data['tasks'])) {
                return $id;
            }
        } while($tries < $maxTries);
        $this->logger->critical(sprintf('Failed to generate a unique id for a task after %d tries.', $tries));
    }

    /**
     * Build an array of normalized data that can be accessible from the outside to show the tasks in execution.
     *
     * @return array
     */
    private function buildPublicData(): array
    {
        $currentTime = time();
        $normalizeSupervisorTask = function(SupervisorTask $task) use($currentTime): array  {
            return [
                'id' => $task->publicId,
                'name' => $task->name,
                'description' => $task->description,
                'service' => $task->serviceName,
                'options' => $task->options,
                'startTime' => $task->time,
                'timeBeforeStartText' => $task->time && $task->time > $currentTime ? UtilPhp::human_time_diff($currentTime, $task->time, false, '') : null,
                'status' => $task->status,
                'consecutiveCrashesCount' => $task->consecutiveCrashesCount,
                'lastError' => $task->lastError
            ];
        };
        $output = [
            'active' => [],
            'history' => []
        ];
        foreach ($this->data['tasks'] as $activeTask) {
            /** @var SupervisorTask $activeTask */
            $contextData = [];
            $context = $this->sharedStorage->get(HeavyTaskContext::getStorageKey($activeTask->publicId), SharedStorageKeys::NAMESPACE);
            if ($context instanceof HeavyTaskContext) {
                $contextData = [
                    'progress' => $context->getProgress()
                ];
            }
            $output['active'][] = array_merge($normalizeSupervisorTask($activeTask), $contextData);
        }
        foreach ($this->data['history'] as $historyTask) {
            /** @var SupervisorTask $historyTask */
            $output['history'][] = $normalizeSupervisorTask($historyTask);
        }
        return $output;
    }

    /**
     * Unserialize an array of tasks.
     *
     * @param array $tasks
     *
     * @return array
     */
    private function unserializeTasks(array $tasks): array
    {
        $output = [];
        foreach ($tasks as $key => $task) {
            if (is_array($task)) {
                $output[$key] = SupervisorTask::CreateFromArray($task);
            } else if ($task instanceof SupervisorTask) {
                $output[$key] = $task;
            }
        }
        return $output;
    }
}
