<?php
namespace Webeak\Bundle\HeavyTaskBundle;

class SupervisorTask
{
    /**
     * Unique incremental identifier, assigned by the HeavyTaskManager.
     *
     * @var integer
     */
    public $publicId;

    /**
     * Unique random string identifier assign by the Supervisor.
     *
     * @var string
     */
    public $supervisorId;

    /**
     * User-friendly name of the task.
     *
     * @var string
     */
    public $name;

    /**
     * Short description of the goal of the task.
     *
     * @var string
     */
    public $description;

    /**
     * Name of the service in the Symfony's container.
     *
     * @var string
     */
    public $serviceName;

    /**
     * Array of options to send to the task.
     *
     * @var array
     */
    public $options;

    /**
     * Time at which the task should be executed.
     *
     * @var integer|null
     */
    public $time;

    /**
     * Cron pattern defining the next time the task will execute.
     *
     * @var string
     */
    public $recurrencePattern;

    /**
     * Current status of the task.
     *
     * @see HeavyTaskStatus
     *
     * @var string
     */
    public $status;

    /**
     * How many time does this task failed to run?
     *
     * @var integer
     */
    public $consecutiveCrashesCount;

    /**
     * The last error encountered when running this task.
     *
     * @var string
     */
    public $lastError;

    /**
     * Id of the process running the task (if the task is running).
     *
     * @var integer|null
     */
    public $pid;
    
    public static function CreateFromArray(array $data)
    {
        $instance = new SupervisorTask();
        $instance->publicId = $data['publicId'];
        $instance->supervisorId = $data['supervisorId'];
        $instance->name = $data['name'];
        $instance->description = $data['description'];
        $instance->serviceName = $data['serviceName'];
        $instance->options = $data['options'];
        $instance->time = $data['time'];
        $instance->recurrencePattern = $data['recurrencePattern'];
        $instance->status = $data['status'];
        $instance->consecutiveCrashesCount = $data['consecutiveCrashesCount'];
        $instance->lastError = $data['lastError'];
        $instance->pid = $data['pid'];
        return $instance;
    }
}
