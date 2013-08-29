module VjsPluginComponents {
    export interface ISinglePointEvent {
        id?: number;
        time: number;
        handler: (args) => void;
        boundaryType?: string;
        callCount?: number;
        maxCallCount?: number;
    }
}