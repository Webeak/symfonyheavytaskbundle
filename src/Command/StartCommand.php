<?php
namespace Webeak\Bundle\HeavyTaskBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Webeak\Bundle\DebugBundle\Logger;
use Webeak\Bundle\EssentialBundle\StaticLogger;
use Webeak\Bundle\HeavyTaskBundle\HeavyTaskManager;

class StartCommand extends Command
{
    /** @var HeavyTaskManager */
    private $manager;

    public function __construct(HeavyTaskManager $manager, ?Logger $logger, string $name = null)
    {
        parent::__construct($name);
        if ($logger) {
            StaticLogger::setInstance($logger);
        }
        $this->manager = $manager;
    }

    protected function configure()
    {
        $this->setName('wb:heavy-task:start')
            ->addArgument('fqcn', InputArgument::REQUIRED, 'The FQCN of the task to execute.')
            ->addOption('unique', 'u', InputOption::VALUE_NONE, 'Ensure the task only execute if not already running.')
            ->addOption('recurring', 'r', InputOption::VALUE_OPTIONAL, 'Define a recurrence pattern.')
            ->addOption('options', null, InputOption::VALUE_OPTIONAL, 'Accepts a JSON string as an option.', '{}')
            ->setDescription('Start a task.');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $options = [];
        if ($input->getOption('unique')) {
            $options['unique'] = true;
        }
        $customOptions = $input->getOption('options');
        if ($customOptions !== null) {
            $customOptions = @json_decode($customOptions, true);
            if (is_array($customOptions)) {
                $options = array_merge($customOptions, $options);
            }
        }
        return $this->manager->start($input->getArgument('fqcn'), $options, null, $input->getOption('recurring'));
    }
}
