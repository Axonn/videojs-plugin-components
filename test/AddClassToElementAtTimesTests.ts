///// <reference path="../src/definitions/Jasmine.d.ts" />
///// <reference path="../src/definitions/JQuery.d.ts" />
///// <reference path="../src/ts/AddClassToElementAtTimes.ts" />
///// <reference path="../src/ts/ITimeBasedEventManager.ts" />
///// <chutzpah_reference path="../../../lib/JQuery/jquery-1.9.1.js" />

//describe("addClassToElementAtTimes", () => {
//    var eventManagerAddSingleSpy,
//        eventManagerAddMultiSpy,
//        eventManagerTriggerSpy,
//        elementAddClassSpy,
//        elementRemoveClassSpy,
//        eventManager,
//        element;

//    beforeEach(() => {
//        eventManagerAddSingleSpy = jasmine.createSpy('eventManager.AddSingle');
//        eventManagerAddMultiSpy = jasmine.createSpy('eventManager.AddMulti');
//        eventManagerTriggerSpy = jasmine.createSpy('eventManager.Trigger');
//        elementAddClassSpy = jasmine.createSpy('element.AddClass');
//        elementRemoveClassSpy = jasmine.createSpy('element.RemoveClass');

//        eventManager = {
//            triggerTimeBasedEvents: eventManagerTriggerSpy,
//            registerSingleEvent: eventManagerAddSingleSpy,
//            registerTimeBasedEvent: eventManagerAddMultiSpy
//        };

//        element = {
//            addClass: elementAddClassSpy,
//            removeClass: elementRemoveClassSpy
//        };
//    });

//    it("Adds a single event at the expected time", () => {
//        var classname = "hidden";
//        var period = {
//            type: "flash",
//            start: 0,
//            end: 5
//        };

//        VjsPluginComponents.AddClassToElementAtTimes(eventManager)(classname)(element)(period);

//        var callback = eventManagerAddSingleSpy.argsForCall[0][0].handler;

//        callback();

//        expect(eventManagerAddSingleSpy).toHaveBeenCalledWith({ time: period.start, handler: jasmine.any(Function)});

//        expect(elementAddClassSpy).toHaveBeenCalledWith(classname);
//    });

//    it("Adds multi events at expected times", () => {
//        var classname = "hidden";
//        var period = {
//            type: "switch",
//            start: 0,
//            end: 5
//        };

//        VjsPluginComponents.AddClassToElementAtTimes(eventManager)(classname)(element)(period);

//        expect(eventManagerAddMultiSpy).toHaveBeenCalledWith({
//            startEvent: { time: period.start, handler: jasmine.any(Function) },
//            endEvent: { time: period.end, handler: jasmine.any(Function) }
//        });

//        expect(elementAddClassSpy).wasNotCalled();
//        expect(elementRemoveClassSpy).wasNotCalled();

//        var addCallback = eventManagerAddMultiSpy.argsForCall[0][0].startEvent.handler;

//        addCallback();

//        expect(elementAddClassSpy).toHaveBeenCalledWith(classname);
//        expect(elementRemoveClassSpy).wasNotCalled();

//        var removeCallback = eventManagerAddMultiSpy.argsForCall[0][0].endEvent.handler;

//        removeCallback();

//        expect(elementRemoveClassSpy).toHaveBeenCalledWith(classname);
//    });
//});