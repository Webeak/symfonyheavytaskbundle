# Heavy task bundle

Offers an easy way to execute heavy workload requests, either by segmenting the process 
or by executing it in the background.

- [Installation](#installation)

## Installation

First ensure you have added the endpoint `https://symfony-recipes.webeak.fr` to your `composer.json` file, 
so `flex` can find the recipe :

```json
{
    [...]
    "extra": {
        "symfony": {
            "endpoint": "https://symfony-recipes.webeak.fr"
        }
    }
}
```

You can then install the bundle:

```bash
composer require webeak-heavy-task
```

### Register the supervisor

For the bundle to work properly, you must ensure the supervisor is running at all time.
Its role is to manage tasks queues, and monitor running tasks.

#### Using supervisord

Create a file at `/etc/supervisor/conf.d/[PROJECT_NAME]-heavy-task-worker.conf` and enter the file contents:

```
[program:[PROJECT_NAME]-heavy-task-supervisor]
command=php /var/www/vhosts/project-name/httpdocs/bin/console wb:heavy-task:start-supervisor
autostart=true
autorestart=true
user=bob
redirect_stderr=true
stdout_logfile=/var/www/vhosts/project-name/logs/heavy-task-supervisor.log
``` 

**To install supervisor:**

[Debian / Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-manage-supervisor-on-ubuntu-and-debian-vps)
