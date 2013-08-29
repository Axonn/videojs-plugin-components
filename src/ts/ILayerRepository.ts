///<reference path='ILayer.ts'/>
///<reference path='ILayerSpecification.ts'/>
///<reference path='IObservableRepository.ts'/>
module VjsPluginComponents {
    export interface ILayerRepository extends VjsPluginComponents.IObservableRepository {
        createFromSpecification(layer: ILayerSpecification): ILayer;
    }
}