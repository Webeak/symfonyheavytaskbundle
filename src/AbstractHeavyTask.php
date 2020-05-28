<?php
namespace Webeak\Bundle\HeavyTaskBundle;

use Webeak\Bundle\DebugBundle\Logger;
use Webeak\Bundle\SharedStorageBundle\SharedStorageInterface;

abstract class AbstractHeavyTask implements HeavyTaskInterface
{
    /** @var SharedStorageInterface */
    protected $sharedStorage;

    /** @var Logger */
    protected $logger;

    public function __construct(SharedStorageInterface $sharedStorage, Logger $logger)
    {
        $this->sharedStorage = $sharedStorage;
        $this->logger = $logger;
    }

    /**
     * @inheritDoc
     */
    abstract public function getName(): string;

    /**
     * @inheritDoc
     */
    abstract public function execute(HeavyTaskContext $context);

    /**
     * @inheritDoc
     */
    public function getDescription(): ?string
    {
        return null;
    }
}
