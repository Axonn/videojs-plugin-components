///<reference path='../definitions/JQuery.d.ts'/>
///<reference path='../definitions/dustjs-linkedin.d.ts'/>
///<reference path='ITimeBasedEvent.ts'/>
///<reference path='ObservableRepository.ts'/>
///<reference path='IObservableRepository.ts'/>
///<reference path='IRenderEngine.ts'/>

module VjsPluginComponents {
    export class TimeBasedEventRepository implements VjsPluginComponents.IObservableRepository {
        _baseRepository: VjsPluginComponents.IObservableRepository;
        _singlePointEventRepository: VjsPluginComponents.IObservableRepository;

        constructor(baseRepository: VjsPluginComponents.IObservableRepository, singlePointEventRepository: VjsPluginComponents.IObservableRepository) {
            this._baseRepository = baseRepository;
            this._singlePointEventRepository = singlePointEventRepository;
        }

        create(timeBasedEvent: ITimeBasedEvent) {
            if (typeof timeBasedEvent.isOn === "undefined") {
                timeBasedEvent.isOn = false;
            }

            timeBasedEvent.startEvent.boundaryType = timeBasedEvent.startEvent.boundaryType || "point";
            timeBasedEvent.endEvent.boundaryType = timeBasedEvent.endEvent.boundaryType || "depart";

            timeBasedEvent.startEvent = this.addAdditionalFunctionalityToEvent(timeBasedEvent.startEvent, () => { timeBasedEvent.isOn = true; });
            timeBasedEvent.endEvent = this.addAdditionalFunctionalityToEvent(timeBasedEvent.endEvent, () => { timeBasedEvent.isOn = false; });

            timeBasedEvent.startEvent = <ISinglePointEvent>this._singlePointEventRepository.create(timeBasedEvent.startEvent);
            timeBasedEvent.endEvent = <ISinglePointEvent>this._singlePointEventRepository.create(timeBasedEvent.endEvent);

            //this.updateTimeBasedEventState(this._previouslyWatchedSpan.start, event);

            return <ITimeBasedEvent> this._baseRepository.create(timeBasedEvent);
        }

        on(eventName: string, handler: (args) => void ) {
            this._baseRepository.on(eventName, handler);
        }

        trigger(eventName: string, args) {
            this._baseRepository.trigger(eventName, args);
        }

        toList() {
            return <ITimeBasedEvent[]>this._baseRepository.toList();
        }

        getEntity(id: number) {
            return <ITimeBasedEvent>this._baseRepository.getEntity(id);
        }

        remove(id: number) {
            var entity = this.getEntity(id);

            this._singlePointEventRepository.remove(entity.endEvent.id);
            this._singlePointEventRepository.remove(entity.startEvent.id);

            return this._baseRepository.remove(id);
        }

        update(singlePointEvent: ITimeBasedEvent) {
            return this._baseRepository.update(singlePointEvent);
        }

        clear() {
            return this._baseRepository.clear();
        }

        private addAdditionalFunctionalityToEvent(event: ISinglePointEvent, func: (args) => void) {
            return {
                time: event.time,
                handler: (args) => {
                    func(args);
                    event.handler(args);
                },
                maxCallCount: event.maxCallCount,
                boundaryType: event.boundaryType,
                callCount: event.callCount,
                id: event.id
            }
        }
    }
}