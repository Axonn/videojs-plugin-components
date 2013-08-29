///<reference path='../definitions/JQuery.d.ts'/>
///<reference path='IObservable.ts'/> 
///<reference path='ITimeBasedEventManager.ts'/> 
///<reference path='ISinglePointEvent.ts'/>
///<reference path='ITimeBasedEvent.ts'/> 
///<reference path='IEntity.ts'/>
///<reference path='IObservableRepository.ts'/>
///<reference path='IWalkableList.ts'/>
module VjsPluginComponents {

    //Note this should probably be split out into sepearte classes: one for single events, one for time based events.
    export class TimeBasedEventManager implements ITimeBasedEventManager {
        _player: IObservable;
        _handlersToTrigger: IWalkableList;
        _timeBasedEventsToTrigger: IObservableRepository;
        _previouslyWatchedSpan: { start: number; end: number; };
        static name: string = "timeBasedEventManager";

        constructor(player: IObservable, singlePointList: IWalkableList, timeBasedEventRepository: IObservableRepository) {
            this._player = player;
            this._previouslyWatchedSpan = { start: 0, end: 0 };
            this._handlersToTrigger = singlePointList;
            this._timeBasedEventsToTrigger = timeBasedEventRepository;

            this._timeBasedEventsToTrigger.on("create", (args) => { this.updateTimeBasedEventState(this._previouslyWatchedSpan.start, args.entity) });
            this._player.on("videoWatched", (args) => { this.triggerTimeBasedEvents(args); });

        }

        triggerTimeBasedEvents(args: { start: number; end: number; }) {
            if (args.start != this._previouslyWatchedSpan.end) {
                this._handlersToTrigger.reset((event) => {
                    if (args.start > event.time) {
                        return false;
                    } else if (args.start == event.time && event.boundaryType == "approach") {
                        return false;
                    } else {
                        return true;
                    }
                });

                this.updateTimeBasedEventStates(args.start);
            }

            var checkIfEventTrigger = this.CheckIfEventTriggered(args.start)(args.end);

            var event = () => { return this._handlersToTrigger.getCurrent() };

            while (!this._handlersToTrigger.isFinished() && checkIfEventTrigger(event().time)(event().boundaryType)) {
                this.triggerHandler(event().handler, event().time, args.end);
                var newEvent = event();
                newEvent++;
                this._handlersToTrigger.update(newEvent);
                this._handlersToTrigger.moveNext();
            }

            this._previouslyWatchedSpan = {
                start: args.start,
                end: args.end
            };
        }

        private CheckIfEventTriggered(startTime: number) {
            return (endTime: number) => {
                return (triggerTime: number) => {
                    return (boundaryType: string) => {
                        switch (boundaryType) {
                            case "point":
                                if (triggerTime >= startTime && triggerTime <= endTime) {
                                    return true;
                                } else {
                                    return false;
                                }
                            break;
                            case "approach":
                                if (triggerTime > startTime && triggerTime <= endTime) {
                                    return true;
                                } else {
                                    return false;
                                }
                            break;
                            case "depart":
                                if (triggerTime >= startTime && triggerTime < endTime) {
                                    return true;
                                } else {
                                    return false;
                                }
                            break;
                            default:
                                throw Error("Invalid boundary type entered: " + boundaryType + "; Valid types are: 'point', 'approach' and 'depart'");
                        }
                    }
                }
            }
        }

        private triggerHandler(handler: (args)=>void, eventTime: number, callTime: number) {
            handler({
                eventTime: eventTime,
                callTime: callTime
            });              
        }

        private updateTimeBasedEventStates(time: number) {
            var timeBasedEventsToTrigger = this._timeBasedEventsToTrigger.toList();
            for (var i = 0; i < timeBasedEventsToTrigger.length; i++) {
                var event = <ITimeBasedEvent> timeBasedEventsToTrigger[i];
                this.updateTimeBasedEventState(time, event);
            }
        }

        private updateTimeBasedEventState(time: number, event: ITimeBasedEvent) {
            if (event.isOn) {
                if (!(time >= event.startEvent.time && time <= event.endEvent.time)) {
                    this.triggerHandler(event.endEvent.handler, event.startEvent.time, time);
                }
            } else {
                // Note the Equals here. Time based events are considered "on" at their bounds.
                if (time >= event.startEvent.time && time <= event.endEvent.time) {
                    this.triggerHandler(event.startEvent.handler, event.startEvent.time, time);
                }
            }
        }

        private isPointStillToBePlayed(event: ISinglePointEvent, currentTime: number): boolean{
            if (currentTime > event.time) {
                return false;
            } else if (currentTime == event.time && event.boundaryType == "approach") {
                return false;
            } else {
                return true;
            }
        }

    }
}