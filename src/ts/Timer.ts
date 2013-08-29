///<reference path='ITimer.ts'/>
///<reference path='IDateService.ts'/>
module VjsPluginComponents {
    export class Timer implements ITimer {
        _previousElapsed: number = 0;
        _elapsed: number = 0;
        _running: boolean = false;
        _lastStart: number;
        _interval: number;
        _delayService;
        _dateService: IDateService;

        constructor(delayService, dateService : IDateService) {
            this._delayService = delayService;
            this._dateService = dateService;
        }

        start() {
            if (this._running == false) {
                this._lastStart = this._dateService.getCurrentTime();
                this._interval = this._delayService.setTimeout(() => { this.renewUpdateTime() }, 100);
                this._running = true;
            };
        }

        renewUpdateTime() {
            this._interval = this._delayService.setTimeout(() => { this.renewUpdateTime() }, 100);
            this.updateTime();
        }

        updateTime() {
            var time = this._dateService.getCurrentTime() - this._lastStart;
            this._elapsed = time;
        }

        stop() {
            if (this._running == true) {
                this._previousElapsed += this._elapsed;
                this._delayService.clearTimeout(this._interval);
                this._elapsed = 0;
                this._running = false;
            }
        }

        reset() {
            this._previousElapsed = 0;
            this._elapsed = 0;
            this._lastStart = this._dateService.getCurrentTime();
        }

        getTime () {
            return (this._previousElapsed + this._elapsed);
        }
    }
}