<?php
namespace Webeak\Bundle\HeavyTaskBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Webeak\Bundle\DebugBundle\Logger;
use Webeak\Bundle\HeavyTaskBundle\Supervisor;

class StartSupervisorCommand extends Command
{
    /** @var Supervisor */
    private $supervisor;

    /** @var Logger */
    private $logger;

    public function __construct(Supervisor $supervisor, Logger $logger, string $name = null)
    {
        parent::__construct($name);
        $this->supervisor = $supervisor;
        $this->logger = $logger;
    }

    protected function configure()
    {
        $this->setName('wb:heavy-task:start-supervisor')
             ->setDescription('Start the tasks supervisor.');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        try {
            $this->supervisor->start();
        } catch (\Throwable $e) {
            $this->logger->emergency(
                sprintf('Failed to start supervisor. Original error: "%s".', $e->getMessage()),
                ['exception' => $e]
            );
            $this->logger->persist();
        }
    }
}

