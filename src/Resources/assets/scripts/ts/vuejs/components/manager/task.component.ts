import { VueApp } from "essentials/jquery/modules/vue-app";
import Vue from 'vue';
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { TaskInterface } from "./task.interface";

@Component({
    template: require('./task.component.html')
})
export class TaskComponent extends Vue {
    // Props
    @Prop({type: Object, required: true}) public state: TaskInterface;
}

VueApp.RegisterComponent('manager-task', TaskComponent);
