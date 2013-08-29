///<reference path='IEntity.ts'/>
module VjsPluginComponents {
    export function GetNextFreeId(list: IEntity[]) {
        list.sort((a, b) => { return a.id - b.id });

        for (var i = 0; i < list.length; i++)
        {
            if (list[i].id > (i + 1)) {
                return (i + 1);
            }
        }

        return i + 1;
    }
}