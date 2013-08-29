module VjsPluginComponents {
    export function TriggerEventHooks(eventList: {}, eventName: string, args: {}) {
        if (typeof eventList !== "undefined") {
            var eventsArr = eventList[eventName]

            if (typeof eventsArr !== "undefined") {
                var length = eventsArr.length;
                for (var i = 0; i < length; i++) {
                    eventsArr[i](args);
                }
            }
        }
    }
}