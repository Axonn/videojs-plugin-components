///<reference path='../definitions/JQuery.d.ts'/>
///<reference path='../definitions/dustjs-linkedin.d.ts'/>
///<reference path='TimeBasedEventManager.ts'/>
///<reference path='ObservableRepository.ts'/>
///<reference path='IObservableRepository.ts'/>
///<reference path='IObservable.ts'/>
///<reference path='IRenderEngine.ts'/>

module VjsPluginComponents {
    export class ObservableSubRepository implements VjsPluginComponents.IObservableRepository {
        _baseRepository: VjsPluginComponents.IObservableRepository;
        _objects: IEntity[];
        _observable: IObservable;

        constructor(baseRepository: VjsPluginComponents.IObservableRepository, observable: IObservable) {
            this._baseRepository = baseRepository;
            this._observable = observable;
            this._objects = [];

            this._baseRepository.on("update", (args) => {
                for (var i = 0; i < this._objects.length; i++) {
                    if (this._objects[i].id == args.entity.id) {
                        this._objects[i] = args.entity;
                        this.trigger("update", args);
                    }
                }
            });

            this._baseRepository.on("remove", (args) => {
                var originalLength = this._objects.length;
                this._objects = <IEntity[]>jQuery.grep(this._objects, (val) => { return val.id != args.id });
                if (originalLength !== this._objects.length) {
                    this.trigger("remove", { id: args.id });
                }
                return (originalLength !== this._objects.length);
            });
        }

        create(entity: IEntity) {
            var newEntity = this._baseRepository.create(entity);
            this._objects.push(newEntity);
            this.trigger("create", { entity: entity });
            return newEntity;
        }

        on(eventName: string, handler: (args) => void ) {
            this._observable.on(eventName, handler);
        }

        trigger(eventName: string, args) {
            this._observable.trigger(eventName, args);
        }

        toList() {
            return this._objects;
        }

        getEntity(id: number) {
            var foundArray = <IEntity[]>jQuery.grep(this._objects, (val) => { return val.id == id });
            if (foundArray.length != 0) {
                return foundArray[0];
            } else {
                return null;
            }
        }

        remove(id: number) {
            return this._baseRepository.remove(id);
        }

        update(entity: IEntity) {
            return this._baseRepository.update(entity);
        }

        clear() {
            for (var i = 0; i < this._objects.length; i++) {
                this._baseRepository.remove(this._objects[i].id);
            }
            this._objects = [];
            this.trigger("clear", {})
            return true;
        }
    }
}