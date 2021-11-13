<?php
namespace Webeak\Bundle\HeavyTaskBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * @link http://symfony.com/doc/current/cookbook/bundles/configuration.html
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritdoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder('wb_heavy_task');
        if (method_exists($treeBuilder, 'getRootNode')) {
            $rootNode = $treeBuilder->getRootNode();
        } else {
            $rootNode = $treeBuilder->root('wb_heavy_task');
        }
        $rootNode
            ->children()
                ->arrayNode('supervisor')
                    ->addDefaultsIfNotSet()
                    ->children()
                        ->integerNode('tick_interval')
                            ->info('Amount of time to pause the supervisor between two ticks (in milliseconds).')
                        ->end()
                        ->integerNode('max_parallel_processes')
                            ->info('The maximum number of tasks that can run simultaneously. Will be infinite if <= 0.')
                        ->end()
                        ->integerNode('history_size')
                            ->info('The maximum number of finished tasks stored in the history.')
                        ->end()
                        ->integerNode('max_consecutive_crashes')
                            ->info('How many consecutive crashes are allowed before abandoning a task.')
                        ->end()
                    ->end()
                ->end()
            ->end()
        ;
        return $treeBuilder;
    }
}
