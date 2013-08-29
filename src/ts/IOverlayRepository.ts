///<reference path='IOverlay.ts'/>
///<reference path='IOverlaySpecification.ts'/>
///<reference path='IObservableRepository.ts'/>
module VjsPluginComponents {
    export interface IOverlayRepository extends VjsPluginComponents.IObservableRepository {
        createFromSpecification(layer: IOverlaySpecification): IOverlay;
    }
}