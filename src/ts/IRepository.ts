///<reference path='IEntity.ts'/>
module VjsPluginComponents {
    export interface IRepository {
        create(entity: IEntity): IEntity;

        getEntity(id: number): IEntity;

        remove(id: number): boolean;
        
        update(entity: IEntity): boolean;

        clear(): boolean;
    }
}