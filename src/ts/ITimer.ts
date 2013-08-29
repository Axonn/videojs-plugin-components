module VjsPluginComponents {
    export interface ITimer {
        start(): void;
        stop(): void;
        reset(): void;
        getTime(): void;
    }
}