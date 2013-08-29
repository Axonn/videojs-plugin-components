/// <reference path="../src/definitions/Jasmine.d.ts" />
/// <reference path="../src/ts/ObservableRepository.ts" />
/// <reference path="../src/ts/ObservableSubRepository.ts" />
/// <reference path="../src/ts/Observable.ts" />
/// <chutzpah_reference path="../../../lib/JQuery/jquery-1.9.1.js" />

describe("observableSubRepository", () => {
    var entity = (id: number) => { return { id: id } }
    var baseRepository: VjsPluginComponents.IObservableRepository;

    beforeEach(() => {
        baseRepository = new VjsPluginComponents.ObservableRepository(new VjsPluginComponents.Observable());
    });

    it("adds elements correctly", () => {
        var sut = new VjsPluginComponents.ObservableSubRepository(baseRepository, new VjsPluginComponents.Observable());

        sut.create(entity(1));

        var testEntity = sut.getEntity(1);

        expect(testEntity).toEqual(entity(1));
    });

    it("adds multiple elements correctly", () => {
        var sut = new VjsPluginComponents.ObservableSubRepository(baseRepository, new VjsPluginComponents.Observable());

        sut.create(entity(1));
        sut.create(entity(2));

        var testEntity = sut.getEntity(1);
        var testEntity2 = sut.getEntity(2);

        expect(testEntity).toEqual(entity(1));
        expect(testEntity2).toEqual(entity(2));
    });

    it("removes an element correctly", () => {
        var sut = new VjsPluginComponents.ObservableSubRepository(baseRepository, new VjsPluginComponents.Observable());

        sut.create(entity(1));
        sut.create(entity(2));

        sut.remove(2);

        var testEntity = sut.getEntity(1);
        var testEntity2 = sut.getEntity(2);

        expect(testEntity).toEqual(entity(1));
        expect(testEntity2).toEqual(null);
    });

    it("removes an element when it is removed from base", () => {
        var sut = new VjsPluginComponents.ObservableSubRepository(baseRepository, new VjsPluginComponents.Observable());

        sut.create(entity(1));
        sut.create(entity(2));

        baseRepository.remove(2);

        var testEntity = sut.getEntity(1);
        var testEntity2 = sut.getEntity(2);

        expect(testEntity).toEqual(entity(1));
        expect(testEntity2).toEqual(null);
    });

    it("updates when base is updated", () => {
        var sut = new VjsPluginComponents.ObservableSubRepository(baseRepository, new VjsPluginComponents.Observable());

        sut.create(entity(1));
        sut.create(entity(2));

        var alteredEntity = entity(2);
        alteredEntity["value"] = "new";

        baseRepository.update(alteredEntity);

        var testEntity = sut.getEntity(1);
        var testEntity2 = sut.getEntity(2);

        expect(testEntity).toEqual(entity(1));
        expect(testEntity2).toNotEqual(entity(2));
        expect(testEntity2).toEqual(alteredEntity);
    });

    it("updates base when updated", () => {
        var sut = new VjsPluginComponents.ObservableSubRepository(baseRepository, new VjsPluginComponents.Observable());

        sut.create(entity(1));
        sut.create(entity(2));

        var alteredEntity = entity(2);
        alteredEntity["value"] = "new";

        sut.update(alteredEntity);

        var testEntity = sut.getEntity(1);
        var testEntity2 = baseRepository.getEntity(2);

        expect(testEntity).toEqual(entity(1));
        expect(testEntity2).toNotEqual(entity(2));
        expect(testEntity2).toEqual(alteredEntity);
    });

    it("removes all values on clear", () => {
        var sut = new VjsPluginComponents.ObservableSubRepository(baseRepository, new VjsPluginComponents.Observable());

        sut.create(entity(1));
        sut.create(entity(2));
        baseRepository.create(entity(3));

        sut.clear();

        var testEntity = sut.getEntity(1);
        var testEntity2 = sut.getEntity(2);
        var testEntity3 = baseRepository.getEntity(3);

        expect(testEntity).toEqual(null);
        expect(testEntity2).toEqual(null);
        expect(testEntity3).toEqual(entity(3));
    });
});