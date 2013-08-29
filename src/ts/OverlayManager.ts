///<reference path='../definitions/JQuery.d.ts'/>
///<reference path='Observable.ts'/>
///<reference path='IPlayer.ts'/>
///<reference path='IOverlay.ts'/>
///<reference path='IOverlayRepository.ts'/>

module VjsPluginComponents {
    export class OverlayManager {
        _player: IPlayer;
        _overlayRepository: IOverlayRepository;
        static name: string = "OverlayManager";

        constructor(player: IPlayer, overlayRepository: IOverlayRepository) {
            this._player = player;
            this._overlayRepository = overlayRepository;
            this._player.on("videoChange", () => { this.updateOverlays() });
            this.initializeNewOverlays();
        }

        private updateOverlays() {
            this._overlayRepository.clear();
            this.initializeNewOverlays();
        }

        private initializeNewOverlays() {
            var overlaySpecs = this._player.getVideo().overlays;
            for (var i = 0; i < overlaySpecs.length; i++){
                var overlay = this._overlayRepository.createFromSpecification(overlaySpecs[i]);
            }
        }
    }
}