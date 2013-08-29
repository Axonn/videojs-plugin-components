///<reference path='../definitions/JQuery.d.ts'/>
///<reference path='Observable.ts'/>
///<reference path='IPlayer.ts'/>

module VjsPluginComponents {
    export class PlayObserver extends Observable {
        _watchStartTime: number;
        _player: IPlayer;
        _seeking: boolean= false;
        static name: string = "playerAnalyticsObserver";

        constructor(player: IPlayer) {
            super();

            try {
                this._watchStartTime = 0;

                this._player = player;
                this._player.on("timeupdate", () => { this.triggerVideoWatched() });

                this._player.on("seeked", () => { this.resetWatchTime() });
                this._player.on("seeking", () => { this.resetWatchTime() });
                this._player.on("playing", () => { this._seeking = false });
                this._player.on("canplay", () => { this._seeking = false });
                this._player.on("canplaythrough", () => { this._seeking = false });

                this._player = player;
            }
            catch (error) {
                this._player.trigger("error", error);
            }
        }

        triggerVideoWatched() {
            if (Math.abs(this._watchStartTime - this.getFixedCurrentTime()) > 0.5) {
                this.resetWatchTime();
            }

            var currentTime = this.getFixedCurrentTime();

            this.trigger("videoWatched", {
                start: this._watchStartTime,
                end: currentTime
            });
            this._watchStartTime = currentTime;
        }

        resetWatchTime() {
            this._watchStartTime = this.getFixedCurrentTime();
        }

        getFixedCurrentTime() {
            if (typeof this._player.duration() === "undefined" || this._player.currentTime() < this._player.duration()) {
                return this._player.currentTime()
            } else {
                return this._player.duration()
            }
        }
    }
}