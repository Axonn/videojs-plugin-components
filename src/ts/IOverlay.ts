///<reference path='ITemplate.ts'/>
///<reference path='ILayer.ts'/>
///<reference path='ITimeBasedEvent.ts'/>
module VjsPluginComponents {
    export interface IOverlay {
        id: number;
        layer: ILayer;
        event?: ITimeBasedEvent;
    }
}