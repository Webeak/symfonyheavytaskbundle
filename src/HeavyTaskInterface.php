<?php
namespace Webeak\Bundle\HeavyTaskBundle;

interface HeavyTaskInterface
{
    /**
     * User-friendly name of the task.
     *
     * @return string
     */
    public function getName(): string;

    /**
     * Optional short description of what the task is doing.
     *
     * @return string
     */
    public function getDescription(): ?string;

    /**
     * Execute the task.
     *
     * The task is responsible for making pauses in its execution to not overload the CPU.
     * The task is responsible for updating its status while its running.
     * The task MUST call "$context->markAsCompleted()" when finished otherwise the supervisor will restart it indefinitely.
     *
     * @param HeavyTaskContext $context
     */
    public function execute(HeavyTaskContext $context);
}
