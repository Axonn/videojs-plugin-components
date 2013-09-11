/// <reference path="../../src/definitions/JQuery.d.ts" />
/// <reference path="../../src/definitions/dustjs-linkedin.d.ts" />
/// <reference path="../../src/definitions/VideoJS.d.ts" />
declare module VjsPluginComponents {
    interface IVideoSource {
        resolution: string;
        type: string;
        src: string;
    }
}
declare module VjsPluginComponents {
    interface IVideoSources {
        getSelected(): VjsPluginComponents.IVideoSource;
        setSelected(source: VjsPluginComponents.IVideoSource): void;
        listByType(type: string): VjsPluginComponents.IVideoSource[];
    }
}
declare module VjsPluginComponents {
    interface IObservable {
        trigger(eventName: string, args);
        on(eventName: string, delegate: (args: any) => void);
    }
}
declare module VjsPluginComponents {
    interface IEntity {
        id: number;
    }
}
declare module VjsPluginComponents {
    interface IRepository {
        create(entity: VjsPluginComponents.IEntity): VjsPluginComponents.IEntity;
        getEntity(id: number): VjsPluginComponents.IEntity;
        remove(id: number): boolean;
        update(entity: VjsPluginComponents.IEntity): boolean;
        clear(): boolean;
    }
}
declare module VjsPluginComponents {
    interface IListable {
        toList(): VjsPluginComponents.IEntity[];
    }
}
declare module VjsPluginComponents {
    interface IObservableRepository extends VjsPluginComponents.IObservable, VjsPluginComponents.IListable, VjsPluginComponents.IRepository {
    }
}
declare module VjsPluginComponents {
    interface IPeriod {
        type: string;
        start: number;
        end: number;
    }
}
declare module VjsPluginComponents {
    interface ITemplate {
        name: string;
    }
}
declare module VjsPluginComponents {
    interface ILayerSpecification {
        template: VjsPluginComponents.ITemplate;
        model: {};
    }
}
declare module VjsPluginComponents {
    interface IOverlaySpecification extends VjsPluginComponents.ILayerSpecification {
        name?: string;
        displayTimes: {
            type: string;
            start: (duration: number) => number;
            end: (duration: number) => number;
        }[];
        events: {};
    }
}
declare module VjsPluginComponents {
    interface IVideo {
        id: string;
        aspectRatio: string;
        getPlayingSource(): VjsPluginComponents.IVideoSource;
        setPlayingSource(source: VjsPluginComponents.IVideoSource): void;
        setPlayingMatching(matchingFunc: (sources: VjsPluginComponents.IVideoSource[]) => VjsPluginComponents.IVideoSource);
        listSourcesByType(type: string): VjsPluginComponents.IVideoSource[];
        overlays: VjsPluginComponents.IOverlaySpecification[];
    }
}
declare module VjsPluginComponents {
    interface IPlayer {
        id();
        toOriginal(): any;
        dispose(): void;
        createEl(type, props): any;
        el();
        addChild(child, options?);
        children();
        on(type: string, fn);
        off(type: string, fn);
        one(type: string, fn);
        trigger(type: string, event?: any);
        show(): void;
        hide(): void;
        width(): number;
        height(): number;
        dimensions(width: number, height: number);
        currentTime(time?: number): number;
        techName(): string;
        play();
        pause();
        paused();
        options(): Object;
        duration(): number;
        setVideo(video: VjsPluginComponents.IVideo);
        getVideo(): VjsPluginComponents.IVideo;
        getVideoOffset(): {
            x: number;
            y: number;
        };
        changeSrcResetTime(source);
        changeSrcRetainTime(source);
    }
}
declare module VjsPluginComponents {
    function ApplySingleService(player: IPlayer): (serviceName: string) => (serviceConstructor: () => Object) => any;
    function GetService(player: IPlayer, serviceName: string);
}
declare module VjsPluginComponents {
    class Component {
        public _component: _V_.IComponent;
        public _player: VjsPluginComponents.IPlayer;
        constructor(player: VjsPluginComponents.IPlayer);
        public dispose(): void;
        public createEl(tagName?, properties?): HTMLElement;
        public elCreator(tagName, properties): HTMLElement;
        public el();
        public addChild(child, options?): void;
        public children(): any[];
        public on(type: string, fn: () => void): void;
        public off(type: string, fn: () => void): void;
        public one(type: string, fn: () => void): void;
        public trigger(type: string, event?: any): void;
        public show(): void;
        public hide(): void;
        public width(): number;
        public height(): number;
        public dimensions(width: number, height: number): void;
        public addClass(className: string): void;
        public removeClass(className: string): void;
        public unlockShowing(): void;
        public lockShowing(): void;
    }
}
declare module VjsPluginComponents {
    class Button extends VjsPluginComponents.Component {
        public buttonText: string;
        constructor(player: VjsPluginComponents.IPlayer);
        public createEl(tagName?, properties?): HTMLElement;
        public onClick(): void;
        public onFocus(): void;
        public onBlur(): void;
    }
}
declare module VjsPluginComponents {
    interface ISinglePointEvent {
        id?: number;
        time: number;
        handler: (args: any) => void;
        boundaryType?: string;
        callCount?: number;
        maxCallCount?: number;
    }
}
declare module VjsPluginComponents {
    interface ITimeBasedEvent {
        id?: number;
        startEvent: VjsPluginComponents.ISinglePointEvent;
        endEvent: VjsPluginComponents.ISinglePointEvent;
        isOn?: boolean;
    }
}
declare module VjsPluginComponents {
    interface ITimeBasedEventManager {
        triggerTimeBasedEvents: (args: {
            start: number;
            end: number;
        }) => void;
    }
}
declare module VjsPluginComponents {
    interface IWalkableList {
        getCurrent(): any;
        moveNext(): void;
        hasNext(): boolean;
        reset(condition: (object: any) => boolean);
        add(object: VjsPluginComponents.IEntity): any;
        removeCurrent();
        update(object: VjsPluginComponents.IEntity);
        remove(id: number): boolean;
        isFinished(): boolean;
    }
}
declare module VjsPluginComponents {
    class TimeBasedEventManager implements VjsPluginComponents.ITimeBasedEventManager {
        public _player: VjsPluginComponents.IObservable;
        public _handlersToTrigger: VjsPluginComponents.IWalkableList;
        public _timeBasedEventsToTrigger: VjsPluginComponents.IObservableRepository;
        public _previouslyWatchedSpan: {
            start: number;
            end: number;
        };
        static name: string;
        constructor(player: VjsPluginComponents.IObservable, singlePointList: VjsPluginComponents.IWalkableList, timeBasedEventRepository: VjsPluginComponents.IObservableRepository);
        public triggerTimeBasedEvents(args: {
            start: number;
            end: number;
        }): void;
        private CheckIfEventTriggered(startTime);
        private triggerHandler(handler, eventTime, callTime);
        private updateTimeBasedEventStates(time);
        private updateTimeBasedEventState(time, event);
        private isPointStillToBePlayed(event, currentTime);
    }
}
declare module VjsPluginComponents {
    function ContainerBuilder(parent): (name: string) => (index: number) => JQuery;
}
declare module VjsPluginComponents {
    interface IDateService {
        getCurrentTime(): number;
    }
}
declare module VjsPluginComponents {
    class DateService implements VjsPluginComponents.IDateService {
        constructor();
        public getCurrentTime(): number;
    }
}
declare module VjsPluginComponents {
    class VideoSource implements VjsPluginComponents.IVideoSource {
        public resolution: string;
        public type: string;
        public src: string;
        constructor(source);
        public getResolutionFromSource(source);
    }
}
declare module VjsPluginComponents {
    class DefaultVideo implements VjsPluginComponents.IVideo {
        public id: string;
        public overlays: VjsPluginComponents.IOverlaySpecification[];
        public aspectRatio: string;
        public _player: _V_.IPlayer;
        public _selectedSource: VjsPluginComponents.IVideoSource;
        public _sources: VjsPluginComponents.IVideoSource[];
        public _setSource: (src: any) => void;
        public _sourcesByType: {
            [type: string]: VjsPluginComponents.IVideoSource[];
        };
        constructor(player, setSource: (src: any) => void);
        public getWithSrc(src: string): any;
        public getPlayingSource(): VjsPluginComponents.IVideoSource;
        public setPlayingMatching(matchFunc: (sources: VjsPluginComponents.IVideoSource[]) => VjsPluginComponents.IVideoSource): void;
        public setPlayingSource(source: VjsPluginComponents.IVideoSource): void;
        public listSourcesByType(type: string): VjsPluginComponents.IVideoSource[];
        public listSources(): VjsPluginComponents.IVideoSource[];
    }
}
declare module VjsPluginComponents {
    class DurationSetEmitter {
        static name: string;
        constructor(player: VjsPluginComponents.IPlayer);
    }
}
declare module VjsPluginComponents {
    function EventSortingFunction(a, b): number;
    function getBoundaryOrdering(boundaryType: string): number;
}
declare module VjsPluginComponents {
    function GetNextFreeId(list: IEntity[]): number;
}
declare module VjsPluginComponents {
    interface ILayer {
        id: number;
        container: JQuery;
    }
}
declare module VjsPluginComponents {
    interface ILayerRepository extends VjsPluginComponents.IObservableRepository {
        createFromSpecification(layer: VjsPluginComponents.ILayerSpecification): VjsPluginComponents.ILayer;
    }
}
declare module VjsPluginComponents {
    interface IOverlay {
        id: number;
        name: string;
        layer: VjsPluginComponents.ILayer;
        event?: VjsPluginComponents.ITimeBasedEvent;
    }
}
declare module VjsPluginComponents {
    interface IOverlayRepository extends VjsPluginComponents.IObservableRepository {
        createFromSpecification(layer: VjsPluginComponents.IOverlaySpecification): VjsPluginComponents.IOverlay;
        getEntityByName(name: string): VjsPluginComponents.IOverlay;
    }
}
declare module VjsPluginComponents {
    interface IRenderEngine {
        render: (templateName: string, model: any, callback: (err: any, out: any) => void) => {};
    }
}
declare module VjsPluginComponents {
    interface ITimer {
        start(): void;
        stop(): void;
        reset(): void;
        getTime(): void;
    }
}
declare module VjsPluginComponents {
    class ObservableRepository implements VjsPluginComponents.IObservableRepository {
        public _objects: VjsPluginComponents.IEntity[];
        public _observable: VjsPluginComponents.IObservable;
        public _idCount: number;
        constructor(observable: VjsPluginComponents.IObservable);
        public create(entity: VjsPluginComponents.IEntity): VjsPluginComponents.IEntity;
        public getEntity(id: number): VjsPluginComponents.IEntity;
        public remove(id: number): boolean;
        public update(entity: VjsPluginComponents.IEntity): boolean;
        public on(eventName: string, delegate: (args: any) => void): void;
        public trigger(eventName: string, args): void;
        public toList(): VjsPluginComponents.IEntity[];
        public clear(): boolean;
        private getIndexForId(id);
    }
}
declare module VjsPluginComponents {
    class LayerRepository implements VjsPluginComponents.ILayerRepository, VjsPluginComponents.IObservableRepository {
        public _baseRepository: VjsPluginComponents.IObservableRepository;
        public _renderEngine: VjsPluginComponents.IRenderEngine;
        public _containerBuilder: (index: number) => JQuery;
        constructor(baseRepository: VjsPluginComponents.IObservableRepository, renderEngine: VjsPluginComponents.IRenderEngine, containerBuilder: (index: number) => JQuery);
        public createFromSpecification(layerSpecification: VjsPluginComponents.ILayerSpecification): VjsPluginComponents.ILayer;
        public create(layer: VjsPluginComponents.ILayer): VjsPluginComponents.IEntity;
        public on(eventName: string, handler: (args: any) => void): void;
        public trigger(eventName: string, args): void;
        public toList(): VjsPluginComponents.ILayer[];
        public getEntity(id: number): VjsPluginComponents.ILayer;
        public remove(id: number): boolean;
        public update(layer: VjsPluginComponents.ILayer): boolean;
        public clear(): boolean;
    }
}
declare module VjsPluginComponents {
    class MenuItem extends VjsPluginComponents.Button {
        public buttonText: string;
        constructor(player: VjsPluginComponents.IPlayer);
        public createEl(tagName?, properties?): HTMLElement;
        public onClick(): void;
        public onFocus(): void;
        public onBlur(): void;
    }
}
declare module VjsPluginComponents {
    class Menu extends VjsPluginComponents.Component {
        public buttonText: string;
        public items: VjsPluginComponents.MenuItem[];
        constructor(player: VjsPluginComponents.IPlayer);
        public createEl(tagName?, properties?): HTMLElement;
        public addItem(item: VjsPluginComponents.MenuItem): void;
    }
}
declare module VjsPluginComponents {
    class triggerableEvent {
        public delegates: {
            (args: any): void;
        }[];
        constructor();
    }
    class Observable implements VjsPluginComponents.IObservable {
        public _events: {
            [eventName: string]: triggerableEvent;
        };
        constructor();
        public on(eventName: string, delegate: (args: any) => void): void;
        public trigger(eventName: string, args): void;
    }
}
declare module VjsPluginComponents {
    class ObservableSubRepository implements VjsPluginComponents.IObservableRepository {
        public _baseRepository: VjsPluginComponents.IObservableRepository;
        public _objects: VjsPluginComponents.IEntity[];
        public _observable: VjsPluginComponents.IObservable;
        constructor(baseRepository: VjsPluginComponents.IObservableRepository, observable: VjsPluginComponents.IObservable);
        public create(entity: VjsPluginComponents.IEntity): VjsPluginComponents.IEntity;
        public on(eventName: string, handler: (args: any) => void): void;
        public trigger(eventName: string, args): void;
        public toList(): VjsPluginComponents.IEntity[];
        public getEntity(id: number): VjsPluginComponents.IEntity;
        public remove(id: number): boolean;
        public update(entity: VjsPluginComponents.IEntity): boolean;
        public clear(): boolean;
    }
}
declare module VjsPluginComponents {
    class OverlayManager {
        public _player: VjsPluginComponents.IPlayer;
        public _overlayRepository: VjsPluginComponents.IOverlayRepository;
        static name: string;
        constructor(player: VjsPluginComponents.IPlayer, overlayRepository: VjsPluginComponents.IOverlayRepository);
        private updateOverlays();
        private initializeNewOverlays();
    }
}
declare module VjsPluginComponents {
    class PlayObserver extends VjsPluginComponents.Observable {
        public _watchStartTime: number;
        public _player: VjsPluginComponents.IPlayer;
        public _seeking: boolean;
        static name: string;
        constructor(player: VjsPluginComponents.IPlayer);
        public triggerVideoWatched(): void;
        public resetWatchTime(): void;
        public getFixedCurrentTime(): number;
    }
}
declare module VjsPluginComponents {
    function TriggerEventHooks(eventList: {}, eventName: string, args: {}): void;
}
declare module VjsPluginComponents {
    class OverlayRepository implements VjsPluginComponents.IOverlayRepository {
        public _player: VjsPluginComponents.IPlayer;
        public _layerRepository: VjsPluginComponents.ILayerRepository;
        public _eventRepository: VjsPluginComponents.IObservableRepository;
        public _baseRepository: VjsPluginComponents.IObservableRepository;
        constructor(baseRepository: VjsPluginComponents.IObservableRepository, player: VjsPluginComponents.IPlayer, layerRepository: VjsPluginComponents.ILayerRepository, timeBasedEventRepository: VjsPluginComponents.IObservableRepository);
        public createFromSpecification(overlaySpecification: VjsPluginComponents.IOverlaySpecification): VjsPluginComponents.IOverlay;
        public create(overlay: VjsPluginComponents.IOverlay): VjsPluginComponents.IOverlay;
        public on(eventName: string, handler: (args: any) => void): void;
        public trigger(eventName: string, args): void;
        public toList(): VjsPluginComponents.IOverlay[];
        public getEntity(id: number): VjsPluginComponents.IOverlay;
        public getEntityByName(name: string): VjsPluginComponents.IOverlay;
        public remove(id: number): boolean;
        public update(Overlay: VjsPluginComponents.IOverlay): boolean;
        public clear(): boolean;
        private registerOverlayDisplay(overlay, events);
        private convertTimesToAbsolutes(displayTime);
    }
}
declare module VjsPluginComponents {
    class Player implements VjsPluginComponents.IPlayer {
        public _player: _V_.IPlayer;
        public _sourceMatchFunc: (a: VjsPluginComponents.IVideoSource) => (b: VjsPluginComponents.IVideoSource[]) => any;
        constructor(player: _V_.IPlayer, sourceMatchFunc?: (a: VjsPluginComponents.IVideoSource) => (b: VjsPluginComponents.IVideoSource[]) => any);
        public id();
        public getVideo(): VjsPluginComponents.IVideo;
        public setVideo(video: VjsPluginComponents.IVideo): void;
        public toOriginal(): _V_.IPlayer;
        public dispose(): void;
        public createEl(type, props): any;
        public el();
        public addChild(child, options?): void;
        public children(): any[];
        public on(type: string, fn): void;
        public off(type: string, fn): void;
        public one(type: string, fn): void;
        public trigger(type: string, event?: any): void;
        public show(): void;
        public hide(): void;
        public width(): number;
        public height(): number;
        public dimensions(width: number, height: number): void;
        public currentTime(time?: string): number;
        public techName(): string;
        public play(): void;
        public pause(): void;
        public paused(): void;
        public options(): Object;
        public src(source?): Object;
        public changeSrcResetTime(source): Object;
        public changeSrcRetainTime(source): Object;
        public duration(): number;
        public getVideoOffset(): {
            x: number;
            y: number;
        };
    }
}
declare module VjsPluginComponents {
    class SinglePointEventRepository implements VjsPluginComponents.IObservableRepository {
        public _baseRepository: VjsPluginComponents.IObservableRepository;
        constructor(baseRepository: VjsPluginComponents.IObservableRepository);
        public create(singlePointEvent: VjsPluginComponents.ISinglePointEvent): VjsPluginComponents.ISinglePointEvent;
        public on(eventName: string, handler: (args: any) => void): void;
        public trigger(eventName: string, args): void;
        public toList(): VjsPluginComponents.ISinglePointEvent[];
        public getEntity(id: number): VjsPluginComponents.ISinglePointEvent;
        public remove(id: number): boolean;
        public update(singlePointEvent: VjsPluginComponents.ISinglePointEvent): boolean;
        public clear(): boolean;
    }
}
declare module VjsPluginComponents {
    class TimeBasedEventRepository implements VjsPluginComponents.IObservableRepository {
        public _baseRepository: VjsPluginComponents.IObservableRepository;
        public _singlePointEventRepository: VjsPluginComponents.IObservableRepository;
        constructor(baseRepository: VjsPluginComponents.IObservableRepository, singlePointEventRepository: VjsPluginComponents.IObservableRepository);
        public create(timeBasedEvent: VjsPluginComponents.ITimeBasedEvent): VjsPluginComponents.ITimeBasedEvent;
        public on(eventName: string, handler: (args: any) => void): void;
        public trigger(eventName: string, args): void;
        public toList(): VjsPluginComponents.ITimeBasedEvent[];
        public getEntity(id: number): VjsPluginComponents.ITimeBasedEvent;
        public remove(id: number): boolean;
        public update(singlePointEvent: VjsPluginComponents.ITimeBasedEvent): boolean;
        public clear(): boolean;
        private addAdditionalFunctionalityToEvent(event, func);
    }
}
declare module VjsPluginComponents {
    class Timer implements VjsPluginComponents.ITimer {
        public _previousElapsed: number;
        public _elapsed: number;
        public _running: boolean;
        public _lastStart: number;
        public _interval: number;
        public _delayService;
        public _dateService: VjsPluginComponents.IDateService;
        constructor(delayService, dateService: VjsPluginComponents.IDateService);
        public start(): void;
        public renewUpdateTime(): void;
        public updateTime(): void;
        public stop(): void;
        public reset(): void;
        public getTime(): number;
    }
}
declare module VjsPluginComponents {
    class TriggerableEvent {
        public delegates: {
            (): void;
        }[];
        constructor();
    }
}
declare module VjsPluginComponents {
    class Video implements VjsPluginComponents.IVideo {
        public id: string;
        public overlays: VjsPluginComponents.IOverlaySpecification[];
        public aspectRatio: string;
        public _selectedSource: VjsPluginComponents.IVideoSource;
        public _sources: VjsPluginComponents.IVideoSource[];
        public _setSource: (src: any) => void;
        public _sourcesByType: {
            [type: string]: VjsPluginComponents.IVideoSource[];
        };
        constructor(sources: VjsPluginComponents.IVideoSource[], setSource: (src: any) => void, aspectRatio?: string);
        public getWithSrc(src: string): any;
        public getPlayingSource(): VjsPluginComponents.IVideoSource;
        public setPlayingMatching(matchFunc: (sources: VjsPluginComponents.IVideoSource[]) => VjsPluginComponents.IVideoSource): void;
        public setPlayingSource(source: VjsPluginComponents.IVideoSource): void;
        public listSourcesByType(type: string): VjsPluginComponents.IVideoSource[];
        public listSources(): VjsPluginComponents.IVideoSource[];
    }
}
declare module VjsPluginComponents {
    class WalkableList implements VjsPluginComponents.IWalkableList {
        public _objects: VjsPluginComponents.IEntity[];
        public _index: number;
        public _repository: VjsPluginComponents.IObservableRepository;
        public _sortFunction: (a: any, b: any) => number;
        public _filterFunction: (a: any) => boolean;
        constructor(sortFunction: (a: any, b: any) => number, filterFunction: (a: any) => boolean, repository: VjsPluginComponents.IObservableRepository);
        public updateLocalArray(): void;
        public getCurrent(): VjsPluginComponents.IEntity;
        public moveNext(): void;
        public hasNext(): boolean;
        public isFinished(): boolean;
        public reset(condition: (object: any) => boolean): void;
        public add(object: VjsPluginComponents.IEntity): VjsPluginComponents.IEntity;
        public removeCurrent(): void;
        public update(object: VjsPluginComponents.IEntity): void;
        public remove(id: number): boolean;
    }
}
