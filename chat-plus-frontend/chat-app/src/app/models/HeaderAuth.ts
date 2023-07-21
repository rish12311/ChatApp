import { WebSocketSubjectConfig } from 'rxjs/webSocket';

export interface HeaderAuth extends WebSocketSubjectConfig<any> {
    headers: { [header: string]: string | string[] };
}