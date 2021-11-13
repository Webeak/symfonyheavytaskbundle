<?php
namespace Webeak\Bundle\HeavyTaskBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Webeak\Bundle\HeavyTaskBundle\SupervisorBridge;

class StopSupervisorCommand extends Command
{
    /** @var SupervisorBridge */
    private $bridge;

    public function __construct(SupervisorBridge $bridge, string $name = null)
    {
        parent::__construct($name);
        $this->bridge = $bridge;
    }

    protected function configure()
    {
        $this->setName('wb:heavy-task:stop-supervisor')
             ->setDescription('Stop the tasks supervisor.');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->bridge->stop();
    }
}

