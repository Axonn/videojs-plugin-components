///<reference path='ISinglePointEvent.ts'/>

module VjsPluginComponents {
    export interface ITimeBasedEvent {
        id?: number;
        startEvent: ISinglePointEvent;
        endEvent: ISinglePointEvent;
        isOn?: boolean;
    }
}