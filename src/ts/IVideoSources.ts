///<reference path='IVideoSource.ts'/>

module VjsPluginComponents {
    export interface IVideoSources {
        getSelected(): VjsPluginComponents.IVideoSource;
        setSelected(source: IVideoSource): void;
        listByType(type: string): VjsPluginComponents.IVideoSource[];
    }
}