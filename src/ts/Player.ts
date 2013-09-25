///<reference path='../definitions/JQuery.d.ts'/>
///<reference path='../definitions/VideoJS.d.ts'/>
///<reference path='IPlayer.ts'/>
///<reference path='IVideoSource.ts'/>
///<reference path='DefaultVideo.ts'/>

//import vjs = module(_V_);

module VjsPluginComponents {
    export class Player implements VjsPluginComponents.IPlayer {
        _player: _V_.IPlayer;
        _sourceMatchFunc: (a: IVideoSource) => (b: IVideoSource[]) => any;

        constructor(player: _V_.IPlayer, sourceMatchFunc?: (a: IVideoSource) => (b: IVideoSource[]) => any) {
            this._player = player;

            this._sourceMatchFunc = sourceMatchFunc || (original) => (sources) => { return sources[0] };

            //Hack until a better way is divised to store state about the player.
            if (typeof this._player["setVideo"] === "undefined") { 
                this._player["setVideo"] = new DefaultVideo(this._player, (src) => {
                    return this.src(src);
                });
            }
            //this.videos = [this.getVideo()];
        }

        id() {
            return this._player.id();
        }

        getVideo() {
            return <IVideo>this._player["setVideo"];
        }

        setVideo(video: IVideo) {
            //Curry Magic :)
            var matchFunc = this._sourceMatchFunc(this._player["setVideo"].getPlayingSource());
            video.setPlayingMatching(matchFunc);
            this._player["setVideo"] = video;
            this.trigger("videoChange");
        }

        toOriginal() {
            return this._player;
        }

        dispose(): void {
            this._player.dispose();
        }

        createEl(type, props): any {
            this._player.createEl(type, props);
        }

        el() {
            return this._player.el();
        }

        addChild(child, options?) {
            this._player.addChild(child, options);
        }

        children() {
            return this._player.children();
        }

        on(type: string, fn) {
            this._player.on(type, fn);
        }

        off(type: string, fn) {
            this._player.off(type, fn);
        }

        one(type: string, fn) {
            this._player.one(type, fn);
        }

        trigger(type: string, event?: any) {
            var args = event || {};
            this._player.trigger({ type: type, target: this._player, args: args });
        }

        show(): void {
            this._player.show();
        }

        hide(): void {
            this._player.hide();
        }

        width(): number {
            return this._player.width();
        }

        height(): number {
            return this._player.height();
        }

        dimensions(width: number, height: number) {
            this._player.dimensions(width, height);
        }

        currentTime(time?: string): number {
            return (Math.round(this._player.currentTime(time) * 100) / 100);
        }

        techName(): string {
            return this._player.techName;
        }

        play(): void {
            this._player.play();
        }

        pause(): void {
            this._player.pause();
        }

        paused(): void {
            return this._player.paused();
        }

        options(): Object {
            return this._player.options();
        }

        src(source?): Object {
            if (source === undefined) {
                return this._player.src();
            } else {
                var videoContinued = false;
                var wasPaused = this._player.paused();
                this._player.pause();
                var oldTime = this._player.currentTime();

                var continueVideo = () => {
                    if (this.duration() === 0 || this.src() !== source) {
                        if (!videoContinued) {
                            this._player.currentTime(oldTime);
                            if (!wasPaused) {
                                this._player.play();
                            }
                            videoContinued = true;
                        }
                        this.off('loadedmetadata', continueVideo);
                        this.off('durationset', continueVideo);
                    }
                }

                this.on('loadedmetadata', continueVideo);
                this.on('durationset', continueVideo);

                return this._player.src(source);
            }
        }

        changeSrcResetTime(source): Object {
            if (source === undefined) {
                return this._player.src();
            } else {
                this.one('loadedmetadata', () => {
                    this._player.currentTime("0");
                    this._player.play();
                });
                return this._player.src(source);
            }
        }

        changeSrcRetainTime(source): Object {
            if (source === undefined) {
                return this._player.src();
            } else {
                var oldTime = this._player.currentTime();

                this.one('loadedmetadata', () => {
                    this._player.currentTime(oldTime);
                    this._player.play();
                });
                return this._player.src(source);
            }
        }

        duration(): number {
            return (Math.round(this._player.duration() * 100) / 100);
        }

        getVideoOffset() {
            var aspects = this.getVideo().aspectRatio.split(":");
            var aspectRatio = parseFloat(aspects[0]) / parseFloat(aspects[1]);
            var x = (this.width() - (this.height() * aspectRatio)) / 2;
            var y = (this.height() - (this.width() / aspectRatio)) / 2;
            if (x < 0) {
                x = 0;
            }
            if (y < 0) {
                y = 0;
            }
            return {
                x: x,
                y: y
            };
        }
    }
}