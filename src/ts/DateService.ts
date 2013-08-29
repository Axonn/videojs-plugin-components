///<reference path='IDateService.ts'/>

module VjsPluginComponents {
    export class DateService implements IDateService {
        constructor() {
        }

        getCurrentTime() {
            return new Date().getTime();
        }
    }
}