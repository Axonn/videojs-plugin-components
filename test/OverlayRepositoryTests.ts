/// <reference path="../src/definitions/Jasmine.d.ts" />
/// <reference path="../src/definitions/JQuery.d.ts" />
/// <chutzpah_reference path="../../../lib/JQuery/jquery-1.9.1.js" />
/// <reference path="../src/ts/OverlayRepository.ts" />
/// <reference path="../src/ts/Observable.ts" />
/// <reference path="../src/ts/LayerRepository.ts" />
/// <reference path="../src/ts/IOverlay.ts" />
/// <reference path="../src/ts/IOverlaySpecification.ts" />
/// <reference path="../src/ts/IPlayer.ts" />
/// <reference path="../src/ts/AddClassToElementAtTimes.ts" />

describe("overlay repository", function () {
    var eventManagerRegisterSpy;
    var layerRepoCreateSpy;
    var playerSpy;
    var renderSpy;
    var overlaySpy;
    var playerOneSpy;
    var containerHtmlSpy;
    var outputSpy;
    var errorSpy;
    var container;
    var createContainerSpy;
    var model;
    var model2;
    var template;
    var displayTimes;
    var overlay: VjsPluginComponents.IOverlaySpecification;
    var overlay2: VjsPluginComponents.IOverlaySpecification;
    var eventRepository: VjsPluginComponents.IObservableRepository;
    var renderEngine: VjsPluginComponents.IRenderEngine;
    var player: VjsPluginComponents.IPlayer;
    var layerRepository: VjsPluginComponents.ILayerRepository;

    beforeEach(() => {
        eventManagerRegisterSpy = jasmine.createSpy('eventManager.register');
        layerRepoCreateSpy = jasmine.createSpy('layerRepo.register');
        playerSpy = jasmine.createSpy('player');
        renderSpy = jasmine.createSpy('renderEngine.render');
        overlaySpy = jasmine.createSpy('overlaySpy');
        playerOneSpy = jasmine.createSpy("player.one");
        containerHtmlSpy = jasmine.createSpy("container.html");
        outputSpy = jasmine.createSpy("output");
        errorSpy = jasmine.createSpy('error');

        container = {
            html: containerHtmlSpy
        }

        createContainerSpy = jasmine.createSpy('containerBuilder').andReturn(container);

        model = {
            property1: "hello",
            property2: 999
        };

        model2 = {
            property1: "goodbye",
            property2: 777
        };

        template = {
            name: "test"
        }

        displayTimes = [{
            start: (videoEnd) => { return videoEnd },
            end: (videoEnd) => { return videoEnd },
            type: "switch"
        }];

        overlay = {
            name: "testOverlay1",
            displayTimes: displayTimes,
            template: template,
            model: model,
            events: {}
        };

        overlay2 = {
            displayTimes: displayTimes,
            template: template,
            model: model2,
            events: {}
        };

        eventRepository =
        {
            remove: jasmine.createSpy('eventRepo.remove'),
            getEntity: jasmine.createSpy('eventRepo.getEntity'),
            create: eventManagerRegisterSpy,
            trigger: jasmine.createSpy('eventRepo.trigger'),
            on: jasmine.createSpy('eventRepo.on'),
            toList: jasmine.createSpy('eventRepo.toList'),
            update: jasmine.createSpy('eventRepo.update'),
            clear: jasmine.createSpy('eventRepo.clear'),
        }

        renderEngine = {
            render: renderSpy
        }

        player = {
            id: jasmine.createSpy("player.id"),
            videos: jasmine.createSpy("player.videos"),
            toOriginal: jasmine.createSpy("player.toOriginal"),
            setVideo: jasmine.createSpy("player.setVideo"),
            getVideo: jasmine.createSpy("player.getVideo"),
            dispose: jasmine.createSpy("player.dispose"),
            createEl: jasmine.createSpy("player.createEl"),
            el: jasmine.createSpy("player.el"),
            addChild: jasmine.createSpy("player.addChild"),
            children: jasmine.createSpy("player.children"),
            on: jasmine.createSpy("player.on"),
            off: jasmine.createSpy("player.off"),
            one: playerOneSpy,
            trigger: jasmine.createSpy("player.trigger"),
            show: jasmine.createSpy("player.show"),
            hide: jasmine.createSpy("player.hide"),
            width: jasmine.createSpy("player.width"),
            pause: jasmine.createSpy("player.pause"),
            height: jasmine.createSpy("player.height"),
            dimensions: jasmine.createSpy("player.dimensions"),
            currentTime: jasmine.createSpy("player.currentTime"),
            techName: jasmine.createSpy("player.techName"),
            play: jasmine.createSpy("player.play"),
            currentSrc: jasmine.createSpy("player.currentSrc"),
            options: jasmine.createSpy('player.options'),
            duration: jasmine.createSpy('player.duration').andReturn(300),
            changeSrcResetTime: jasmine.createSpy("player.changeSrcResetTime"),
            changeSrcRetainTime: jasmine.createSpy("player.changeSrcRetainTime"),
        };

        layerRepository = {
            remove: jasmine.createSpy('layerRepo.remove'),
            getEntity: jasmine.createSpy('layerRepo.getEntity'),
            create: jasmine.createSpy('layerRepo.create'),
            trigger: jasmine.createSpy('layerRepo.trigger'),
            on: jasmine.createSpy('layerRepo.on'),
            toList: jasmine.createSpy('layerRepo.toList'),
            update: jasmine.createSpy('layerRepo.update'),
            createFromSpecification: layerRepoCreateSpy,
            clear: jasmine.createSpy('layerRepo.clear'),
        }
    });

    it("correctly adds an overlay at videoEnd", function () {
        var sut = new VjsPluginComponents.OverlayRepository(new VjsPluginComponents.ObservableRepository(new VjsPluginComponents.Observable()), player, layerRepository, eventRepository);

        sut.createFromSpecification(overlay);

        for (var i = 0; i < playerOneSpy.argsForCall.length; i++) {
            if (playerOneSpy.argsForCall[i][0] == "durationset") {
                playerOneSpy.argsForCall[i][1]();
            }
        }

        for (var i = 0; i < renderSpy.argsForCall.length; i++) {
            if (renderSpy.argsForCall[i][0] == template.name) {
                renderSpy.argsForCall[i][2](errorSpy, outputSpy);
            }
        }

        expect(eventManagerRegisterSpy).toHaveBeenCalledWith({ id: 0, startEvent: { time: 300, handler: jasmine.any(Function) }, endEvent: { time: 300, handler: jasmine.any(Function) } });

        expect(layerRepoCreateSpy). toHaveBeenCalledWith(overlay);

        expect(sut.getEntityByName(overlay.name).name).toEqual(overlay.name);

        // Move these to layer repo tests

        //expect(renderSpy).toHaveBeenCalledWith(template.name, { model: model }, jasmine.any(Function));
        //expect(containerHtmlSpy).toHaveBeenCalledWith(outputSpy);
        //expect(createContainerSpy).toHaveBeenCalledWith(1);
    });

    it("correctly adds two overlays at videoEnd", function () {
        var sut = new VjsPluginComponents.OverlayRepository(new VjsPluginComponents.ObservableRepository(new VjsPluginComponents.Observable()), player, layerRepository, eventRepository);

        sut.createFromSpecification(overlay);
        sut.createFromSpecification(overlay2);

        for (var i = 0; i < playerOneSpy.argsForCall.length; i++) {
            if (playerOneSpy.argsForCall[i][0] == "durationset") {
                playerOneSpy.argsForCall[i][1]();
            }
        }

        for (var i = 0; i < renderSpy.argsForCall.length; i++) {
            if (renderSpy.argsForCall[i][0] == template.name) {
                renderSpy.argsForCall[i][2](errorSpy, outputSpy);
            }
        }

        expect(eventManagerRegisterSpy).toHaveBeenCalledWith({ id: 0, startEvent: { time: 300, handler: jasmine.any(Function) }, endEvent: { time: 300, handler: jasmine.any(Function) } });
        expect(eventManagerRegisterSpy).toHaveBeenCalledWith({ id: 0, startEvent: { time: 300, handler: jasmine.any(Function) }, endEvent: { time: 300, handler: jasmine.any(Function) } });

        expect(layerRepoCreateSpy).toHaveBeenCalledWith(overlay);
        expect(layerRepoCreateSpy).toHaveBeenCalledWith(overlay2);

        //expect(renderSpy).toHaveBeenCalledWith(template.name, { model: model }, jasmine.any(Function));
        //expect(renderSpy).toHaveBeenCalledWith(template.name, { model: model2 }, jasmine.any(Function));
        //expect(containerHtmlSpy).toHaveBeenCalledWith(outputSpy);

        //expect(createContainerSpy).toHaveBeenCalledWith(1);
        //expect(createContainerSpy).toHaveBeenCalledWith(2);
    });

    it("correctly triggers onCreate function after create", function () {
        var sut = new VjsPluginComponents.OverlayRepository(new VjsPluginComponents.ObservableRepository(new VjsPluginComponents.Observable()), player, layerRepository, eventRepository);

        var onCreateSpy = jasmine.createSpy('event.onCreate');

        var localOverlay: VjsPluginComponents.IOverlaySpecification = {
            name: "testOverlay",
            displayTimes: displayTimes,
            template: template,
            model: model,
            events: {
                "onCreate": [onCreateSpy]
            }
        };

        sut.createFromSpecification(localOverlay);

        for (var i = 0; i < playerOneSpy.argsForCall.length; i++) {
            if (playerOneSpy.argsForCall[i][0] == "durationset") {
                playerOneSpy.argsForCall[i][1]();
            }
        }

        for (var i = 0; i < renderSpy.argsForCall.length; i++) {
            if (renderSpy.argsForCall[i][0] == template.name) {
                renderSpy.argsForCall[i][2](errorSpy, outputSpy);
            }
        }

        expect(eventManagerRegisterSpy).toHaveBeenCalledWith({ id: 0, startEvent: { time: 300, handler: jasmine.any(Function) }, endEvent: { time: 300, handler: jasmine.any(Function) } });

        expect(layerRepoCreateSpy).toHaveBeenCalledWith(localOverlay);

        //expect(renderSpy).toHaveBeenCalledWith(template.name, { model: model }, jasmine.any(Function));
        //expect(renderSpy).toHaveBeenCalledWith(template.name, { model: model2 }, jasmine.any(Function));
        //expect(containerHtmlSpy).toHaveBeenCalledWith(outputSpy);

        //expect(createContainerSpy).toHaveBeenCalledWith(0);
        //expect(createContainerSpy).toHaveBeenCalledWith(1);

        expect(onCreateSpy).toHaveBeenCalledWith({ overlay: jasmine.any(Object), player: player, overlays: sut });
    });

});