///<reference path='../definitions/JQuery.d.ts'/>
///<reference path='GetNextFreeId.ts'/>
///<reference path='IEntity.ts'/>
///<reference path='IObservableRepository.ts'/>
///<reference path='IObservable.ts'/>
module VjsPluginComponents {
    export class ObservableRepository implements IObservableRepository {
        _objects: IEntity[];
        _observable: IObservable;
        _idCount: number;

        constructor(observable : IObservable) {
            this._objects = [];
            this._observable = observable;
            this._idCount = 1;
        }

        create(entity: IEntity) {
            entity.id = this._idCount;
            this._idCount++;
            this._objects.push(entity);
            this.trigger("create", { entity: entity });
            return entity;
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
            var originalLength = this._objects.length;
            this._objects = <IEntity[]>jQuery.grep(this._objects, (val) => { return val.id != id });
            this.trigger("remove", { id: id });
            return (originalLength !== this._objects.length);
        }

        update(entity: IEntity) {
            var index = this.getIndexForId(entity.id);
            var hasUpdated = false;
            if (index !== null) {
                this._objects[index] = entity;
                hasUpdated = true;
            };

            this.trigger("update", { entity: entity });

            return hasUpdated;
        }

        on(eventName: string, delegate: (args) => void ) {
            this._observable.on(eventName, delegate);
        }

        trigger(eventName: string, args) {
            this._observable.trigger(eventName, args);
        }

        toList() {
            return this._objects;
        }

        clear() {
            this._objects = [];
            this.trigger("clear", {})
            return true;
        }

        private getIndexForId(id: number) {
            for (var i = 0; i < this._objects.length; i++) {
                if (this._objects[i].id === id) {
                    return i;
                };
            }
            return null;
        }
    }
}