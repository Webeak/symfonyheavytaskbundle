<?php
namespace Webeak\Bundle\HeavyTaskBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Webeak\Bundle\HeavyTaskBundle\DependencyInjection\WebeakHeavyTaskExtension;

class WebeakHeavyTaskBundle extends Bundle
{
    /**
     * {@inheritdoc}
     */
    public function getContainerExtension()
    {
        return new WebeakHeavyTaskExtension();
    }
}
