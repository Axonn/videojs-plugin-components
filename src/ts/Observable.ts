///<reference path='IObservable.ts'/> 

module VjsPluginComponents {
    export class triggerableEvent {
        delegates: { (args): void; }[]; // array of functions
        constructor() {
            this.delegates = [];
        }
    }

    export class Observable implements IObservable {
        _events: { [eventName: string]: triggerableEvent; }; // dictionary

        constructor() {
            this._events = {};
        }

        on(eventName: string, delegate: (args) => void ) {
            if (this._events[eventName] == null) {
                this._events[eventName] = new triggerableEvent();
            }

            this._events[eventName].delegates.push(delegate);
        }

        trigger(eventName: string, args) {
            if (this._events[eventName] != null) {
                for (var i = 0; i < this._events[eventName].delegates.length; i++){
                    this._events[eventName].delegates[i](args);
                };
            }
        }
    }
}