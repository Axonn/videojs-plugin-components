///<reference path='IVideo.ts'/>
///<reference path='IVideoSource.ts'/>
///<reference path='VideoSource.ts'/>
///<reference path='../definitions/JQuery.d.ts'/>
///<reference path='../definitions/VideoJS.d.ts'/>

module VjsPluginComponents {
    export class Video implements IVideo {
        id: string;
        overlays: IOverlaySpecification[];
        _selectedSource: IVideoSource;
        _sources: IVideoSource[];
        _setSource: (src) => void;
        _sourcesByType: { [type: string]: IVideoSource[]; } = {};

        constructor(sources: IVideoSource[], setSource: (src)=>void) {
            this._sources = sources;
            this._setSource = setSource;
        }

        getWithSrc(src: string): any {
            return jQuery.grep(this.listSources(),
                     (value) => {
                         return value.src == src
                     })[0];
        }

        getPlayingSource() {
            if (this._selectedSource === undefined) {
                return null;
            };

            return this._selectedSource;
        }

        setPlayingMatching(matchFunc: (sources: IVideoSource[]) => IVideoSource) {
            this.setPlayingSource(matchFunc(this.listSources()));
        }

        setPlayingSource(source: IVideoSource) {
            this._selectedSource = source;
            this._setSource(this.getWithSrc(source.src));
        }

        listSourcesByType(type: string): VjsPluginComponents.IVideoSource[] {
            if (this._sourcesByType[type] === undefined) {
                var sources = jQuery.grep(this.listSources(),
                    (value) => {
                        return value.type == type
                    });

                this._sourcesByType[type] = sources;

                // Sort the array so it is in descending order
                this._sourcesByType[type].sort(function (a, b) {
                    return (parseFloat(b.resolution) - parseFloat(a.resolution));
                });
            };

            return this._sourcesByType[type];
        }

        listSources(): VjsPluginComponents.IVideoSource[] {
            return this._sources;
        }
    }
}