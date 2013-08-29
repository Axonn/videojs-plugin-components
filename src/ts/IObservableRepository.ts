///<reference path='IObservable.ts'/>
///<reference path='IRepository.ts'/>
///<reference path='IListable.ts'/>

module VjsPluginComponents {
    export interface IObservableRepository extends IObservable, IListable, IRepository {
    }
}