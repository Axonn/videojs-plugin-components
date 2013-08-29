/// <reference path="../src/definitions/Jasmine.d.ts" />
/// <reference path="../src/ts/ObservableRepository.ts" />
/// <reference path="../src/ts/Observable.ts" />
/// <chutzpah_reference path="../../../lib/JQuery/jquery-1.9.1.js" />

describe("observableRepository", () => {
    var entity = (id: number) => { return { id: id } }

    it("adds elements correctly", () => {
        var sut = new VjsPluginComponents.ObservableRepository(new VjsPluginComponents.Observable())

        sut.create(entity(1));

        var testEntity = sut.getEntity(1);

        expect(testEntity).toEqual(entity(1));
    });

    it("adds multiple elements correctly", () => {
        var sut = new VjsPluginComponents.ObservableRepository(new VjsPluginComponents.Observable())

        sut.create(entity(1));
        sut.create(entity(2));

        var testEntity = sut.getEntity(1);
        var testEntity2 = sut.getEntity(2);

        expect(testEntity).toEqual(entity(1));
        expect(testEntity2).toEqual(entity(2));
    });

    it("removes an element correctly", () => {
        var sut = new VjsPluginComponents.ObservableRepository(new VjsPluginComponents.Observable())

        sut.create(entity(1));
        sut.create(entity(2));

        sut.remove(2);

        var testEntity = sut.getEntity(1);
        var testEntity2 = sut.getEntity(2);

        expect(testEntity).toEqual(entity(1));
        expect(testEntity2).toEqual(null);
    });
});