/// <reference path="../src/definitions/Jasmine.d.ts" />
/// <reference path="../src/definitions/JQuery.d.ts" />
/// <reference path="../src/ts/Timer.ts" />
/// <reference path="../src/ts/ITimer.ts" />

describe("timer", function () {

    it("returns you the correct time", function () {
        var getCurrentTimeSpy = jasmine.createSpy('getCurrentTime').andReturn(1000000);
        var setTimeoutSpy = jasmine.createSpy('setTimeout');

        var dateService = {
            getCurrentTime: getCurrentTimeSpy,
        }

        var delayer = {
            setTimeout: setTimeoutSpy
        }

        var timer: VjsPluginComponents.ITimer = new VjsPluginComponents.Timer(delayer, dateService);

        timer.start();

        setTimeoutSpy.mostRecentCall.args[0]();

        getCurrentTimeSpy.andReturn(1011000);

        setTimeoutSpy.mostRecentCall.args[0]();

        expect(timer.getTime()).toBe(11000);
    });

    it("stops correctly", function () {
        //Arrange
        var timeoutIndex = 5;

        var clearTimeoutSpy = jasmine.createSpy("clearTimeout");
        var getCurrentTimeSpy = jasmine.createSpy('getCurrentTime').andReturn(1000000);
        var setTimeoutSpy = jasmine.createSpy('setTimeout').andReturn(timeoutIndex);

        var dateService = {
            getCurrentTime: getCurrentTimeSpy,
        }

        var delayer = {
            setTimeout: setTimeoutSpy,
            clearTimeout: clearTimeoutSpy
        }

        var timer: VjsPluginComponents.ITimer = new VjsPluginComponents.Timer(delayer, dateService);

        // Act
        timer.start();
        setTimeoutSpy.mostRecentCall.args[0]();

        getCurrentTimeSpy.andReturn(1011000);

        setTimeoutSpy.mostRecentCall.args[0]();

        timer.stop();

        //Assert
        expect(clearTimeoutSpy).toHaveBeenCalledWith(timeoutIndex);
    });


    it("resets correctly", function () {
        //Arrange
        var timeoutIndex = 5;

        var clearTimeoutSpy = jasmine.createSpy("clearTimeout");
        var getCurrentTimeSpy = jasmine.createSpy('getCurrentTime').andReturn(1000000);
        var setTimeoutSpy = jasmine.createSpy('setTimeout').andReturn(timeoutIndex);

        var dateService = {
            getCurrentTime: getCurrentTimeSpy,
        }

        var delayer = {
            setTimeout: setTimeoutSpy,
            clearTimeout: clearTimeoutSpy
        }

        var timer: VjsPluginComponents.ITimer = new VjsPluginComponents.Timer(delayer, dateService);

        // Act
        timer.start();
        setTimeoutSpy.mostRecentCall.args[0]();

        getCurrentTimeSpy.andReturn(1011000);

        setTimeoutSpy.mostRecentCall.args[0]();

        timer.reset();

        getCurrentTimeSpy.andReturn(1030000);

        setTimeoutSpy.mostRecentCall.args[0]();

        //Assert
        expect(timer.getTime()).toBe(19000);
    });

});