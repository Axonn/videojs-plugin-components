///<reference path='IEntity.ts'/>
module VjsPluginComponents {
    export interface IWalkableList {
        getCurrent(): any;
        moveNext(): void;
        hasNext(): boolean;
        reset(condition: (object) => boolean);
        add(object: IEntity): any;
        removeCurrent();
        update(object: IEntity);
        remove(id: number): boolean;
        isFinished(): boolean;
    }
}