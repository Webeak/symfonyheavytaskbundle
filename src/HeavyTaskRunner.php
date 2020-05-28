<?php
namespace Webeak\Bundle\HeavyTaskBundle;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Webeak\Bundle\DebugBundle\Logger;
use Webeak\Bundle\SharedStorageBundle\SharedStorageInterface;

class HeavyTaskRunner
{
    /** @var ContainerInterface */
    private $container;

    /** @var SharedStorageInterface */
    private $sharedStorage;

    /** @var Logger */
    private $logger;

    public function __construct(ContainerInterface $container, SharedStorageInterface $sharedStorage, Logger $logger)
    {
        $this->container = $container;
        $this->sharedStorage = $sharedStorage;
        $this->logger = $logger;
    }

    /**
     * Run a heavy task.
     *
     * @param string $payload
     *
     * @return integer exit code
     */
    public function run(string $payload): int
    {
        /** @var SupervisorTask $task */
        $task = null;
        $status = 1;
        try {
            $task = unserialize(base64_decode($payload));
            if (!($task instanceof SupervisorTask)) {
                throw new \InvalidArgumentException('Payload could not be decoded into a valid SupervisorTask instance.');
            }
            $service = $this->container->get($task->serviceName);
            if (!($service instanceof HeavyTaskInterface)) {
                throw new \Exception('The service must implement HeavyTaskInterface.');
            }
            $status = $this->execute($service, $task);
        } catch (\Throwable $e) {
            $this->logger->error(
                sprintf('Uncaught exception in the execution of task id "%s".', $task ? $task->supervisorId : 'Unknown'),
                ['exception' => $e, 'payload' => $payload]
            );
        }
        $this->logger->persist();
        return $status;
    }

    /**
     * Do the actual task execution.
     *
     * @param HeavyTaskInterface $task
     * @param SupervisorTask     $supervisorTask
     *
     * @return integer
     */
    private function execute(HeavyTaskInterface $task, SupervisorTask $supervisorTask)
    {
        $context = $this->loadContext($supervisorTask);
        if ($context === null) {
            return 1;
        }
        try {
            $task->execute($context);
            $context->setError(null);
        } catch (\Throwable $e) {
            $context->setError($e->getMessage());
        }
        return $this->saveContextAndRespond($context);
    }

    /**
     * Load/create the execution context for a task.
     *
     * @param SupervisorTask $supervisorTask
     *
     * @return HeavyTaskContext|null
     */
    private function loadContext(SupervisorTask $supervisorTask): ?HeavyTaskContext
    {
        try {
            $storageKey = HeavyTaskContext::getStorageKey($supervisorTask->publicId);
            $context = $this->sharedStorage->get($storageKey, SharedStorageKeys::NAMESPACE);
            if ($context instanceof HeavyTaskContext) {
                return $context;
            }
        } catch (\Throwable $e) {
            $this->logger->error(sprintf('Failed to restore context for task %d.', $supervisorTask->publicId), ['task' => $supervisorTask]);
            return null;
        }
        return new HeavyTaskContext($this->sharedStorage, $storageKey, $supervisorTask->publicId, $supervisorTask->options);
    }

    /**
     * Save/delete the context depending if the task needs to run again and return the appropriate exit code.
     *
     * @param HeavyTaskContext $context
     *
     * @return integer
     */
    private function saveContextAndRespond(HeavyTaskContext $context)
    {
        $storageKey = HeavyTaskContext::getStorageKey($context->getId());
        if ($context->isCompleted()) {
            $this->sharedStorage->unset($storageKey, SharedStorageKeys::NAMESPACE);
            return 200;
        }
        $this->sharedStorage->set($storageKey, $context, SharedStorageKeys::NAMESPACE);
        return $context->hasError() ? 1 : 0;
    }
}
