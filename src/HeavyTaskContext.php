<?php
namespace Webeak\Bundle\HeavyTaskBundle;

use Webeak\Bundle\SharedStorageBundle\SharedStorageInterface;
use Webeak\Component\Utils\ArrayUtils;

class HeavyTaskContext
{
    /** @var SharedStorageInterface */
    private $sharedStorage;

    /** @var integer */
    private $id;

    /** @var array */
    private $options;

    /** @var string */
    private $progress;

    /** @var boolean */
    private $completed;

    /** @var string */
    private $error;

    /** @var array */
    private $storage;

    /** @var string */
    private $storageKey;

    public function __construct(SharedStorageInterface $sharedStorage, string $storageKey, int $id, array $options)
    {
        $this->sharedStorage = $sharedStorage;
        $this->storageKey = $storageKey;
        $this->id = $id;
        $this->options = ArrayUtils::ensureArray($options);
        $this->progress = null;
        $this->completed = false;
        $this->error = null;
        $this->storage = [];
    }
    
    public function setSharedStorage(SharedStorageInterface $sharedStorage)
    {
        $this->sharedStorage = $sharedStorage;
    }

    /**
     * Get the unique identifier of the task.
     *
     * @return integer
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * Get the whole array of options.
     *
     * @return array
     */
    public function getOptions(): array
    {
        return $this->options;
    }

    /**
     * Get a single option value by name.
     *
     * @param string $name
     * @param mixed  $default (optional, default: null)
     *
     * @return mixed
     */
    public function getOption(string $name, $default = null)
    {
        if (array_key_exists($name, $this->options)) {
            return $this->options[$name];
        }
        return $default;
    }

    /**
     * Any string the will be publicly visible by the end users.
     *
     * @param string $progress
     */
    public function setProgress(?string $progress)
    {
        $this->progress = $progress;
        $this->persist();
    }

    /**
     * Get the progress string.
     *
     * @return string|null
     */
    public function getProgress(): ?string
    {
        return $this->progress;
    }

    /**
     * Mark the context as "on error" and set an error message.
     *
     * @param string|null $message
     */
    public function setError(?string $message)
    {
        $this->error = $message;
    }

    /**
     * Mark the task as completed so the supervisor know not to restart it when finished.
     */
    public function markAsCompleted()
    {
        $this->completed = true;
    }

    /**
     * Check if the task has been completed.
     *
     * @return boolean
     */
    public function isCompleted(): bool
    {
        return !!$this->completed;
    }

    /**
     * Get the current error message.
     *
     * @return string|null
     */
    public function getError(): ?string
    {
        return $this->error;
    }

    /**
     * Check if an error has been defined.
     *
     * @return boolean
     */
    public function hasError(): bool
    {
        return $this->error !== null;
    }

    /**
     * Save a piece of data that will persist between calls.
     * The value must be serializable.
     *
     * @param string $key
     * @param mixed  $value
     */
    public function set(string $key, $value)
    {
        $this->storage[$key] = $value;
    }

    /**
     * Gets a piece of data from the persistent storage.
     *
     * @param string $key
     * @param mixed  $default (optional, default: null)
     *
     * @return mixed
     */
    public function get(string $key, $default = null)
    {
        if (array_key_exists($key, $this->storage)) {
            return $this->storage[$key];
        }
        return $default;
    }

    /**
     * Remove a key from the persistent storage.
     *
     * @param string $key
     */
    public function remove(string $key)
    {
        if (array_key_exists($key, $this->storage)) {
            unset($this->storage[$key]);
        }
    }

    /**
     * Persist to context to the shared storage.
     */
    public function persist()
    {
        $this->sharedStorage->set(HeavyTaskContext::getStorageKey($this->id), $this, SharedStorageKeys::NAMESPACE);
    }

    /**
     * Get the key where to store a context in the shared storage.
     *
     * @param integer $taskPublicId
     *
     * @return string
     */
    public static function getStorageKey(int $taskPublicId): string
    {
        return str_replace('%id%', $taskPublicId, SharedStorageKeys::TASK_CONTEXT);
    }

    public function __sleep()
    {
        return [
            'id',
            'options',
            'progress',
            'completed',
            'error',
            'storage',
            'storageKey'
        ];
    }
}
