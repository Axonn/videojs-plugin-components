///<reference path='ISinglePointEvent.ts'/>
module VjsPluginComponents {
    export function EventSortingFunction(a, b) {
        //A appears after B when positive
        if ((a.time - b.time) == 0) {
            return getBoundaryOrdering(a.boundaryType) - getBoundaryOrdering(b.boundaryType);
        } else {
            return a.time - b.time;
        }
    }

    export function getBoundaryOrdering(boundaryType: string): number {
        switch (boundaryType.toLowerCase()) {
            case "approach":
                return 0;
            case "point":
                return 1;
            case "depart":
                return 2;
            default:
                throw Error("Invalid boundary type entered: " + boundaryType);
        }
    }
}