<?php
namespace Webeak\Bundle\HeavyTaskBundle;

class SupervisorCommand
{
    /** @var string */
    public $name;

    /** @var mixed */
    public $payload;

    public function __construct(string $name, $payload)
    {
        $this->name = $name;
        $this->payload = $payload;
    }
}
