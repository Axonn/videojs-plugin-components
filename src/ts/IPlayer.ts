///<reference path='IVideoSources.ts'/>
///<reference path='IVideo.ts'/>

module VjsPluginComponents {
    export interface IPlayer {
        id();
        toOriginal(): any;
        dispose(): void;
        createEl(type, props): any;
        el();
        addChild(child, options?);
        children();
        on(type: string, fn);
        off(type: string, fn);
        one(type: string, fn);
        trigger(type: string, event?: any);
        show(): void;
        hide(): void;
        width(): number;
        height(): number;
        dimensions(width: number, height: number);
        currentTime(time?: number): number;
        techName(): string;
        play();
        pause();
        paused();
        options(): Object;
        duration(): number;
        setVideo(video: IVideo);
        getVideo(): IVideo;
        changeSrcResetTime(source);
        changeSrcRetainTime(source);
    }
}