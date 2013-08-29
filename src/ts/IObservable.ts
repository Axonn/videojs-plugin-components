///<reference path='IVideoSources.ts'/>

module VjsPluginComponents {
    export interface IObservable {
        trigger(eventName: string, args);
        on(eventName: string, delegate: (args) => void );
    }
}