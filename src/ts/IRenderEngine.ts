///<reference path='ITemplate.ts'/>
module VjsPluginComponents {
    export interface IRenderEngine {
        render: (templateName: string, model, callback: (err, out) => void) => {};
    }
}