import * as moment from 'moment';
import { Container } from "essentials/inversify/container";
import { VueApp } from "essentials/jquery/modules/vue-app";
import { HttpService, HttpServiceSymbol } from "essentials/network";
import { HttpResponse } from "essentials/network/http-response";
import { isUndefined, proxy } from "essentials/utils/utils";
import Vue from 'vue';
import Component from "vue-class-component";
import { ActiveTaskInterface } from "./active-task-interface";
import { TaskComponent } from "./task.component";
import { TaskInterface } from "./task.interface";
import './manager.component.css';

@Component({
    template: require('./manager.component.html'),
    components: {
        'task': TaskComponent
    }
})
export class ManagerComponent extends Vue {
    // Template vars
    public httpResponse: HttpResponse<any> = null;
    public activeTasks: ActiveTaskInterface[] = [];
    public historyTasks: TaskInterface[] = [];
    public activeTab: string = 'active';
    public ready: boolean = false;

    // Logic vars
    private http: HttpService = Container.getContainer().get(HttpServiceSymbol);

    public mounted(): void {
        window.setInterval(proxy(this.update, this), 2000);
    }

    public update(): void {
        if (this.httpResponse && this.httpResponse.isPending) {
            return ;
        }
        this.httpResponse = this.http.get('/heavy-task/ajax/supervisor-status');
        this.httpResponse.promise.then((result: {active: ActiveTaskInterface[], history: TaskInterface[]}) => {
            this.activeTasks = result.active;
            this.historyTasks = result.history;

            const merged: any = [].concat(this.activeTasks, this.historyTasks);
            for (const item of merged) {
                item.startTime = moment.unix(item.startTime as number).format('MM/DD/YYYY HH:mm:ss');
                item.active = !isUndefined(item.progress);
                item.history = true;
            }
            for (const item of this.activeTasks) {
                item.history = false;
            }
            this.ready = true;
        });
    }

    /**
     * Clear the history of finished tasks.
     */
    public clearHistory(): void {
        this.http.post('/heavy-task/ajax/clear-history');
        this.historyTasks = [];
    }
}

VueApp.RegisterComponent('manager', ManagerComponent);
