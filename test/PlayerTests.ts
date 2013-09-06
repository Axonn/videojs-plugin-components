/// <reference path="../src/definitions/Jasmine.d.ts" />
/// <reference path="../src/definitions/JQuery.d.ts" />
/// <reference path="../src/ts/Player.ts" />
/// <reference path="../src/ts/IPlayer.ts" />
/// <reference path="../src/ts/VideoSource.ts" />
/// <chutzpah_reference path="../../../lib/JQuery/jquery-1.9.1.js" />

describe("player", function () {

    it("returns you the selected source", function () {
        var url = "http://www.right.com/video.mp4";
        var getSrcSpy = jasmine.createSpy('getSrc');

        var selectedSource = {
            src: url,
            type: "mp4",
            "data-resolution": "240p",
        };

        var mp4Source = {
            src: "http://www.wrong.com/video.mp4",
            type: "mp4",
            "data-resolution": "480p",
        };

        var oggSource = {
            src: "http://www.wrong.com/video.ogg",
            type: "ogg",
            "data-resolution": "480p",
        };

        var sources =
            [
                selectedSource,
                mp4Source,
                oggSource
            ];

        var vjsPlayer = {
            id: jasmine.createSpy("player.id"),
            src: getSrcSpy,
            options: jasmine.createSpy('player.options').andReturn({
                            sources: sources
                        }
                    ),
            dispose: jasmine.createSpy("player.dispose"),
            createEl: jasmine.createSpy("player.createEl"),
            el: jasmine.createSpy("player.el"),
            addChild: jasmine.createSpy("player.addChild"),
            children: jasmine.createSpy("player.children"),
            on: jasmine.createSpy("player.on"),
            off: jasmine.createSpy("player.off"),
            paused: jasmine.createSpy("player.paused"),
            one: jasmine.createSpy("player.one"),
            trigger: jasmine.createSpy("player.trigger"),
            show: jasmine.createSpy("player.show"),
            hide: jasmine.createSpy("player.hide"),
            pause: jasmine.createSpy("player.pause"),
            width: jasmine.createSpy("player.width"),
            height: jasmine.createSpy("player.height"),
            dimensions: jasmine.createSpy("player.dimensions"),
            currentTime: jasmine.createSpy("player.currentTime"),
            techName: jasmine.createSpy("player.techName"),
            play: jasmine.createSpy("player.play"),
            lockShowing: jasmine.createSpy("player.lockShowing"),
            unlockShowing: jasmine.createSpy("player.unlockShowing"),
            currentSrc: jasmine.createSpy("player.currentSrc").andReturn(url),
            duration: jasmine.createSpy("player.duration"),
            }

        var player: VjsPluginComponents.IPlayer = new VjsPluginComponents.Player(vjsPlayer);

        expect(player.getVideo().getPlayingSource().resolution).toBe("240");
        expect(player.getVideo().getPlayingSource().src).toBe(selectedSource["src"]);
        expect(player.getVideo().getPlayingSource().type).toBe(selectedSource["type"]);
    });

    it("returns you all mp4 and ogg sources", function () {
        var url = "http://www.right.com/video.mp4";
        var getSrcSpy = jasmine.createSpy('getSrc');

        var selectedSource = {
            src: url,
            type: "mp4",
            "data-resolution": "240p",
        };

        var mp4Source = {
            src: "http://www.wrong.com/video.mp4",
            type: "mp4",
            "data-resolution": "480p",
        };

        var oggSource = {
            src: "http://www.wrong.com/video.ogg",
            type: "ogg",
            "data-resolution": "480p",
        };

        var sources =
            [
                selectedSource,
                mp4Source,
                oggSource
            ];

        var vjsPlayer = {
            id: jasmine.createSpy("player.id"),
            src: getSrcSpy,
            options: jasmine.createSpy('getSrc').andReturn({
                sources: sources
            }),
            dispose: jasmine.createSpy("player.dispose"),
            createEl: jasmine.createSpy("player.createEl"),
            el: jasmine.createSpy("player.el"),
            paused: jasmine.createSpy("player.paused"),
            addChild: jasmine.createSpy("player.addChild"),
            children: jasmine.createSpy("player.children"),
            on: jasmine.createSpy("player.on"),
            off: jasmine.createSpy("player.off"),
            one: jasmine.createSpy("player.one"),
            trigger: jasmine.createSpy("player.trigger"),
            show: jasmine.createSpy("player.show"),
            hide: jasmine.createSpy("player.hide"),
            pause: jasmine.createSpy("player.pause"),
            width: jasmine.createSpy("player.width"),
            height: jasmine.createSpy("player.height"),
            dimensions: jasmine.createSpy("player.dimensions"),
            currentTime: jasmine.createSpy("player.currentTime"),
            techName: jasmine.createSpy("player.techName"),
            play: jasmine.createSpy("player.play"),
            lockShowing: jasmine.createSpy("player.lockShowing"),
            unlockShowing: jasmine.createSpy("player.unlockShowing"),
            duration: jasmine.createSpy("player.duration"),
            currentSrc: jasmine.createSpy("player.currentSrc").andReturn(url),
        }

        var player: VjsPluginComponents.IPlayer = new VjsPluginComponents.Player(vjsPlayer);

        expect(player.getVideo().listSourcesByType("mp4").length).toBe(2);
        expect(player.getVideo().listSourcesByType("mp4")[1].src).toBe(selectedSource["src"]);
        expect(player.getVideo().listSourcesByType("mp4")[0].src).toBe(mp4Source["src"]);

        expect(player.getVideo().listSourcesByType("ogg").length).toBe(1);
        expect(player.getVideo().listSourcesByType("ogg")[0].src).toBe(oggSource["src"]);
    });

    it("sets the correct source", function () {
        var url = "http://www.right.com/video.mp4";
        var getSrcSpy = jasmine.createSpy('getSrc');

        var selectedSource = {
            src: url,
            type: "mp4",
            "data-resolution": "240p",
        };

        var mp4Source = {
            src: "http://www.wrong.com/video.mp4",
            type: "mp4",
            "data-resolution": "480p",
        };

        var oggSource = {
            src: "http://www.wrong.com/video.ogg",
            type: "ogg",
            "data-resolution": "480p",
        };

        var sources =            [
                selectedSource,
                mp4Source,
                oggSource
            ];

        var vjsPlayer = {
            id: jasmine.createSpy("player.id"),
            src: getSrcSpy,
            options: jasmine.createSpy('getSrc').andReturn({
                sources: sources
            }
                    ),
            dispose: jasmine.createSpy("player.dispose"),
            createEl: jasmine.createSpy("player.createEl"),
            el: jasmine.createSpy("player.el"),
            addChild: jasmine.createSpy("player.addChild"),
            children: jasmine.createSpy("player.children"),
            on: jasmine.createSpy("player.on"),
            off: jasmine.createSpy("player.off"),
            one: jasmine.createSpy("player.one"),
            trigger: jasmine.createSpy("player.trigger"),
            show: jasmine.createSpy("player.show"),
            hide: jasmine.createSpy("player.hide"),
            width: jasmine.createSpy("player.width"),
            height: jasmine.createSpy("player.height"),
            dimensions: jasmine.createSpy("player.dimensions"),
            currentTime: jasmine.createSpy("player.currentTime"),
            techName: jasmine.createSpy("player.techName"),
            paused: jasmine.createSpy("player.paused"),
            pause: jasmine.createSpy("player.pause"),
            play: jasmine.createSpy("player.play"),
            lockShowing: jasmine.createSpy("player.lockShowing"),
            unlockShowing: jasmine.createSpy("player.unlockShowing"),
            currentSrc: jasmine.createSpy("player.currentSrc").andReturn(url),
            duration: jasmine.createSpy("player.duration"),
        }

        var player: VjsPluginComponents.IPlayer = new VjsPluginComponents.Player(vjsPlayer);

        player.getVideo().setPlayingSource(new VjsPluginComponents.VideoSource(mp4Source));

        expect(player.getVideo().getPlayingSource().resolution).toBe("480");
        expect(player.getVideo().getPlayingSource().src).toBe(mp4Source["src"]);
        expect(player.getVideo().getPlayingSource().type).toBe(mp4Source["type"]);

        expect(getSrcSpy).toHaveBeenCalledWith(mp4Source);
    });
});