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
        if ($this->sharedStorage->get(SharedStorageKeys::SUPERVISOR_BRIDGE, SharedStorageKeys::NAMESPACE) !== null) {
            $this->logger->warning('Another supervisor instance seems to be running. The current one will replace it.');
        }
        $data = [
            'id' => $id,
            'commands' => []
        ];
        $this->sharedStorage->set(SharedStorageKeys::SUPERVISOR_BRIDGE, $data, SharedStorageKeys::NAMESPACE);
    }

    /**
     * Destroy the data associated with a supervisor.
     *
     * @param string $id
     */
    public function destroy(string $id)
    {
        $data = $this->getData($id);
        if ($data !== null) {
            $this->sharedStorage->unset(SharedStorageKeys::SUPERVISOR_BRIDGE, SharedStorageKeys::NAMESPACE);
        }
    }

    /**
     * Ask the supervisor to start a background task.
     *
     * @param integer            $id
     * @param HeavyTaskInterface $task
     * @param string             $serviceName
     * @param array              $options
     * @param integer            $startingTime
     */
    public function executeTask(int $id, HeavyTaskInterface $task, string $serviceName, array $options, int $startingTime)
    {
        $this->queueCommand(SupervisorCommands::EXECUTE_TASK, [
            'id' => $id,
            'name' => $task->getName(),
            'description' => $task->getDescription(),
            'serviceName' => $serviceName,
            'options' => $options,
            'time' => $startingTime
        ]);
    }

    /**
     * Stop the supervisor.
     */
    public function stop()
    {
        $this->queueCommand(SupervisorCommands::STOP);
    }

    /**
     * Get the list of commands to execute for a supervisor id.
     *
     * @param string $id
     *
     * @return array|null
     */
    public function getCommands(string $id)
    {
        /** @var LockInterface $lock */
        $data = $this->getAndLockData($id, $lock);
        if ($data === null) {
            $lock->release();
            return null;
        }
        $commands = [];
        foreach ($data['commands'] as $command) {
            $commands[] = new SupervisorCommand($command[0], $command[1]);
        }
        $data['commands'] = [];
        $this->sharedStorage->set(SharedStorageKeys::SUPERVISOR_BRIDGE, $data, SharedStorageKeys::NAMESPACE);
        $lock->release();
        return $commands;
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
        $data = $this->sharedStorage->getAndLockUntilNextSet(SharedStorageKeys::SUPERVISOR_BRIDGE, SharedStorageKeys::NAMESPACE, 10000, 10000, $lock);
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
