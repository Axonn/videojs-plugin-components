/// <reference path="../src/definitions/Jasmine.d.ts" />
/// <reference path="../src/definitions/JQuery.d.ts" />
/// <reference path="../src/ts/DurationSetEmitter.ts" />
/// <reference path="../src/ts/IPlayer.ts" />
/// <chutzpah_reference path="../../../lib/JQuery/jquery-1.9.1.js" />

describe("durationObserver", () => {
    var player,
        playerEventSpy,
        playerEventOffSpy,
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
        playerEventOffSpy = jasmine.createSpy('player.off');

        player = {
            id: jasmine.createSpy("player.id"),
            on: playerEventSpy,
            trigger: playerTriggerSpy,
            currentTime: playerCurrentTimeSpy,
            dispose: jasmine.createSpy("player.dispose"),
            createEl: jasmine.createSpy("player.createEl"),
            el: jasmine.createSpy("player.el"),
            addChild: jasmine.createSpy("player.addChild"),
            children: jasmine.createSpy("player.children"),
            off: playerEventOffSpy,
            one: jasmine.createSpy("player.one"),
            show: jasmine.createSpy("player.show"),
            hide: jasmine.createSpy("player.hide"),
            getVideoOffset: jasmine.createSpy('player.getVideoOffset'),
            pause: jasmine.createSpy("player.pause"),
            paused: jasmine.createSpy("player.paused"),
            width: jasmine.createSpy("player.width"),
            height: jasmine.createSpy("player.height"),
            dimensions: jasmine.createSpy("player.dimensions"),
            techName: jasmine.createSpy("player.techName"),
            src: jasmine.createSpy("player.src"),
            currentSrc: jasmine.createSpy("player.currentSrc"),
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

    it("Calls duration set when duration changes", () => {  
        durationSpy.andReturn();

        var sut = new VjsPluginComponents.DurationSetEmitter(player);
        var onFunction = curriedGetFunctionFromSpy(playerEventSpy)("durationchange");
        var offFunction = curriedGetFunctionFromSpy(playerEventOffSpy)("durationchange");

        onFunction();

        expect(playerTriggerSpy).wasNotCalled();
    });

    it("Calls duration set when duration changes", () => {
        durationSpy.andReturn(3);

        var sut = new VjsPluginComponents.DurationSetEmitter(player);
        var onFunction = curriedGetFunctionFromSpy(playerEventSpy)("durationchange");
       
        onFunction();

        var offFunction = curriedGetFunctionFromSpy(playerEventOffSpy)("durationchange");

        expect(playerTriggerSpy).toHaveBeenCalledWith("durationset");
    });
});