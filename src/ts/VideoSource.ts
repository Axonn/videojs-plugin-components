///<reference path='IVideoSource.ts'/>

module VjsPluginComponents {
    export class VideoSource implements IVideoSource{
        resolution: string;
        type: string;
        src: string;

        constructor(source) {
            this.src = source.src;
            this.type = source.type;
            this.resolution = this.getResolutionFromSource(source);
        }

        getResolutionFromSource(source) {
            return source["data-resolution"].match("[0-9]*")[0];
        }
    }
}