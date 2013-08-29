/// <reference path="../src/definitions/Jasmine.d.ts" />
/// <reference path="../src/ts/GetNextFreeId.ts" />
/// <chutzpah_reference path="../../../lib/JQuery/jquery-1.9.1.js" />

describe("getNextFreeIdFunc", () => {
    it("Returns 1 for an empty list", () => {
        var id = VjsPluginComponents.GetNextFreeId([]);

        expect(id).toBe(1);
    });

    it("Returns last value for multi var list", () => {
        var id = VjsPluginComponents.GetNextFreeId([{ id: 1 }, { id: 2 }, { id: 3 }]);

        expect(id).toBe(4);
    });

    it("Returns missing value in multi var list", () => {
        var id = VjsPluginComponents.GetNextFreeId([{ id: 1 }, { id: 3 }, { id: 4 }]);

        expect(id).toBe(2);
    });

    it("Returns missing value in larger non sorted multi var list", () => {
        var id = VjsPluginComponents.GetNextFreeId([{ id: 4 }, { id: 1 }, { id: 7 }, { id: 2 }, { id: 3 }]);

        expect(id).toBe(5);
    });

    it("Returns 1 in list missing first value", () => {
        var id = VjsPluginComponents.GetNextFreeId([{ id: 5 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 7 }]);

        expect(id).toBe(1);
    });
});