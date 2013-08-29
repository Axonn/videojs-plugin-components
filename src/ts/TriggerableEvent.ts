module VjsPluginComponents {
    export class TriggerableEvent {
        delegates: { (): void; }[]; // array of functions
        constructor() {
            this.delegates = [];
        }
    }
}