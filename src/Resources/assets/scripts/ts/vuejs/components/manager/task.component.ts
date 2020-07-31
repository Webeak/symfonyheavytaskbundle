import { Container } from "essentials/inversify/container";
import { VueApp } from "essentials/jquery/modules/vue-app";
import { HttpService, HttpServiceSymbol } from "essentials/network";
import Vue from 'vue';
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { TaskInterface } from "./task.interface";

@Component({
    template: require('./task.component.html')
})
export class TaskComponent extends Vue {
    // Computed
    get isActionRunning(): boolean {
        return this.runningAction !== null;
    }

    get isPausing(): boolean {
        return this.runningAction === 'pause';
    }

    get isResuming(): boolean {
        return this.runningAction === 'resume';
    }

    get isStopping(): boolean {
        return this.runningAction === 'stop';
    }

    // Props
    @Prop({type: Object, required: true}) public state: TaskInterface;

    // Watch
    @Watch('state.status')
    public onStatusChanged() {
        this.runningAction = null;
    }

    // Public vars
    public runningAction: string = null;

    // Private vars
    private http: HttpService;

    public created(): void {
        this.http = Container.getContainer().get(HttpServiceSymbol);
    }

    /**
     * Pause the execution of the task.
     */
    public pause(): void {
        this.http.post('/heavy-task/ajax/pause-task', {id: this.state.id});
        this.runningAction = 'pause';
    }

    /**
     * Pause the execution of the task.
     */
    public resume(): void {
        this.http.post('/heavy-task/ajax/resume-task', {id: this.state.id});
        this.runningAction = 'resume';
    }

    /**
     * Pause the execution of the task.
     */
    public stop(): void {
        this.http.post('/heavy-task/ajax/stop-task', {id: this.state.id});
        this.runningAction = 'stop';
    }
}

VueApp.RegisterComponent('manager-task', TaskComponent);
