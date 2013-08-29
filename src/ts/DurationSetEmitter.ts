///<reference path='IPlayer.ts'/>

module VjsPluginComponents {
    export class DurationSetEmitter {
        static name: string = "durationSetEmitter";

        constructor(player: IPlayer) {
            var checkDuration = () => {
                if (typeof player.duration() !== "undefined") {
                    player.trigger("durationset");
                }
            };

            player.on("durationchange", checkDuration);
        }
    }
}