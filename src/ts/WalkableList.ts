
///<reference path='../definitions/JQuery.d.ts'/>
///<reference path='GetNextFreeId.ts'/>
///<reference path='IEntity.ts'/>
///<reference path='IWalkableList.ts'/>
///<reference path='IObservableRepository.ts'/>
module VjsPluginComponents {
    //This Walkable list implementation includes everything stored in the underlying repository.
    export class WalkableList implements IWalkableList {
        _objects: IEntity[];
        _index: number;
        _repository: IObservableRepository;
        _sortFunction: (a, b) => number;
        _filterFunction: (a: any) => boolean;

        constructor(sortFunction: (a, b) => number, filterFunction: (a: any) => boolean, repository: IObservableRepository) {
            this._index = 0;
            this._objects = [];

            this._repository = repository;
            this._sortFunction = sortFunction;
            this._filterFunction = filterFunction;

            this.updateLocalArray();
            this._repository.on("create", () => {
                this.updateLocalArray();
            });
            this._repository.on("remove", () => {
                this.updateLocalArray();
            });
        }

        updateLocalArray() {
            this._objects = jQuery.grep(this._repository.toList(),this._filterFunction).sort(this._sortFunction);
        }

        getCurrent() {
            return this._objects[this._index];
        }

        moveNext() {
            this._index++;
        }

        hasNext() {
            return (this._index < this._objects.length)
        }

        isFinished() {
            return (this._index >= this._objects.length)
        }

        /**
         * resets the list to the first point upon which the condition is met.
         * @param {function(object:any) => number} condition 
         * @param {(args) => void} handler
         * @param {string} boundaryType describes when the event should be triggered. 
         *                 Valid inputs are: "point","approach" and "depart". "point"
         *                 triggers whenever the time is played. "approach" only 
         *                 triggers when the time up to that point is played. 
         *                 "depart" only triggers when the time after the point is 
         *                 played. 
         * @param {integer} maxCallCount
         */
        reset(condition: (object) => boolean) {
            this._index = 0;
            while (this.hasNext() && !condition(this._objects[this._index])) {
                this.moveNext();
            }
        }

        add(object: IEntity) {
            return this._repository.create(object);
        }

        removeCurrent() {
            this._repository.remove(this._objects[this._index].id)
        }

        update(object: IEntity) {
            this._repository.update(object);
        }

        remove(id: number) {
            return this._repository.remove(id);
        }

    /* Look into using this instead of general updates if performance is slow.
    As always, code optization later.    

    private insertSingleEvent(event: ISinglePointEvent) {
        this._handlersToTrigger = this.insert(event,
        this._handlersToTrigger,
        (a, b) => {
            //A appears after B when positive
            if ((a.time - b.time) == 0) {
                return this.getBoundaryOrdering(a.boundaryType) - this.getBoundaryOrdering(b.boundaryType);
            } else {
                return a.time - b.time;
            }
        });
    }

    private getBoundaryOrdering(boundaryType: string): number {
        switch(boundaryType.toLowerCase()) {
            case "approach":
                return 0;
            case "point":
                return 1;
            case "depart":
                return 2;
            default:
                throw Error("Invalid boundary type entered: " + boundaryType);
        }
    }

    private insert(element, array, comparer) {
        array.splice(this.locationOf(element, array, comparer), 0, element);
        return array;
    }

    private locationOf(element, array, comparer, start?: number = 0, end?: number): number {
        if (typeof (end) === 'undefined') {
            end = array.length - 1;
        }
        var pivot: number = Math.floor(start + (end - start) / 2);

        if (!(array[pivot]) || comparer(element, array[pivot]) == 0) return pivot;

        if (comparer(element, array[pivot]) > 0) {
            if (pivot == end) return (pivot + 1);
            return this.locationOf(element, array, comparer, pivot + 1, end);
        } else {
            if (pivot == start) return (pivot);
            return this.locationOf(element, array, comparer, start, pivot - 1);
        }
    } */
    }
}