<?php
namespace Webeak\Bundle\HeavyTaskBundle;

class SupervisorCommands
{
    /**
     * Execute a HeavyTaskInterface as a background job.
     */
    const EXECUTE_TASK = 'execute-task';

    /**
     * The the supervisor instance.
     */
    const STOP = 'stop';
}
