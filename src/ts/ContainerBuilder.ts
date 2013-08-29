///<reference path='../definitions/JQuery.d.ts'/>
///<reference path='../definitions/dustjs-linkedin.d.ts'/>
///<reference path='TimeBasedEventManager.ts'/>
///<reference path='IPlayer.ts'/>
module VjsPluginComponents {
    export function ContainerBuilder(parent) {
        return (name: string) => {
            return (index: number) => {
                var container = jQuery('<div/>', {
                    id: (name + index.toString()),
                    "class": (name)
                })

                container.appendTo(jQuery(parent));

                return container;
            }
        }
    }
}