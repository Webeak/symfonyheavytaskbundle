<?php
namespace Webeak\Bundle\HeavyTaskBundle;

class SupervisorCommands
{
    /**
     * Execute a HeavyTaskInterface as a background job.
     */
    const EXECUTE_TASK = 'execute-task';

    /**
     * Pause a task.
     */
    const PAUSE_TASK = 'pause-task';

    /**
     * Resume a task.
     */
    const RESUME_TASK = 'resume-task';

    /**
     * Stop a task.
     */
    const STOP_TASK = 'stop-task';

    /**
     * Clear the history of finished tasks.
     */
    const CLEAR_HISTORY = 'clear-history';

    /**
     * The the supervisor instance.
     */
    const STOP = 'stop';
}
