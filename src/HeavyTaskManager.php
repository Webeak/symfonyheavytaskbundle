<?php
namespace Webeak\Bundle\HeavyTaskBundle;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Webeak\Bundle\DebugBundle\Logger;
use Webeak\Bundle\SharedStorageBundle\SharedStorageInterface;
use Webeak\Component\Utils\ArrayUtils;

class HeavyTaskManager
{
    const SESSION_STORAGE_KEY = 'wb:heavy-task:manager';

    /** @var ContainerInterface */
    private $container;

    /** @var SessionInterface */
    private $session;

    /** @var SharedStorageInterface */
    private $sharedStorage;

    /** @var Logger */
    private $logger;

    /** @var SupervisorBridge */
    private $bridge;

    public function __construct(ContainerInterface $container,
                                SessionInterface $session,
                                SharedStorageInterface $sharedStorage,
                                Logger $logger,
                                SupervisorBridge $bridge)
    {
        $this->container = $container;
        $this->session = $session;
        $this->sharedStorage = $sharedStorage;
        $this->logger = $logger;
        $this->bridge = $bridge;
    }

    /**
     * Start a task in background.
     *
     * @param string  $serviceName
     * @param array   $options      (optional, default: [])
     * @param integer $startingTime (optional, default: null) If you want to delay the start. The task will start immediately if not defined.
     */
    public function start(string $serviceName, array $options = [], $startingTime = null)
    {
        $serviceInstance = $this->container->get($serviceName);
        if (!($serviceInstance instanceof HeavyTaskInterface)) {
            $this->logger->error(sprintf('The service "%s" cannot be used as a heavy task because it doesn\'t implement the HeavyTaskInterface interface.', $serviceName));
            return ;
        }
        $id = $this->generateTaskId();
        $this->logger->debug(sprintf('Starting task "%s".', $serviceName), ['id' => $id]);
        $this->bridge->executeTask($id, $serviceInstance, $serviceName, $options, $startingTime !== null ? intval($startingTime) : time());
        $sessionData = ArrayUtils::ensureArray($this->session->get(self::SESSION_STORAGE_KEY));
        if (!array_key_exists('tasks', $sessionData)) {
            $sessionData['tasks'] = [];
        }
        $sessionData['tasks'][] = $id;
        $this->session->set(self::SESSION_STORAGE_KEY, $sessionData);
    }

    /**
     * Get the public data of the tasks associated with the current session.
     *
     * @return array
     */
    public function getMyTasksPublicData(): array
    {
        $tasksIds = ArrayUtils::ensureArray(ArrayUtils::getValue($this->session->get(self::SESSION_STORAGE_KEY), 'tasks'));
        if (!count($tasksIds)) {
            return [];
        }
        $output = [];
        $supervisorStatus = $this->bridge->getPublicStatus();
        foreach ($tasksIds as $taskId) {
            /** @var integer $taskId */
            foreach (['active', 'history'] as $type) {
                foreach ($supervisorStatus[$type] as $task) {
                    if ($task['id'] === $taskId) {
                        $output[] = $task;
                        continue 3;
                    }
                }
            }
        }
        return $output;
    }

    /**
     * Remove a task from the session so it is not returned anymore by getMyTasksPublicData().
     *
     * @param integer $id
     */
    public function forgetTask($id)
    {
        $sessionData = ArrayUtils::ensureArray($this->session->get(self::SESSION_STORAGE_KEY));
        if (!array_key_exists('tasks', $sessionData)) {
            return ;
        }
        $pos = array_search($id, $sessionData['tasks']);
        if ($pos !== false) {
            array_splice($sessionData['tasks'], $pos, 1);
            if (count($sessionData['tasks']) > 0) {
                $this->session->set(self::SESSION_STORAGE_KEY, $sessionData);
            } else {
                $this->session->remove(self::SESSION_STORAGE_KEY);
            }
        }
    }

    /**
     * Generates a unique task id.
     *
     * @return integer
     */
    private function generateTaskId(): int
    {
        $newId = intval($this->sharedStorage->getAndLockUntilNextSet('id-increment', 'heavy-task')) + 1;
        $this->sharedStorage->set('id-increment', $newId, 'heavy-task');
        return $newId;
    }
}
