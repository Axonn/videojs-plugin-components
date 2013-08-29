///<reference path='../definitions/JQuery.d.ts'/>
///<reference path='../definitions/dustjs-linkedin.d.ts'/>
///<reference path='ISinglePointEvent.ts'/>
///<reference path='ObservableRepository.ts'/>
///<reference path='IObservableRepository.ts'/>
///<reference path='IRenderEngine.ts'/>

module VjsPluginComponents {
    export class SinglePointEventRepository implements VjsPluginComponents.IObservableRepository {
        _baseRepository: VjsPluginComponents.IObservableRepository;

        constructor(baseRepository: VjsPluginComponents.IObservableRepository) {
            this._baseRepository = baseRepository;
        }

        create(singlePointEvent: ISinglePointEvent) {
            singlePointEvent.boundaryType = singlePointEvent.boundaryType || "point"
            singlePointEvent.callCount = 0;
            return <ISinglePointEvent> this._baseRepository.create(singlePointEvent);
        }

        on(eventName: string, handler: (args) => void ) {
            this._baseRepository.on(eventName, handler);
        }

        trigger(eventName: string, args) {
            this._baseRepository.trigger(eventName, args);
        }

        toList() {
            return <ISinglePointEvent[]>this._baseRepository.toList();
        }

        getEntity(id: number) {
            return <ISinglePointEvent>this._baseRepository.getEntity(id);
        }

        remove(id: number) {
            return this._baseRepository.remove(id);
        }

        update(singlePointEvent: ISinglePointEvent) {
            return this._baseRepository.update(singlePointEvent);
        }

        clear() {
            return this._baseRepository.clear();
        }
    }
}