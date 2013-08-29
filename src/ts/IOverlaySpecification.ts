///<reference path='ITemplate.ts'/>
///<reference path='ILayerSpecification.ts'/>
module VjsPluginComponents {
    export interface IOverlaySpecification extends ILayerSpecification {
        displayTimes: { type: string; start: (duration: number) => number; end: (duration: number) => number; }[];
        events: {}; //Can't describe this object in typescript AFAIK.
    }
}