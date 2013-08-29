/// <reference path="../src/definitions/Jasmine.d.ts" />
/// <reference path="../src/definitions/JQuery.d.ts" />
/// <chutzpah_reference path="../../../lib/JQuery/jquery-1.9.1.js" />
/// <reference path="../src/ts/TimeBasedEventManager.ts" />
/// <reference path="../src/ts/WalkableList.ts" />
/// <reference path="../src/ts/Observable.ts" />
/// <reference path="../src/ts/ObservableRepository.ts" />
/// <reference path="../src/ts/IObservableRepository.ts" />
/// <reference path="../src/ts/TimeBasedEventManager.ts" />
/// <reference path="../src/ts/EventSortingFunction.ts" />
/// <reference path="../src/ts/SinglePointEventRepository.ts" />
/// <reference path="../src/ts/TimeBasedEventRepository.ts" />

describe("time based event manager", function () {
    var playerEventSpy;
    var playerTriggerSpy;
    var callbackSpy;
    var player;
    var singlePointEventRepo: VjsPluginComponents.IObservableRepository;
    var timeBasedEventRepo: VjsPluginComponents.IObservableRepository;
    var list;

    beforeEach(() => {
        playerEventSpy = jasmine.createSpy('playerEvent');
        playerTriggerSpy = jasmine.createSpy('playerTrigger');
        callbackSpy = jasmine.createSpy('callback');

        player = {
            on: playerEventSpy,
            trigger: playerTriggerSpy
        };


        singlePointEventRepo = new VjsPluginComponents.SinglePointEventRepository(
                new VjsPluginComponents.ObservableRepository(
                    new VjsPluginComponents.Observable()
               )
            );

        list = new VjsPluginComponents.WalkableList(
            VjsPluginComponents.EventSortingFunction,
            (a) => {
                return (typeof a.maxCallCount === "undefined") || a.maxCallCount > a.callCount
            },
            singlePointEventRepo
        );

        timeBasedEventRepo = new VjsPluginComponents.TimeBasedEventRepository(
            new VjsPluginComponents.ObservableRepository(new VjsPluginComponents.Observable()),
            singlePointEventRepo
        );
    });

    it("triggers a registered event correctly", function () {
        var sut = new VjsPluginComponents.TimeBasedEventManager(player, list, timeBasedEventRepo);

        singlePointEventRepo.create({
            id: 0,
            time: 0.5,
            handler: callbackSpy
        });

        for (var i = 0; i < playerEventSpy.argsForCall.length; i++) {
            if (playerEventSpy.argsForCall[i][0] === "videoWatched") {
                playerEventSpy.argsForCall[i][1]({ start: 0, end: 1 });
            };
        }

        expect(callbackSpy).toHaveBeenCalled();
    });

    it("doesn't trigger a removed event", function () {
        var sut = new VjsPluginComponents.TimeBasedEventManager(player, list, timeBasedEventRepo);

        var event = singlePointEventRepo.create({
            id: 0,
            time: 0.5,
            handler: callbackSpy
        });

        singlePointEventRepo.remove(event.id);

        for (var i = 0; i < playerEventSpy.argsForCall.length; i++) {
            if (playerEventSpy.argsForCall[i][0] === "videoWatched") {
                playerEventSpy.argsForCall[i][1]({ start: 0, end: 1 });
            };
        }

        expect(callbackSpy).wasNotCalled();
    });

    it("does not trigger registered events correctly", function () {
        var sut = new VjsPluginComponents.TimeBasedEventManager(player, list, timeBasedEventRepo);

        singlePointEventRepo.create({
            id: 0,
            time: 40,
            handler: callbackSpy
        });

        for (var i = 0; i < playerEventSpy.argsForCall.length; i++) {
            if (playerEventSpy.argsForCall[i][0] === "videoWatched") {
                playerEventSpy.argsForCall[i][1]({ start: 0, end: 1 });
                playerEventSpy.argsForCall[i][1]({ start: 1, end: 3 });
                playerEventSpy.argsForCall[i][1]({ start: 3, end: 5 });
                playerEventSpy.argsForCall[i][1]({ start: 5, end: 6 });
                playerEventSpy.argsForCall[i][1]({ start: 6, end: 10 });
            };
        }

        expect(callbackSpy).wasNotCalled();
    });

    it("Skips events that arent in play boundaries", function () {
        var sut = new VjsPluginComponents.TimeBasedEventManager(player, list, timeBasedEventRepo);

        singlePointEventRepo.create({
            id: 0,
            time: 40,
            handler: callbackSpy
        });

        for (var i = 0; i < playerEventSpy.argsForCall.length; i++) {
            if (playerEventSpy.argsForCall[i][0] === "videoWatched") {
                playerEventSpy.argsForCall[i][1]({ start: 0, end: 1 });
                playerEventSpy.argsForCall[i][1]({ start: 1, end: 3 });
                playerEventSpy.argsForCall[i][1]({ start: 3, end: 5 });
                playerEventSpy.argsForCall[i][1]({ start: 50, end: 52 });
                playerEventSpy.argsForCall[i][1]({ start: 52, end: 54 });
            };
        }

        expect(callbackSpy).wasNotCalled();
    });

    it("Triggers all callbacks from a list", function () {
        var callbackSpy5 = jasmine.createSpy('callback5');
        var callbackSpy10 = jasmine.createSpy('callback10');
        var callbackSpy15 = jasmine.createSpy('callback15');
        var callbackSpy20 = jasmine.createSpy('callback20');
        var callbackSpy25 = jasmine.createSpy('callback25');
        var callbackSpy30 = jasmine.createSpy('callback30');
        var callbackSpy35 = jasmine.createSpy('callback35');

        var sut = new VjsPluginComponents.TimeBasedEventManager(player, list, timeBasedEventRepo);

        singlePointEventRepo.create({ id: 0, time: 5, handler: callbackSpy5 });
        singlePointEventRepo.create({ id: 0, time: 10, handler: callbackSpy10 });
        singlePointEventRepo.create({ id: 0, time: 15, handler: callbackSpy15 });
        singlePointEventRepo.create({ id: 0, time: 20, handler: callbackSpy20 });
        singlePointEventRepo.create({ id: 0, time: 25, handler: callbackSpy25 });
        singlePointEventRepo.create({ id: 0, time: 30, handler: callbackSpy30 });
        singlePointEventRepo.create({ id: 0, time: 35, handler: callbackSpy35 });

        for (var i = 0; i < playerEventSpy.argsForCall.length; i++) {
            if (playerEventSpy.argsForCall[i][0] === "videoWatched") {
                playerEventSpy.argsForCall[i][1]({ start: 0, end: 1 });
                playerEventSpy.argsForCall[i][1]({ start: 1, end: 3 });
                playerEventSpy.argsForCall[i][1]({ start: 3, end: 5 });
                playerEventSpy.argsForCall[i][1]({ start: 5, end: 8 });
                playerEventSpy.argsForCall[i][1]({ start: 8, end: 12 });
                playerEventSpy.argsForCall[i][1]({ start: 12, end: 16 });
                playerEventSpy.argsForCall[i][1]({ start: 28, end: 29 });
                playerEventSpy.argsForCall[i][1]({ start: 29, end: 32 });
            };
        }

        expect(callbackSpy5).toHaveBeenCalled();
        expect(callbackSpy10).toHaveBeenCalled();
        expect(callbackSpy15).toHaveBeenCalled();
        expect(callbackSpy20).wasNotCalled();
        expect(callbackSpy25).wasNotCalled();
        expect(callbackSpy30).toHaveBeenCalled();
        expect(callbackSpy35).wasNotCalled();
    });

    it("Triggers both on and off time based callbacks", function () {
        var callbackOnSpy = jasmine.createSpy('callbackon');
        var callbackOffSpy = jasmine.createSpy('callbackoff');

        var sut = new VjsPluginComponents.TimeBasedEventManager(player, list, timeBasedEventRepo);

        timeBasedEventRepo.create({ id: 0,
            startEvent: {
                time: 5,
                handler: callbackOnSpy
            },
            endEvent: {
                time: 10,
                handler: callbackOffSpy
            }
        });

        for (var i = 0; i < playerEventSpy.argsForCall.length; i++) {
            if (playerEventSpy.argsForCall[i][0] === "videoWatched") {
                playerEventSpy.argsForCall[i][1]({ start: 0, end: 1 });
                playerEventSpy.argsForCall[i][1]({ start: 1, end: 3 });
                playerEventSpy.argsForCall[i][1]({ start: 3, end: 5 });
                playerEventSpy.argsForCall[i][1]({ start: 5, end: 8 });
                playerEventSpy.argsForCall[i][1]({ start: 8, end: 12 });
            };
        }

        expect(callbackOnSpy).toHaveBeenCalled();
        expect(callbackOffSpy).toHaveBeenCalled();
    });

    it("Triggers only on time based callbacks", function () {
        var callbackOnSpy = jasmine.createSpy('callbackon');
        var callbackOffSpy = jasmine.createSpy('callbackoff');

        var sut = new VjsPluginComponents.TimeBasedEventManager(player, list, timeBasedEventRepo);

        timeBasedEventRepo.create({
            id: 0,
            startEvent: {
                time: 5,
                handler: callbackOnSpy
            },
            endEvent: {
                time: 10,
                handler: callbackOffSpy
            }
        });

        for (var i = 0; i < playerEventSpy.argsForCall.length; i++) {
            if (playerEventSpy.argsForCall[i][0] === "videoWatched") {
                playerEventSpy.argsForCall[i][1]({ start: 0, end: 1 });
                playerEventSpy.argsForCall[i][1]({ start: 1, end: 3 });
                playerEventSpy.argsForCall[i][1]({ start: 3, end: 5 });
                playerEventSpy.argsForCall[i][1]({ start: 5, end: 8 });
            };
        }

        expect(callbackOnSpy).toHaveBeenCalled();
        expect(callbackOffSpy).wasNotCalled();
    });

    it("Triggers time based callbacks after jump", function () {
        var playerEventSpy = jasmine.createSpy('playerEvent');
        var playerTriggerSpy = jasmine.createSpy('playerTrigger');
        var callbackOnSpy = jasmine.createSpy('callbackon');
        var callbackOffSpy = jasmine.createSpy('callbackoff');

        var player = {
            on: playerEventSpy,
            trigger: playerTriggerSpy
        };

        var sut = new VjsPluginComponents.TimeBasedEventManager(player, list, timeBasedEventRepo);

        timeBasedEventRepo.create({
            id: 0,
            startEvent: {
                time: 20,
                handler: callbackOnSpy
            },
            endEvent: {
                time: 25,
                handler: callbackOffSpy
            }
        });

        for (var i = 0; i < playerEventSpy.argsForCall.length; i++) {
            if (playerEventSpy.argsForCall[i][0] === "videoWatched") {
                playerEventSpy.argsForCall[i][1]({ start: 0, end: 1 });
                playerEventSpy.argsForCall[i][1]({ start: 1, end: 3 });
                playerEventSpy.argsForCall[i][1]({ start: 3, end: 5 });
                playerEventSpy.argsForCall[i][1]({ start: 5, end: 8 });
                playerEventSpy.argsForCall[i][1]({ start: 20, end: 22 });
            };
        }

        expect(callbackOnSpy).toHaveBeenCalled();
        expect(callbackOffSpy).wasNotCalled();
    });

    it("Triggers on and off time based callbacks after jump on end edge case", function () {
        var callbackOnSpy = jasmine.createSpy('callbackon');
        var callbackOffSpy2 = jasmine.createSpy('callbackoff2');

        var sut = new VjsPluginComponents.TimeBasedEventManager(player, list, timeBasedEventRepo);

        timeBasedEventRepo.create({
            id: 0,
            startEvent: {
                time: 20,
                handler: callbackOnSpy
            },
            endEvent: {
                time: 25,
                handler: callbackOffSpy2
            }
        });

        for (var i = 0; i < playerEventSpy.argsForCall.length; i++) {
            if (playerEventSpy.argsForCall[i][0] === "videoWatched") {
                playerEventSpy.argsForCall[i][1]({ start: 0, end: 1 });
                playerEventSpy.argsForCall[i][1]({ start: 1, end: 3 });
                playerEventSpy.argsForCall[i][1]({ start: 3, end: 5 });
                playerEventSpy.argsForCall[i][1]({ start: 5, end: 8 });
                playerEventSpy.argsForCall[i][1]({ start: 25, end: 26 });
            };
        }

        expect(callbackOnSpy).toHaveBeenCalled();
        expect(callbackOffSpy2).toHaveBeenCalled();
    });

    it("Triggers on but not off time based callbacks after jump on first end edge case", function () {
        var callbackOnSpy = jasmine.createSpy('callbackon');
        var callbackOffSpy = jasmine.createSpy('callbackoff');

        var sut = new VjsPluginComponents.TimeBasedEventManager(player, list, timeBasedEventRepo);

        timeBasedEventRepo.create({
            id: 0,
            startEvent: {
                time: 10,
                handler: callbackOnSpy
            },
            endEvent: {
                time: 10,
                handler: callbackOffSpy
            }
        });

        for (var i = 0; i < playerEventSpy.argsForCall.length; i++) {
            if (playerEventSpy.argsForCall[i][0] === "videoWatched") {
                playerEventSpy.argsForCall[i][1]({ start: 0, end: 1 });
                playerEventSpy.argsForCall[i][1]({ start: 1, end: 3 });
                playerEventSpy.argsForCall[i][1]({ start: 3, end: 5 });
                playerEventSpy.argsForCall[i][1]({ start: 5, end: 8 });
                playerEventSpy.argsForCall[i][1]({ start: 8, end: 10 });
            };
        }

        expect(callbackOnSpy).toHaveBeenCalledWith({
            eventTime: 10,
            callTime: 10,
        });
        expect(callbackOffSpy).wasNotCalled();
    });

    it("Triggers only on callback after jump on first end edge case", function () {
        var callbackOnSpy = jasmine.createSpy('callbackon');
        var callbackOffSpy = jasmine.createSpy('callbackoff');

        var sut = new VjsPluginComponents.TimeBasedEventManager(player, list, timeBasedEventRepo);

        timeBasedEventRepo.create({
            id: 0,
            startEvent: {
                time: 10,
                handler: callbackOnSpy
            },
            endEvent: {
                time: 20,
                handler: callbackOffSpy
            }
        });

        for (var i = 0; i < playerEventSpy.argsForCall.length; i++) {
            if (playerEventSpy.argsForCall[i][0] === "videoWatched") {
                playerEventSpy.argsForCall[i][1]({ start: 0, end: 1 });
                playerEventSpy.argsForCall[i][1]({ start: 1, end: 3 });
                playerEventSpy.argsForCall[i][1]({ start: 3, end: 5 });
                playerEventSpy.argsForCall[i][1]({ start: 5, end: 8 });
                playerEventSpy.argsForCall[i][1]({ start: 8, end: 10 });
                playerEventSpy.argsForCall[i][1]({ start: 13, end: 13 });
            };
        }

        expect(callbackOnSpy).toHaveBeenCalledWith({
            eventTime: 10,
            callTime: 10,
        });
        expect(callbackOnSpy).not.toHaveBeenCalledWith({
            eventTime: 10,
            callTime: 13,
        });
        expect(callbackOffSpy).wasNotCalled();
    });

    it("Triggers on and off instantaneous time based callbacks", function () {
        var callbackOnSpy = jasmine.createSpy('callbackon');
        var callbackOffSpy = jasmine.createSpy('callbackoff');

        var sut = new VjsPluginComponents.TimeBasedEventManager(player, list, timeBasedEventRepo);

        timeBasedEventRepo.create({
            id: 0,
            startEvent: {
                time: 10,
                handler: callbackOnSpy
            },
            endEvent: {
                time: 10,
                handler: callbackOffSpy
            }
        });

        for (var i = 0; i < playerEventSpy.argsForCall.length; i++) {
            if (playerEventSpy.argsForCall[i][0] === "videoWatched") {
                playerEventSpy.argsForCall[i][1]({ start: 0, end: 1 });
                playerEventSpy.argsForCall[i][1]({ start: 1, end: 3 });
                playerEventSpy.argsForCall[i][1]({ start: 3, end: 5 });
                playerEventSpy.argsForCall[i][1]({ start: 5, end: 8 });
                playerEventSpy.argsForCall[i][1]({ start: 8, end: 9 });
                playerEventSpy.argsForCall[i][1]({ start: 9, end: 11 });
            };
        }

        expect(callbackOnSpy).toHaveBeenCalledWith({
            eventTime: 10,
            callTime: 11,
        });
        expect(callbackOffSpy).toHaveBeenCalledWith({
            eventTime: 10,
            callTime: 11,
        });
    });

    it("Triggers only on for static seek", function () {
        var callbackOnSpy = jasmine.createSpy('callbackon');
        var callbackOffSpy = jasmine.createSpy('callbackoff');

        var sut = new VjsPluginComponents.TimeBasedEventManager(player, list, timeBasedEventRepo);

        timeBasedEventRepo.create({
            id: 0,
            startEvent: {
                time: 10,
                handler: callbackOnSpy
            },
            endEvent: {
                time: 10,
                handler: callbackOffSpy
            }
        });

        for (var i = 0; i < playerEventSpy.argsForCall.length; i++) {
            if (playerEventSpy.argsForCall[i][0] === "videoWatched") {
                playerEventSpy.argsForCall[i][1]({ start: 0, end: 1 });
                playerEventSpy.argsForCall[i][1]({ start: 1, end: 3 });
                playerEventSpy.argsForCall[i][1]({ start: 3, end: 5 });
                playerEventSpy.argsForCall[i][1]({ start: 5, end: 8 });
                playerEventSpy.argsForCall[i][1]({ start: 8, end: 9 });
                playerEventSpy.argsForCall[i][1]({ start: 9, end: 10 });
            };
        }

        expect(callbackOnSpy).toHaveBeenCalledWith({
            eventTime: 10,
            callTime: 10,
        });
        expect(callbackOffSpy).wasNotCalled();
    });

    it("can deal with a mix of static and duration events", function () {
        var callbackOnSpy = jasmine.createSpy('callbackon');
        var callbackOffSpy = jasmine.createSpy('callbackoff');
        var callbackSingleSpy = jasmine.createSpy('callbacksingle');
        var callbackFalseSpy = jasmine.createSpy('callbackFalse');

        var sut = new VjsPluginComponents.TimeBasedEventManager(player, list, timeBasedEventRepo);

        singlePointEventRepo.create({ id: 0, time: 35, handler: callbackFalseSpy });
        timeBasedEventRepo.create({
            id: 0,
            startEvent: {
                time: 10,
                handler: callbackOnSpy
            },
            endEvent: {
                time: 10,
                handler: callbackOffSpy
            }
        });
        singlePointEventRepo.create({ id: 0, time: 12, handler: callbackFalseSpy });
        timeBasedEventRepo.create({
            id: 0,
            startEvent: {
                time: 15,
                handler: callbackFalseSpy
            },
            endEvent: {
                time: 16,
                handler: callbackFalseSpy
            }
        });
        timeBasedEventRepo.create({
            id: 0,
            startEvent: {
                time: 5,
                handler: callbackOnSpy
            },
            endEvent: {
                time: 21,
                handler: callbackOffSpy
            }
        });
        singlePointEventRepo.create({ id: 0, time: 18, handler: callbackSingleSpy });
        timeBasedEventRepo.create({
            id: 0,
            startEvent: {
                time: 25,
                handler: callbackOnSpy
            },
            endEvent: {
                time: 30,
                handler: callbackFalseSpy
            }
        });
        singlePointEventRepo.create({ id: 0, time: 2, handler: callbackFalseSpy });
        singlePointEventRepo.create({ id: 0, time: 20, handler: callbackSingleSpy });

        for (var i = 0; i < playerEventSpy.argsForCall.length; i++) {
            if (playerEventSpy.argsForCall[i][0] === "videoWatched") {
                playerEventSpy.argsForCall[i][1]({ start: 3, end: 5 });
                playerEventSpy.argsForCall[i][1]({ start: 5, end: 8 });
                playerEventSpy.argsForCall[i][1]({ start: 8, end: 11 });
                playerEventSpy.argsForCall[i][1]({ start: 18, end: 22 });
                playerEventSpy.argsForCall[i][1]({ start: 22, end: 25 });
            };
        }

        expect(callbackFalseSpy).wasNotCalled();

        expect(callbackSingleSpy).toHaveBeenCalledWith({
            eventTime: 18,
            callTime: 22,
        });

        expect(callbackSingleSpy).toHaveBeenCalledWith({
            eventTime: 20,
            callTime: 22,
        });

        expect(callbackOnSpy).toHaveBeenCalledWith({
            eventTime: 10,
            callTime: 11,
        });

        expect(callbackOnSpy).toHaveBeenCalledWith({
            eventTime: 5,
            callTime: 5,
        });

        expect(callbackOnSpy).toHaveBeenCalledWith({
            eventTime: 25,
            callTime: 25,
        });

        expect(callbackOffSpy).toHaveBeenCalledWith({
            eventTime: 21,
            callTime: 22,
        });

        expect(callbackOffSpy).toHaveBeenCalledWith({
            eventTime: 10,
            callTime: 11,
        });
    });

});