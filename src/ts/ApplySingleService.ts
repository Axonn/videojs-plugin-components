///<reference path='../definitions/JQuery.d.ts'/>
///<reference path='IPlayer.ts'/>

module VjsPluginComponents {
    export function ApplySingleService(player: IPlayer) {
        return (serviceName: string) => {
            return (serviceConstructor: () => Object) => {
                var service = GetService(player, serviceName); 
                if (typeof service === "undefined") {
                    service = serviceConstructor();
                    service["serviceName"] = serviceName;
                    player.addChild(service);
                }
                return service;
            }
        }
    }

    export function GetService(player: IPlayer, serviceName: string) {
        var children = player.children();
        return jQuery.grep(children, (child) => { return child["serviceName"] === serviceName })[0];
    }
}