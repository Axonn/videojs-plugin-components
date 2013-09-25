/// <reference path="../src/definitions/Jasmine.d.ts" />
/// <reference path="../src/definitions/JQuery.d.ts" />
/// <chutzpah_reference path="../../../lib/JQuery/jquery-1.9.1.js" />
/// <reference path="../src/ts/PlayObserver.ts" />
/// <reference path="../src/ts/IPlayer.ts" />

describe("time based event manager", function () {
    var player: VjsPluginComponents.IPlayer,
        playerEventSpy,
        playerTriggerSpy,
        playerCurrentTimeSpy,
        durationSpy,
        callbackSpy;

    var curriedGetFunctionFromSpy = (spy: jasmine.Spy) => {
        return (functionName: string) => {
            for (var i = 0; i < spy.argsForCall.length; i++) {
                if (spy.argsForCall[i][0] === functionName) {
                    return spy.argsForCall[i][1];
                };
            }
        };
    }

    beforeEach(() => {
        playerEventSpy = jasmine.createSpy('playerEvent');
        playerTriggerSpy = jasmine.createSpy('playerTrigger');
        playerCurrentTimeSpy = jasmine.createSpy('playerCurrentTime');
        callbackSpy = jasmine.createSpy('callback');
        durationSpy = jasmine.createSpy('player.duration');

        player = {
            id: jasmine.createSpy("player.id"),
            setVideo: jasmine.createSpy("player.setVideo"),
            getVideo: jasmine.createSpy("player.getVideo"),
            changeSrcResetTime: jasmine.createSpy("player.changeSrcResetTime"),
            changeSrcRetainTime: jasmine.createSpy("player.changeSrcRetainTime"),
            on: playerEventSpy,
            trigger: playerTriggerSpy,
            currentTime: playerCurrentTimeSpy,
            dispose: jasmine.createSpy("player.dispose"),
            createEl: jasmine.createSpy("player.createEl"),
            el: jasmine.createSpy("player.el"),
            addChild: jasmine.createSpy("player.addChild"),
            children: jasmine.createSpy("player.children"),
            getVideoOffset: jasmine.createSpy('player.getVideoOffset'),
            off: jasmine.createSpy("player.off"),
            one: jasmine.createSpy("player.one"),
            src: jasmine.createSpy("player.src"),
            currentSrc: jasmine.createSpy("player.currentSrc"),
            show: jasmine.createSpy("player.show"),
            hide: jasmine.createSpy("player.hide"),
            paused: jasmine.createSpy("player.paused"),
            width: jasmine.createSpy("player.width"),
            pause: jasmine.createSpy("player.pause"),
            height: jasmine.createSpy("player.height"),
            dimensions: jasmine.createSpy("player.dimensions"),
            techName: jasmine.createSpy("player.techName"),
            play: jasmine.createSpy("player.play"),
            lockShowing: jasmine.createSpy("player.lockShowing"),
            unlockShowing: jasmine.createSpy("player.unlockShowing"),
            currentSrc: jasmine.createSpy("player.currentSrc"),
            duration: durationSpy,
            toOriginal: jasmine.createSpy("player.duration"),
            sources: jasmine.createSpy("player.sources"),
            options: jasmine.createSpy("player.options"),
        };

    });

    it("triggers a registered event correctly", function () {
        durationSpy.andReturn(10);

        var sut = new VjsPluginComponents.PlayObserver(player);

        sut.on("videoWatched", callbackSpy);

        var timeUpdateFunction = curriedGetFunctionFromSpy(playerEventSpy)("timeupdate");


        for (var i = 0; i < playerEventSpy.argsForCall.length; i++) {
            if (playerEventSpy.argsForCall[i][0] === "timeupdate") {
                playerCurrentTimeSpy.andReturn(0);
                playerEventSpy.argsForCall[i][1]();
                playerCurrentTimeSpy.andReturn(0.2);
                playerEventSpy.argsForCall[i][1]();
                playerCurrentTimeSpy.andReturn(0.3);
                playerEventSpy.argsForCall[i][1]();
                playerCurrentTimeSpy.andReturn(0.55);
                playerEventSpy.argsForCall[i][1]();
            };
        }

        expect(callbackSpy).toHaveBeenCalledWith({ start: 0, end: 0 });
        expect(callbackSpy).toHaveBeenCalledWith({ start: 0, end: 0.2 });
        expect(callbackSpy).toHaveBeenCalledWith({ start: 0.2, end: 0.3 });
        expect(callbackSpy).toHaveBeenCalledWith({ start: 0.3, end: 0.55 });
    });

    it("triggers a registered event correctly after jumping", function () {
        var sut = new VjsPluginComponents.PlayObserver(player);

        sut.on("videoWatched", callbackSpy);

        var getFunctionfromPlayerSpy = curriedGetFunctionFromSpy(playerEventSpy);

        var timeUpdateFunction = getFunctionfromPlayerSpy("timeupdate");
        var seekingFunction = getFunctionfromPlayerSpy("seeking");
        var seekedFunction = getFunctionfromPlayerSpy("seeked");
        var playingFunction = getFunctionfromPlayerSpy("playing");
        var canPlayFunction = getFunctionfromPlayerSpy("canplay");

        playerCurrentTimeSpy.andReturn(0);
        timeUpdateFunction();
        playerCurrentTimeSpy.andReturn(0.1);
        timeUpdateFunction();
        playerCurrentTimeSpy.andReturn(0.3);
        timeUpdateFunction();
        playerCurrentTimeSpy.andReturn(0.4);
        seekingFunction();
        timeUpdateFunction();
        seekedFunction();
        timeUpdateFunction();
        canPlayFunction();
        timeUpdateFunction();
        playerCurrentTimeSpy.andReturn(0.5);
        timeUpdateFunction();

        expect(callbackSpy).toHaveBeenCalledWith({ start: 0, end: 0.1 });
        expect(callbackSpy).toHaveBeenCalledWith({ start: 0.1, end: 0.3 });
        expect(callbackSpy).toHaveBeenCalledWith({ start: 0.4, end: 0.5 });
        expect(callbackSpy).not.toHaveBeenCalledWith({ start: 0.3, end: 0.5 });
    });
});