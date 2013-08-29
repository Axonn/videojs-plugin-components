///<reference path='ITimeBasedEvent.ts'/>
///<reference path='ISinglePointEvent.ts'/>
module VjsPluginComponents {
    export interface ITimeBasedEventManager {
        triggerTimeBasedEvents: (args: { start: number; end: number; }) => void;
        //registerSingleEvent: (event: ISinglePointEvent) => ISinglePointEvent;
        //registerTimeBasedEvent: (event: ITimeBasedEvent) => ITimeBasedEvent;
    }
}