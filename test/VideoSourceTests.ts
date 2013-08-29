/// <reference path="../src/definitions/Jasmine.d.ts" />
/// <reference path="../src/definitions/JQuery.d.ts" />
/// <reference path="../src/ts/VideoSource.ts" />
/// <reference path="../src/ts/IVideoSource.ts" />

describe("video source", function () {
    it("returns you the correct values", function () {
        var vjsSource = {};
        vjsSource["type"] = "mp4";
        vjsSource["src"] = "URL";
        vjsSource["data-resolution"] = "240p";

        var source = new VjsPluginComponents.VideoSource(vjsSource);

        expect(source.type).toBe("mp4");
        expect(source.src).toBe("URL");
        expect(source.resolution).toBe("240");
    });
});