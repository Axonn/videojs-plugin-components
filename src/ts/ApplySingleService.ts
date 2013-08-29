///<reference path='../definitions/JQuery.d.ts'/>
///<reference path='IPlayer.ts'/>

module VjsPluginComponents {
    export function ApplySingleService(player: IPlayer) {
        return (serviceName: string) => {
            return (serviceConstructor: () => Object) => {
                var children = player.children();
                var service = jQuery.grep(children, (child) => { return child["serviceName"] === serviceName})[0];
                if (typeof service === "undefined") {
                    service = serviceConstructor();
                    service["serviceName"] = serviceName;
                    player.addChild(service);
                }
                return service;
            }
        }
    }
}