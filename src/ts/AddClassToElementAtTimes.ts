///<reference path='../definitions/JQuery.d.ts'/>
///<reference path='../definitions/dustjs-linkedin.d.ts'/>
///<reference path='IObservableRepository.ts'/>
///<reference path='IPeriod.ts'/>

//module VjsPluginComponents {
//    export function AddClassToElementAtTimes(eventRepository: IObservableRepository){
//        return (elementClass: string) => {
//            return (element: JQuery) => {
//                return (period: IPeriod) => {
//                    if (period.type == "flash") {
//                        eventRepository.create({
//                            id: 0,
//                            time: period.start,
//                            handler: () => { element.addClass(elementClass) }
//                        });
//                    } else if (period.type == "switch") {
//                        eventRepository.create({
//                            id: 0,
//                            startEvent: {
//                                time: period.start,
//                                handler: () => { element.addClass(elementClass) }
//                            },
//                            endEvent: {
//                                time: period.end,
//                                handler: () => { element.removeClass(elementClass) }
//                            }
//                        });
//                    }
//                }
//            }
//        }
//    }
//}