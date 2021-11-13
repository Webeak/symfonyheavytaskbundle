<?php
namespace Webeak\Bundle\HeavyTaskBundle;

/**
 * Centralize the names of the keys used to store data in the shared storage.
 */
class SharedStorageKeys
{
    // Special key for the namespace.
    const NAMESPACE = 'heavy-task';
    const SUPERVISOR_BRIDGE = 'supervisor-bridge';
    const SUPERVISOR = 'supervisor';
    const SUPERVISOR_PUBLIC = 'supervisor-public';
    const TASK_CONTEXT = 'task-context-%id%';
}
