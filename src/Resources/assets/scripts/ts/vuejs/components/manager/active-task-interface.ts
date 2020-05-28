import { TaskInterface } from "./task.interface";

export interface ActiveTaskInterface extends TaskInterface {
    progress: string;
}
