<?php
namespace Webeak\Bundle\HeavyTaskBundle;

class HeavyTaskStatus
{
    /**
     * The task is registered but will not start until the time has come.
     */
    const SCHEDULED = 'scheduled';

    /**
     * The task is queued for start, it will run as soon as a running slot is available.
     */
    const WAITING = 'waiting';

    /**
     * The task is currently running.
     */
    const RUNNING = 'running';

    /**
     * When a task is paused, it is totally ignored by the supervisor.
     * You have to unpause it to put it back in the scheduled queue.
     */
    const PAUSED = 'paused';

    /**
     * The task has stopped without confirming that everything went right to the supervisor.
     * The supervisor will restart it as soon as possible.
     */
    const CRASHED = 'crashed';

    /**
     * The task has been stopped before completion.
     */
    const ABORTED = 'aborted';

    /**
     * The task has finished its execution with success.
     */
    const FINISHED = 'finished';
}
