///<reference path='ITemplate.ts'/>
///<reference path='ILayer.ts'/>
///<reference path='ITimeBasedEvent.ts'/>
module VjsPluginComponents {
    export interface IOverlay {
        id: number;
        name: string;
        layer: ILayer;
        event?: ITimeBasedEvent;
    }
}