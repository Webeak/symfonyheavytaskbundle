<?php
namespace Webeak\Bundle\HeavyTaskBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\Loader;

/**
 * @link http://symfony.com/doc/current/cookbook/bundles/extension.html
 */
class WebeakHeavyTaskExtension extends Extension
{
    /**
     * {@inheritdoc}
     */
    public function getAlias()
    {
        return 'wb_heavy_task';
    }

    /**
     * {@inheritdoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        $container->setParameter('wb.heavy_task.supervisor.max_parallel_processes', $config['supervisor']['max_parallel_processes']);
        $container->setParameter('wb.heavy_task.supervisor.history_size', $config['supervisor']['history_size']);
        $container->setParameter('wb.heavy_task.supervisor.max_consecutive_crashes', $config['supervisor']['max_consecutive_crashes']);
        $container->setParameter('wb.heavy_task.supervisor.tick_interval', $config['supervisor']['tick_interval']);

        $loader = new Loader\YamlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('services.yaml');
    }
}
