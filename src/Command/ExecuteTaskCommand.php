<?php
namespace Webeak\Bundle\HeavyTaskBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Webeak\Bundle\DebugBundle\Logger;
use Webeak\Bundle\EssentialBundle\StaticLogger;
use Webeak\Bundle\HeavyTaskBundle\HeavyTaskRunner;

class ExecuteTaskCommand extends Command
{
    /** @var HeavyTaskRunner */
    private $runner;

    public function __construct(HeavyTaskRunner $runner, ?Logger $logger, string $name = null)
    {
        parent::__construct($name);
        if ($logger) {
            StaticLogger::setInstance($logger);
        }
        $this->runner = $runner;
    }

    protected function configure()
    {
        $this->setName('wb:heavy-task:execute-task')
            ->addArgument('payload', InputArgument::REQUIRED, 'Serialized SupervisorTask instance.')
            ->setDescription('Execute a task.');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        return $this->runner->run($input->getArgument('payload'));
    }
}

