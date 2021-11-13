<?php
namespace Webeak\Bundle\HeavyTaskBundle;

use Webeak\Bundle\DebugBundle\Logger;
use Webeak\Bundle\SharedStorageBundle\LockInterface;
use Webeak\Bundle\SharedStorageBundle\SharedStorageInterface;

class SupervisorBridge
{
    /** @var SharedStorageInterface */
    private $sharedStorage;

    /** @var Logger */
    private $logger;

    public function __construct(SharedStorageInterface $sharedStorage, Logger $logger)
    {
        $this->sharedStorage = $sharedStorage;
        $this->logger = $logger;
    }

    /**
     * Initialize the bridge, loading
     *
     * @param string $id id of the supervisor
     */
    public function initialize(string $id)
    {
        $data = [
            'id' => $id,
            'commands' => []
        ];
        $existingData = $this->sharedStorage->getAndLockUntilNextSet(SharedStorageKeys::SUPERVISOR_BRIDGE, SharedStorageKeys::NAMESPACE, 5, 30);
        if ($existingData !== null) {
            if (array_key_exists('id', $existingData) && $existingData['id'] !== null) {
                $this->logger->warning('Another supervisor instance seems to be running. The current one will replace it.');
            }
            // We don't want to loose commands in queue.
            $data = $existingData;
            // But we do want to remove STOP commands, otherwise the process will stop immediately.
            $data['commands'] = array_filter($data['commands'], function($item) {
                return $item[0] !== SupervisorCommands::STOP;
            });
            $data['id'] = $id;
        }
        $this->sharedStorage->set(SharedStorageKeys::SUPERVISOR_BRIDGE, $data, SharedStorageKeys::NAMESPACE);
    }

    /**
     * Destroy the data associated with a supervisor.
     *
     * @param string $id
     */
    public function destroy(string $id)
    {
        /** @var LockInterface $lock */
        $data = $this->getAndLockData($id, $lock);
        if ($data !== null) {
            $data['id'] = null;
            $this->sharedStorage->set(SharedStorageKeys::SUPERVISOR_BRIDGE, $data, SharedStorageKeys::NAMESPACE);
        }
        $lock->release();
    }

    /**
     * Ask the supervisor to start a background task.
     *
     * @param integer            $id
     * @param HeavyTaskInterface $task
     * @param string             $serviceName
     * @param array              $options
     * @param integer            $startingTime
     * @param string|null        $recurrencePattern
     */
    public function executeTask(int $id, HeavyTaskInterface $task, string $serviceName, array $options, int $startingTime, ?string $recurrencePattern)
    {
        $this->queueCommand(SupervisorCommands::EXECUTE_TASK, [
            'id' => $id,
            'name' => $task->getName(),
            'description' => $task->getDescription(),
            'serviceName' => $serviceName,
            'options' => $options,
            'time' => $startingTime,
            'recurrencePattern' => $recurrencePattern
        ]);
    }

    /**
     * Pause a task by id.
     *
     * @param integer $id
     */
    public function pauseTask(int $id)
    {
        $this->queueCommand(SupervisorCommands::PAUSE_TASK, ['id' => $id]);
    }

    /**
     * Resume the execution of a task by id.
     *
     * @param integer $id
     */
    public function resumeTask(int $id)
    {
        $this->queueCommand(SupervisorCommands::RESUME_TASK, ['id' => $id]);
    }

    /**
     * Stop the execution of a task and archive it.
     *
     * @param integer $id
     */
    public function stopTask(int $id)
    {
        $this->queueCommand(SupervisorCommands::STOP_TASK, ['id' => $id]);
    }

    /**
     * Clear the history of finished tasks.
     */
    public function clearHistory()
    {
        $this->queueCommand(SupervisorCommands::CLEAR_HISTORY);
    }

    /**
     * Stop the supervisor.
     */
    public function stop()
    {
        $this->queueCommand(SupervisorCommands::STOP);
    }

    /**
     * Get the next command in queue.
     *
     * @param string $id supervisor id
     *
     * @return SupervisorCommand|null|false
     */
    public function getNextCommand(string $id)
    {
        /** @var LockInterface $lock */
        $data = $this->getAndLockData($id, $lock);
        if ($data === null) {
            $lock->release();
            return false;
        }
        $command = array_shift($data['commands']);
        if ($command === null) {
            $lock->release();
            return null;
        }
        $supervisorCommand = new SupervisorCommand($command[0], $command[1]);
        $this->sharedStorage->set(SharedStorageKeys::SUPERVISOR_BRIDGE, $data, SharedStorageKeys::NAMESPACE);
        return $supervisorCommand;
    }

    /**
     * Get the whole storage array associated with a supervisor.
     *
     * @param string $id
     *
     * @return array|null
     */
    public function getData(string $id)
    {
        $data = $this->sharedStorage->get(SharedStorageKeys::SUPERVISOR_BRIDGE, SharedStorageKeys::NAMESPACE);
        if (!is_array($data) || $data['id'] !== $id) {
            return null;
        }
        return $data;
    }

    /**
     * Get the whole public status of the supervisor.
     */
    public function getPublicStatus()
    {
        $result = $this->sharedStorage->get(SharedStorageKeys::SUPERVISOR_PUBLIC, SharedStorageKeys::NAMESPACE);
        if (!is_array($result)) {
            return [
                'active' => [],
                'history' => []
            ];
        }
        return $result;
    }

    /**
     * Get the whole storage array associated with a supervisor and lock the key.
     *
     * @param string        $id
     * @param LockInterface &$lock
     *
     * @return mixed|null
     */
    private function getAndLockData(string $id, &$lock)
    {
        $data = $this->sharedStorage->getAndLockUntilNextSet(SharedStorageKeys::SUPERVISOR_BRIDGE, SharedStorageKeys::NAMESPACE, 5, 10, $lock);
        if (!is_array($data) || $data['id'] !== $id) {
            return null;
        }
        return $data;
    }

    /**
     * Queue a command for execution.
     *
     * @param string $name
     * @param mixed  $payload (optional, default: null)
     */
    private function queueCommand(string $name, $payload = null)
    {
        $data = $this->sharedStorage->getAndLockUntilNextSet(SharedStorageKeys::SUPERVISOR_BRIDGE, SharedStorageKeys::NAMESPACE);
        $data['commands'][] = [$name, $payload];
        $this->sharedStorage->set(SharedStorageKeys::SUPERVISOR_BRIDGE, $data, SharedStorageKeys::NAMESPACE);
    }
}
