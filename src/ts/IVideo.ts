///<reference path='IVideoSource.ts'/>
///<reference path='IOverlaySpecification.ts'/>

module VjsPluginComponents {
    export interface IVideo {
        id: string;
        getPlayingSource(): VjsPluginComponents.IVideoSource;
        setPlayingSource(source: IVideoSource): void;
        setPlayingMatching(matchingFunc: (sources: IVideoSource[]) => IVideoSource);
        listSourcesByType(type: string): VjsPluginComponents.IVideoSource[];
        overlays: IOverlaySpecification[];
    }
}