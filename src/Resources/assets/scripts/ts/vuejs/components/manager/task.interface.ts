import * as moment from 'moment';

export interface TaskInterface {
    id: number;
    active: boolean;
    name: string;
    description: string;
    service: string;
    options: object;
    startTime: moment.Moment;
    status: string;
    consecutiveCrashesCount: number;
    lastError: string;
    history: boolean;
}
