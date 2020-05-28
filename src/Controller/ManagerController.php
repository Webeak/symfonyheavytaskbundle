<?php
namespace Webeak\Bundle\HeavyTaskBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Webeak\Bundle\EssentialBundle\Controller\JsonController;
use Webeak\Bundle\EssentialBundle\HttpFoundation\XssiSafeJsonResponse;
use Webeak\Bundle\HeavyTaskBundle\HeavyTaskManager;
use Webeak\Bundle\HeavyTaskBundle\SupervisorBridge;

class ManagerController extends JsonController
{
    /** @var SessionInterface */
    private $session;

    /** @var HeavyTaskManager */
    private $manager;

    public function __construct(SessionInterface $session, HeavyTaskManager $manager)
    {
        $this->session = $session;
        $this->manager = $manager;
    }

    /**
     * @Route(name="wb_heavy_task_manager", path="/heavy-task/manager", methods={"GET"}, condition="'dev' === '%kernel.environment%'")
     *
     * @return Response
     */
    public function manager()
    {
        return $this->render('@WebeakHeavyTask/manager.html.twig');
    }

    /**
     * @Route(name="wb_heavy_task_ajax_supervisor_status", path="/heavy-task/ajax/supervisor-status", methods={"GET"})
     *
     * @return Response
     */
    public function supervisorStatusJson(SupervisorBridge $bridge)
    {
        return new XssiSafeJsonResponse($bridge->getPublicStatus());
    }

    /**
     * @Route(name="wb_heavy_task_ajax_my_tasks_status", path="/heavy-task/ajax/my-tasks-status", methods={"GET"})
     *
     * @return Response
     */
    public function myTasksStatusJson()
    {
        return new XssiSafeJsonResponse($this->manager->getMyTasksPublicData());
    }

    /**
     * @Route(name="wb_heavy_task_ajax_forget_task", path="/heavy-task/ajax/forget-task/{id}", methods={"GET"})
     *
     * @return Response
     */
    public function forgetTaskJson($id)
    {
        return new XssiSafeJsonResponse($this->manager->forgetTask($id));
    }
}

