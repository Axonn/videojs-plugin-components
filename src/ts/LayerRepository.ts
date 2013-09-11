///<reference path='../definitions/JQuery.d.ts'/>
///<reference path='../definitions/dustjs-linkedin.d.ts'/>
///<reference path='TimeBasedEventManager.ts'/>
///<reference path='ILayerSpecification.ts'/>
///<reference path='ILayerRepository.ts'/>
///<reference path='ILayer.ts'/>
///<reference path='ObservableRepository.ts'/>
///<reference path='IObservableRepository.ts'/>
///<reference path='IRenderEngine.ts'/>

module VjsPluginComponents {
    export class LayerRepository implements ILayerRepository, VjsPluginComponents.IObservableRepository {
        _baseRepository: VjsPluginComponents.IObservableRepository;
        _renderEngine: IRenderEngine;
        _containerBuilder: (index: number) => JQuery;

        constructor(baseRepository: VjsPluginComponents.IObservableRepository, renderEngine: IRenderEngine, containerBuilder: (index: number) => JQuery) {
            this._baseRepository = baseRepository;
            this._renderEngine = renderEngine;
            this._containerBuilder = containerBuilder;
        }

        createFromSpecification(layerSpecification: ILayerSpecification) {
            var layer = <ILayer>this.create({ id: null, container: null })

            layer.container = this._containerBuilder(layer.id)

            this._renderEngine.render(layerSpecification.template.name, { model: layerSpecification.model }, (err, out) => {
                if (!err) {
                    layer.container.html(out);
                } else {
                    console.log(err.message);
                }
            });

            this.update(layer);

            return layer;
        }

        create(layer: ILayer) {
            return this._baseRepository.create(layer);
        }

        on(eventName: string, handler: (args)=>void) {
            this._baseRepository.on(eventName, handler);
        }

        trigger(eventName: string, args) {
            this._baseRepository.trigger(eventName, args);
        }

        toList() {
            return <ILayer[]>this._baseRepository.toList();
        }

        getEntity(id: number) {
            return <ILayer>this._baseRepository.getEntity(id);
        }

        remove(id: number) {
            var layer = this.getEntity(id);

            if (layer !== null) {
                layer.container.remove();
            }

            return this._baseRepository.remove(id);
        }

        update(layer: ILayer) {
            return this._baseRepository.update(layer);
        }

        clear() {
            return this._baseRepository.clear();
        }
    }
}