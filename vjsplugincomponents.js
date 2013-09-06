var VjsPluginComponents;
(function (VjsPluginComponents) {
    function ApplySingleService(player) {
        return function (serviceName) {
            return function (serviceConstructor) {
                var service = GetService(player, serviceName);
                if (typeof service === "undefined") {
                    service = serviceConstructor();
                    service["serviceName"] = serviceName;
                    player.addChild(service);
                }
                return service;
            };
        };
    }
    VjsPluginComponents.ApplySingleService = ApplySingleService;

    function GetService(player, serviceName) {
        var children = player.children();
        return jQuery.grep(children, function (child) {
            return child["serviceName"] === serviceName;
        })[0];
    }
    VjsPluginComponents.GetService = GetService;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var Component = (function () {
        function Component(player) {
            this._player = player;
            this._component = new _V_.Component(player.toOriginal(), { el: this.createEl() });
        }
        Component.prototype.dispose = function () {
            this._component.dispose();
        };

        Component.prototype.createEl = function (tagName, properties) {
            return this.elCreator(tagName, properties);
        };

        Component.prototype.elCreator = function (tagName, properties) {
            var el = document.createElement(tagName || 'div');

            for (var propName in properties) {
                if (properties.hasOwnProperty(propName)) {
                    if (propName.indexOf('aria-') !== -1 || propName == 'role') {
                        el.setAttribute(propName, properties[propName]);
                    } else {
                        el[propName] = properties[propName];
                    }
                }
            }
            return el;
        };

        Component.prototype.el = function () {
            return this._component.el();
        };

        Component.prototype.addChild = function (child, options) {
            if (options === undefined) {
                this._component.addChild(child);
            } else {
                this._component.addChild(child, options);
            }
        };

        Component.prototype.children = function () {
            return this._component.children();
        };

        Component.prototype.on = function (type, fn) {
            this._component.on(type, fn);
        };

        Component.prototype.off = function (type, fn) {
            this._component.off(type, fn);
        };

        Component.prototype.one = function (type, fn) {
            this._component.one(type, fn);
        };

        Component.prototype.trigger = function (type, event) {
            this._component.trigger(type, event);
        };

        Component.prototype.show = function () {
            this._component.show();
        };

        Component.prototype.hide = function () {
            this._component.hide();
        };

        Component.prototype.width = function () {
            return this._component.width();
        };

        Component.prototype.height = function () {
            return this._component.height();
        };

        Component.prototype.dimensions = function (width, height) {
            this._component.dimensions(width, height);
        };

        Component.prototype.addClass = function (className) {
            jQuery(this.el()).addClass(className);
        };

        Component.prototype.removeClass = function (className) {
            jQuery(this.el()).removeClass(className);
        };

        Component.prototype.unlockShowing = function () {
            this._component.unlockShowing();
        };

        Component.prototype.lockShowing = function () {
            this._component.lockShowing();
        };
        return Component;
    })();
    VjsPluginComponents.Component = Component;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(player) {
            var _this = this;
            _super.call(this, player);

            this.on('click', function () {
                _this.onClick();
            });
            this.on('focus', function () {
                _this.onFocus();
            });
            this.on('blur', function () {
                _this.onBlur();
            });
            this._component = new _V_.Component(player.toOriginal(), { el: this.createEl() });
        }
        Button.prototype.createEl = function (tagName, properties) {
            return _super.prototype.createEl.call(this, tagName, properties);
        };

        Button.prototype.onClick = function () {
        };

        Button.prototype.onFocus = function () {
        };

        Button.prototype.onBlur = function () {
        };
        return Button;
    })(VjsPluginComponents.Component);
    VjsPluginComponents.Button = Button;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var TimeBasedEventManager = (function () {
        function TimeBasedEventManager(player, singlePointList, timeBasedEventRepository) {
            var _this = this;
            this._player = player;
            this._previouslyWatchedSpan = { start: 0, end: 0 };
            this._handlersToTrigger = singlePointList;
            this._timeBasedEventsToTrigger = timeBasedEventRepository;

            this._timeBasedEventsToTrigger.on("create", function (args) {
                _this.updateTimeBasedEventState(_this._previouslyWatchedSpan.start, args.entity);
            });
            this._player.on("videoWatched", function (args) {
                _this.triggerTimeBasedEvents(args);
            });
        }
        TimeBasedEventManager.prototype.triggerTimeBasedEvents = function (args) {
            var _this = this;
            if (args.start != this._previouslyWatchedSpan.end) {
                this._handlersToTrigger.reset(function (event) {
                    if (args.start > event.time) {
                        return false;
                    } else if (args.start == event.time && event.boundaryType == "approach") {
                        return false;
                    } else {
                        return true;
                    }
                });

                this.updateTimeBasedEventStates(args.start);
            }

            var checkIfEventTrigger = this.CheckIfEventTriggered(args.start)(args.end);

            var event = function () {
                return _this._handlersToTrigger.getCurrent();
            };

            while (!this._handlersToTrigger.isFinished() && checkIfEventTrigger(event().time)(event().boundaryType)) {
                this.triggerHandler(event().handler, event().time, args.end);
                var newEvent = event();
                newEvent++;
                this._handlersToTrigger.update(newEvent);
                this._handlersToTrigger.moveNext();
            }

            this._previouslyWatchedSpan = {
                start: args.start,
                end: args.end
            };
        };

        TimeBasedEventManager.prototype.CheckIfEventTriggered = function (startTime) {
            return function (endTime) {
                return function (triggerTime) {
                    return function (boundaryType) {
                        switch (boundaryType) {
                            case "point":
                                if (triggerTime >= startTime && triggerTime <= endTime) {
                                    return true;
                                } else {
                                    return false;
                                }
                                break;
                            case "approach":
                                if (triggerTime > startTime && triggerTime <= endTime) {
                                    return true;
                                } else {
                                    return false;
                                }
                                break;
                            case "depart":
                                if (triggerTime >= startTime && triggerTime < endTime) {
                                    return true;
                                } else {
                                    return false;
                                }
                                break;
                            default:
                                throw Error("Invalid boundary type entered: " + boundaryType + "; Valid types are: 'point', 'approach' and 'depart'");
                        }
                    };
                };
            };
        };

        TimeBasedEventManager.prototype.triggerHandler = function (handler, eventTime, callTime) {
            handler({
                eventTime: eventTime,
                callTime: callTime
            });
        };

        TimeBasedEventManager.prototype.updateTimeBasedEventStates = function (time) {
            var timeBasedEventsToTrigger = this._timeBasedEventsToTrigger.toList();
            for (var i = 0; i < timeBasedEventsToTrigger.length; i++) {
                var event = timeBasedEventsToTrigger[i];
                this.updateTimeBasedEventState(time, event);
            }
        };

        TimeBasedEventManager.prototype.updateTimeBasedEventState = function (time, event) {
            if (event.isOn) {
                if (!(time >= event.startEvent.time && time <= event.endEvent.time)) {
                    this.triggerHandler(event.endEvent.handler, event.startEvent.time, time);
                }
            } else {
                if (time >= event.startEvent.time && time <= event.endEvent.time) {
                    this.triggerHandler(event.startEvent.handler, event.startEvent.time, time);
                }
            }
        };

        TimeBasedEventManager.prototype.isPointStillToBePlayed = function (event, currentTime) {
            if (currentTime > event.time) {
                return false;
            } else if (currentTime == event.time && event.boundaryType == "approach") {
                return false;
            } else {
                return true;
            }
        };
        TimeBasedEventManager.name = "timeBasedEventManager";
        return TimeBasedEventManager;
    })();
    VjsPluginComponents.TimeBasedEventManager = TimeBasedEventManager;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    function ContainerBuilder(parent) {
        return function (name) {
            return function (index) {
                var container = jQuery('<div/>', {
                    id: (name + index.toString()),
                    "class": (name)
                });

                container.appendTo(jQuery(parent));

                return container;
            };
        };
    }
    VjsPluginComponents.ContainerBuilder = ContainerBuilder;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var DateService = (function () {
        function DateService() {
        }
        DateService.prototype.getCurrentTime = function () {
            return new Date().getTime();
        };
        return DateService;
    })();
    VjsPluginComponents.DateService = DateService;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var VideoSource = (function () {
        function VideoSource(source) {
            this.src = source.src;
            this.type = source.type;
            this.resolution = this.getResolutionFromSource(source);
        }
        VideoSource.prototype.getResolutionFromSource = function (source) {
            return source["data-resolution"].match("[0-9]*")[0];
        };
        return VideoSource;
    })();
    VjsPluginComponents.VideoSource = VideoSource;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var DefaultVideo = (function () {
        function DefaultVideo(player, setSource) {
            this._sourcesByType = {};
            this._player = player;
            this._setSource = setSource;
            this.id = this._player.id();
        }
        DefaultVideo.prototype.getWithSrc = function (src) {
            return jQuery.grep(this._player.options().sources, function (value) {
                return value.src == src;
            })[0];
        };

        DefaultVideo.prototype.getPlayingSource = function () {
            if (this._selectedSource === undefined) {
                this._selectedSource = new VjsPluginComponents.VideoSource(this.getWithSrc(this._player.currentSrc()));
            }
            ;

            return this._selectedSource;
        };

        DefaultVideo.prototype.setPlayingMatching = function (matchFunc) {
            this.setPlayingSource(matchFunc(this.listSources()));
        };

        DefaultVideo.prototype.setPlayingSource = function (source) {
            this._selectedSource = source;
            this._setSource(this.getWithSrc(source.src));
        };

        DefaultVideo.prototype.listSourcesByType = function (type) {
            if (this._sourcesByType[type] === undefined) {
                var sources = jQuery.grep(this.listSources(), function (value) {
                    return value.type == type;
                });

                this._sourcesByType[type] = sources;

                this._sourcesByType[type].sort(function (a, b) {
                    return (parseFloat(b.resolution) - parseFloat(a.resolution));
                });
            }
            ;

            return this._sourcesByType[type];
        };

        DefaultVideo.prototype.listSources = function () {
            var _this = this;
            if (typeof this._sources === "undefined") {
                this._sources = [];
                jQuery.each(this._player.options().sources, function (i, source) {
                    _this._sources.push(new VjsPluginComponents.VideoSource(source));
                });
            }
            return this._sources;
        };
        return DefaultVideo;
    })();
    VjsPluginComponents.DefaultVideo = DefaultVideo;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var DurationSetEmitter = (function () {
        function DurationSetEmitter(player) {
            var checkDuration = function () {
                if (typeof player.duration() !== "undefined") {
                    player.trigger("durationset");
                }
            };

            player.on("durationchange", checkDuration);
        }
        DurationSetEmitter.name = "durationSetEmitter";
        return DurationSetEmitter;
    })();
    VjsPluginComponents.DurationSetEmitter = DurationSetEmitter;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    function EventSortingFunction(a, b) {
        if ((a.time - b.time) == 0) {
            return getBoundaryOrdering(a.boundaryType) - getBoundaryOrdering(b.boundaryType);
        } else {
            return a.time - b.time;
        }
    }
    VjsPluginComponents.EventSortingFunction = EventSortingFunction;

    function getBoundaryOrdering(boundaryType) {
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
    VjsPluginComponents.getBoundaryOrdering = getBoundaryOrdering;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    function GetNextFreeId(list) {
        list.sort(function (a, b) {
            return a.id - b.id;
        });

        for (var i = 0; i < list.length; i++) {
            if (list[i].id > (i + 1)) {
                return (i + 1);
            }
        }

        return i + 1;
    }
    VjsPluginComponents.GetNextFreeId = GetNextFreeId;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var ObservableRepository = (function () {
        function ObservableRepository(observable) {
            this._objects = [];
            this._observable = observable;
        }
        ObservableRepository.prototype.create = function (entity) {
            entity.id = VjsPluginComponents.GetNextFreeId(this._objects);
            this._objects.push(entity);
            this.trigger("create", { entity: entity });
            return entity;
        };

        ObservableRepository.prototype.getEntity = function (id) {
            var foundArray = jQuery.grep(this._objects, function (val) {
                return val.id == id;
            });
            if (foundArray.length != 0) {
                return foundArray[0];
            } else {
                return null;
            }
        };

        ObservableRepository.prototype.remove = function (id) {
            var originalLength = this._objects.length;
            this._objects = jQuery.grep(this._objects, function (val) {
                return val.id != id;
            });
            this.trigger("remove", { id: id });
            return (originalLength !== this._objects.length);
        };

        ObservableRepository.prototype.update = function (entity) {
            var index = this.getIndexForId(entity.id);
            var hasUpdated = false;
            if (index !== null) {
                this._objects[index] = entity;
                hasUpdated = true;
            }
            ;

            this.trigger("update", { entity: entity });

            return hasUpdated;
        };

        ObservableRepository.prototype.on = function (eventName, delegate) {
            this._observable.on(eventName, delegate);
        };

        ObservableRepository.prototype.trigger = function (eventName, args) {
            this._observable.trigger(eventName, args);
        };

        ObservableRepository.prototype.toList = function () {
            return this._objects;
        };

        ObservableRepository.prototype.clear = function () {
            this._objects = [];
            this.trigger("clear", {});
            return true;
        };

        ObservableRepository.prototype.getIndexForId = function (id) {
            for (var i = 0; i < this._objects.length; i++) {
                if (this._objects[i].id === id) {
                    return i;
                }
                ;
            }
            return null;
        };
        return ObservableRepository;
    })();
    VjsPluginComponents.ObservableRepository = ObservableRepository;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var LayerRepository = (function () {
        function LayerRepository(baseRepository, renderEngine, containerBuilder) {
            this._baseRepository = baseRepository;
            this._renderEngine = renderEngine;
            this._containerBuilder = containerBuilder;
        }
        LayerRepository.prototype.createFromSpecification = function (layerSpecification) {
            var layer = this.create({ id: null, container: null });

            layer.container = this._containerBuilder(layer.id);

            this._renderEngine.render(layerSpecification.template.name, { model: layerSpecification.model }, function (err, out) {
                if (!err) {
                    layer.container.html(out);
                } else {
                    console.log(err.message);
                }
            });

            this.update(layer);

            return layer;
        };

        LayerRepository.prototype.create = function (layer) {
            return this._baseRepository.create(layer);
        };

        LayerRepository.prototype.on = function (eventName, handler) {
            this._baseRepository.on(eventName, handler);
        };

        LayerRepository.prototype.trigger = function (eventName, args) {
            this._baseRepository.trigger(eventName, args);
        };

        LayerRepository.prototype.toList = function () {
            return this._baseRepository.toList();
        };

        LayerRepository.prototype.getEntity = function (id) {
            return this._baseRepository.getEntity(id);
        };

        LayerRepository.prototype.remove = function (id) {
            var layer = this.getEntity(id);

            layer.container.remove();

            return this._baseRepository.remove(id);
        };

        LayerRepository.prototype.update = function (layer) {
            return this._baseRepository.update(layer);
        };

        LayerRepository.prototype.clear = function () {
            return this._baseRepository.clear();
        };
        return LayerRepository;
    })();
    VjsPluginComponents.LayerRepository = LayerRepository;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var MenuItem = (function (_super) {
        __extends(MenuItem, _super);
        function MenuItem(player) {
            var _this = this;
            _super.call(this, player);

            this.on('click', function () {
                _this.onClick();
            });
            this.on('focus', function () {
                _this.onFocus();
            });
            this.on('blur', function () {
                _this.onBlur();
            });
        }
        MenuItem.prototype.createEl = function (tagName, properties) {
            properties = jQuery.extend({
                role: "button",
                'aria-live': 'polite',
                tabIndex: 0
            }, properties);

            return _super.prototype.createEl.call(this, "li", properties);
        };

        MenuItem.prototype.onClick = function () {
        };

        MenuItem.prototype.onFocus = function () {
        };

        MenuItem.prototype.onBlur = function () {
        };
        return MenuItem;
    })(VjsPluginComponents.Button);
    VjsPluginComponents.MenuItem = MenuItem;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu(player) {
            _super.call(this, player);
            this.items = [];
        }
        Menu.prototype.createEl = function (tagName, properties) {
            properties = jQuery.extend({
                className: 'vjs-menu'
            }, properties);

            return _super.prototype.createEl.call(this, "ul", properties);
        };

        Menu.prototype.addItem = function (item) {
            var _this = this;
            this.items.push(item);
            this.addChild(item);
            item.on('click', function () {
                _this.unlockShowing();
            });
        };
        return Menu;
    })(VjsPluginComponents.Component);
    VjsPluginComponents.Menu = Menu;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var triggerableEvent = (function () {
        function triggerableEvent() {
            this.delegates = [];
        }
        return triggerableEvent;
    })();
    VjsPluginComponents.triggerableEvent = triggerableEvent;

    var Observable = (function () {
        function Observable() {
            this._events = {};
        }
        Observable.prototype.on = function (eventName, delegate) {
            if (this._events[eventName] == null) {
                this._events[eventName] = new triggerableEvent();
            }

            this._events[eventName].delegates.push(delegate);
        };

        Observable.prototype.trigger = function (eventName, args) {
            if (this._events[eventName] != null) {
                for (var i = 0; i < this._events[eventName].delegates.length; i++) {
                    this._events[eventName].delegates[i](args);
                }
                ;
            }
        };
        return Observable;
    })();
    VjsPluginComponents.Observable = Observable;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var ObservableSubRepository = (function () {
        function ObservableSubRepository(baseRepository, observable) {
            var _this = this;
            this._baseRepository = baseRepository;
            this._observable = observable;
            this._objects = [];

            this._baseRepository.on("update", function (args) {
                for (var i = 0; i < _this._objects.length; i++) {
                    if (_this._objects[i].id == args.entity.id) {
                        _this._objects[i] = args.entity;
                        _this.trigger("update", args);
                    }
                }
            });

            this._baseRepository.on("remove", function (args) {
                var originalLength = _this._objects.length;
                _this._objects = jQuery.grep(_this._objects, function (val) {
                    return val.id != args.id;
                });
                if (originalLength !== _this._objects.length) {
                    _this.trigger("remove", { id: args.id });
                }
                return (originalLength !== _this._objects.length);
            });
        }
        ObservableSubRepository.prototype.create = function (entity) {
            var newEntity = this._baseRepository.create(entity);
            this._objects.push(newEntity);
            this.trigger("create", { entity: entity });
            return newEntity;
        };

        ObservableSubRepository.prototype.on = function (eventName, handler) {
            this._observable.on(eventName, handler);
        };

        ObservableSubRepository.prototype.trigger = function (eventName, args) {
            this._observable.trigger(eventName, args);
        };

        ObservableSubRepository.prototype.toList = function () {
            return this._objects;
        };

        ObservableSubRepository.prototype.getEntity = function (id) {
            var foundArray = jQuery.grep(this._objects, function (val) {
                return val.id == id;
            });
            if (foundArray.length != 0) {
                return foundArray[0];
            } else {
                return null;
            }
        };

        ObservableSubRepository.prototype.remove = function (id) {
            return this._baseRepository.remove(id);
        };

        ObservableSubRepository.prototype.update = function (entity) {
            return this._baseRepository.update(entity);
        };

        ObservableSubRepository.prototype.clear = function () {
            for (var i = 0; i < this._objects.length; i++) {
                this._baseRepository.remove(this._objects[i].id);
            }
            this._objects = [];
            this.trigger("clear", {});
            return true;
        };
        return ObservableSubRepository;
    })();
    VjsPluginComponents.ObservableSubRepository = ObservableSubRepository;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var OverlayManager = (function () {
        function OverlayManager(player, overlayRepository) {
            var _this = this;
            this._player = player;
            this._overlayRepository = overlayRepository;
            this._player.on("videoChange", function () {
                _this.updateOverlays();
            });
            this.initializeNewOverlays();
        }
        OverlayManager.prototype.updateOverlays = function () {
            this._overlayRepository.clear();
            this.initializeNewOverlays();
        };

        OverlayManager.prototype.initializeNewOverlays = function () {
            var overlaySpecs = this._player.getVideo().overlays;
            for (var i = 0; i < overlaySpecs.length; i++) {
                var overlay = this._overlayRepository.createFromSpecification(overlaySpecs[i]);
            }
        };
        OverlayManager.name = "OverlayManager";
        return OverlayManager;
    })();
    VjsPluginComponents.OverlayManager = OverlayManager;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var PlayObserver = (function (_super) {
        __extends(PlayObserver, _super);
        function PlayObserver(player) {
            var _this = this;
            _super.call(this);
            this._seeking = false;

            try  {
                this._watchStartTime = 0;

                this._player = player;
                this._player.on("timeupdate", function () {
                    _this.triggerVideoWatched();
                });

                this._player.on("seeked", function () {
                    _this.resetWatchTime();
                });
                this._player.on("seeking", function () {
                    _this.resetWatchTime();
                });
                this._player.on("playing", function () {
                    _this._seeking = false;
                });
                this._player.on("canplay", function () {
                    _this._seeking = false;
                });
                this._player.on("canplaythrough", function () {
                    _this._seeking = false;
                });

                this._player = player;
            } catch (error) {
                this._player.trigger("error", error);
            }
        }
        PlayObserver.prototype.triggerVideoWatched = function () {
            if (Math.abs(this._watchStartTime - this.getFixedCurrentTime()) > 0.5) {
                this.resetWatchTime();
            }

            var currentTime = this.getFixedCurrentTime();

            this.trigger("videoWatched", {
                start: this._watchStartTime,
                end: currentTime
            });
            this._watchStartTime = currentTime;
        };

        PlayObserver.prototype.resetWatchTime = function () {
            this._watchStartTime = this.getFixedCurrentTime();
        };

        PlayObserver.prototype.getFixedCurrentTime = function () {
            if (typeof this._player.duration() === "undefined" || this._player.currentTime() < this._player.duration()) {
                return this._player.currentTime();
            } else {
                return this._player.duration();
            }
        };
        PlayObserver.name = "playerAnalyticsObserver";
        return PlayObserver;
    })(VjsPluginComponents.Observable);
    VjsPluginComponents.PlayObserver = PlayObserver;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    function TriggerEventHooks(eventList, eventName, args) {
        if (typeof eventList !== "undefined") {
            var eventsArr = eventList[eventName];

            if (typeof eventsArr !== "undefined") {
                var length = eventsArr.length;
                for (var i = 0; i < length; i++) {
                    eventsArr[i](args);
                }
            }
        }
    }
    VjsPluginComponents.TriggerEventHooks = TriggerEventHooks;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var OverlayRepository = (function () {
        function OverlayRepository(baseRepository, player, layerRepository, timeBasedEventRepository) {
            this._eventRepository = timeBasedEventRepository;
            this._player = player;
            this._layerRepository = layerRepository;
            this._baseRepository = baseRepository;
        }
        OverlayRepository.prototype.createFromSpecification = function (overlaySpecification) {
            var layer = this._layerRepository.createFromSpecification(overlaySpecification);

            var overlay = {
                id: 0,
                name: overlaySpecification.name,
                layer: layer
            };

            var overlay = this.create(overlay);

            VjsPluginComponents.TriggerEventHooks(overlaySpecification.events, "onCreate", { player: this._player, overlay: overlay, overlays: this });

            var registerOverlayDisplayFunc = this.registerOverlayDisplay(overlay, overlaySpecification.events);

            for (var i = 0; i < overlaySpecification.displayTimes.length; i++) {
                var displayTime = overlaySpecification.displayTimes[i];

                this._player.one("durationset", registerOverlayDisplayFunc(displayTime));
            }

            return overlay;
        };

        OverlayRepository.prototype.create = function (overlay) {
            return this._baseRepository.create(overlay);
        };

        OverlayRepository.prototype.on = function (eventName, handler) {
            this._baseRepository.on(eventName, handler);
        };

        OverlayRepository.prototype.trigger = function (eventName, args) {
            this._baseRepository.trigger(eventName, args);
        };

        OverlayRepository.prototype.toList = function () {
            return this._baseRepository.toList();
        };

        OverlayRepository.prototype.getEntity = function (id) {
            return this._baseRepository.getEntity(id);
        };

        OverlayRepository.prototype.getEntityByName = function (name) {
            return jQuery.grep(this.toList(), function (overlay, i) {
                return overlay.name === name;
            })[0];
        };

        OverlayRepository.prototype.remove = function (id) {
            var entity = this.getEntity(id);

            this._layerRepository.remove(entity.layer.id);

            this._eventRepository.remove(entity.event.id);

            return this._baseRepository.remove(id);
        };

        OverlayRepository.prototype.update = function (Overlay) {
            return this._baseRepository.update(Overlay);
        };

        OverlayRepository.prototype.clear = function () {
            return this._baseRepository.clear();
        };

        OverlayRepository.prototype.registerOverlayDisplay = function (overlay, events) {
            var _this = this;
            return function (displayTime) {
                return function () {
                    var convertedDisplayTime = _this.convertTimesToAbsolutes(displayTime);

                    overlay.event = _this._eventRepository.create({
                        id: 0,
                        startEvent: {
                            time: convertedDisplayTime.start,
                            handler: function () {
                                VjsPluginComponents.TriggerEventHooks(events, "beforeShow", { player: _this._player, overlay: overlay, overlays: _this });
                                overlay.layer.container.addClass("vjsVisible");
                                VjsPluginComponents.TriggerEventHooks(events, "afterShow", { player: _this._player, overlay: overlay, overlays: _this });
                            }
                        },
                        endEvent: {
                            time: convertedDisplayTime.end,
                            handler: function () {
                                VjsPluginComponents.TriggerEventHooks(events, "beforeHide", { player: _this._player, overlay: overlay, overlays: _this });
                                overlay.layer.container.removeClass("vjsVisible");
                                VjsPluginComponents.TriggerEventHooks(events, "afterHide", { player: _this._player, overlay: overlay, overlays: _this });
                            }
                        }
                    });

                    _this.update(overlay);
                };
            };
        };

        OverlayRepository.prototype.convertTimesToAbsolutes = function (displayTime) {
            var videoEnd = this._player.duration();
            var start = displayTime.start(videoEnd);
            var end = displayTime.end(videoEnd);

            return { type: displayTime.type, start: start, end: end };
        };
        return OverlayRepository;
    })();
    VjsPluginComponents.OverlayRepository = OverlayRepository;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var Player = (function () {
        function Player(player, sourceMatchFunc) {
            var _this = this;
            this._player = player;

            this._sourceMatchFunc = sourceMatchFunc || function (original) {
                return function (sources) {
                    return sources[0];
                };
            };

            if (typeof this._player["setVideo"] === "undefined") {
                this._player["setVideo"] = new VjsPluginComponents.DefaultVideo(this._player, function (src) {
                    return _this.src(src);
                });
            }
        }
        Player.prototype.id = function () {
            return this._player.id();
        };

        Player.prototype.getVideo = function () {
            return this._player["setVideo"];
        };

        Player.prototype.setVideo = function (video) {
            var matchFunc = this._sourceMatchFunc(this._player["setVideo"].getPlayingSource());
            video.setPlayingMatching(matchFunc);
            this._player["setVideo"] = video;
            this.trigger("videoChange");
        };

        Player.prototype.toOriginal = function () {
            return this._player;
        };

        Player.prototype.dispose = function () {
            this._player.dispose();
        };

        Player.prototype.createEl = function (type, props) {
            this._player.createEl(type, props);
        };

        Player.prototype.el = function () {
            return this._player.el();
        };

        Player.prototype.addChild = function (child, options) {
            this._player.addChild(child, options);
        };

        Player.prototype.children = function () {
            return this._player.children();
        };

        Player.prototype.on = function (type, fn) {
            this._player.on(type, fn);
        };

        Player.prototype.off = function (type, fn) {
            this._player.off(type, fn);
        };

        Player.prototype.one = function (type, fn) {
            this._player.one(type, fn);
        };

        Player.prototype.trigger = function (type, event) {
            var args = event || {};
            this._player.trigger({ type: type, target: this._player, args: args });
        };

        Player.prototype.show = function () {
            this._player.show();
        };

        Player.prototype.hide = function () {
            this._player.hide();
        };

        Player.prototype.width = function () {
            return this._player.width();
        };

        Player.prototype.height = function () {
            return this._player.height();
        };

        Player.prototype.dimensions = function (width, height) {
            this._player.dimensions(width, height);
        };

        Player.prototype.currentTime = function (time) {
            return (Math.round(this._player.currentTime(time) * 100) / 100);
        };

        Player.prototype.techName = function () {
            return this._player.techName;
        };

        Player.prototype.play = function () {
            this._player.play();
        };

        Player.prototype.pause = function () {
            this._player.pause();
        };

        Player.prototype.paused = function () {
            return this._player.paused();
        };

        Player.prototype.options = function () {
            return this._player.options();
        };

        Player.prototype.src = function (source) {
            var _this = this;
            if (source === undefined) {
                return this._player.src();
            } else {
                var oldTime = this._player.currentTime();

                this.one('loadedmetadata', function () {
                    _this._player.currentTime(oldTime);
                    _this._player.play();
                });
                return this._player.src(source);
            }
        };

        Player.prototype.changeSrcResetTime = function (source) {
            var _this = this;
            if (source === undefined) {
                return this._player.src();
            } else {
                this.one('loadedmetadata', function () {
                    _this._player.currentTime("0");
                    _this._player.play();
                });
                return this._player.src(source);
            }
        };

        Player.prototype.changeSrcRetainTime = function (source) {
            var _this = this;
            if (source === undefined) {
                return this._player.src();
            } else {
                var oldTime = this._player.currentTime();

                this.one('loadedmetadata', function () {
                    _this._player.currentTime(oldTime);
                    _this._player.play();
                });
                return this._player.src(source);
            }
        };

        Player.prototype.duration = function () {
            return (Math.round(this._player.duration() * 100) / 100);
        };
        return Player;
    })();
    VjsPluginComponents.Player = Player;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var SinglePointEventRepository = (function () {
        function SinglePointEventRepository(baseRepository) {
            this._baseRepository = baseRepository;
        }
        SinglePointEventRepository.prototype.create = function (singlePointEvent) {
            singlePointEvent.boundaryType = singlePointEvent.boundaryType || "point";
            singlePointEvent.callCount = 0;
            return this._baseRepository.create(singlePointEvent);
        };

        SinglePointEventRepository.prototype.on = function (eventName, handler) {
            this._baseRepository.on(eventName, handler);
        };

        SinglePointEventRepository.prototype.trigger = function (eventName, args) {
            this._baseRepository.trigger(eventName, args);
        };

        SinglePointEventRepository.prototype.toList = function () {
            return this._baseRepository.toList();
        };

        SinglePointEventRepository.prototype.getEntity = function (id) {
            return this._baseRepository.getEntity(id);
        };

        SinglePointEventRepository.prototype.remove = function (id) {
            return this._baseRepository.remove(id);
        };

        SinglePointEventRepository.prototype.update = function (singlePointEvent) {
            return this._baseRepository.update(singlePointEvent);
        };

        SinglePointEventRepository.prototype.clear = function () {
            return this._baseRepository.clear();
        };
        return SinglePointEventRepository;
    })();
    VjsPluginComponents.SinglePointEventRepository = SinglePointEventRepository;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var TimeBasedEventRepository = (function () {
        function TimeBasedEventRepository(baseRepository, singlePointEventRepository) {
            this._baseRepository = baseRepository;
            this._singlePointEventRepository = singlePointEventRepository;
        }
        TimeBasedEventRepository.prototype.create = function (timeBasedEvent) {
            if (typeof timeBasedEvent.isOn === "undefined") {
                timeBasedEvent.isOn = false;
            }

            timeBasedEvent.startEvent.boundaryType = timeBasedEvent.startEvent.boundaryType || "point";
            timeBasedEvent.endEvent.boundaryType = timeBasedEvent.endEvent.boundaryType || "depart";

            timeBasedEvent.startEvent = this.addAdditionalFunctionalityToEvent(timeBasedEvent.startEvent, function () {
                timeBasedEvent.isOn = true;
            });
            timeBasedEvent.endEvent = this.addAdditionalFunctionalityToEvent(timeBasedEvent.endEvent, function () {
                timeBasedEvent.isOn = false;
            });

            timeBasedEvent.startEvent = this._singlePointEventRepository.create(timeBasedEvent.startEvent);
            timeBasedEvent.endEvent = this._singlePointEventRepository.create(timeBasedEvent.endEvent);

            return this._baseRepository.create(timeBasedEvent);
        };

        TimeBasedEventRepository.prototype.on = function (eventName, handler) {
            this._baseRepository.on(eventName, handler);
        };

        TimeBasedEventRepository.prototype.trigger = function (eventName, args) {
            this._baseRepository.trigger(eventName, args);
        };

        TimeBasedEventRepository.prototype.toList = function () {
            return this._baseRepository.toList();
        };

        TimeBasedEventRepository.prototype.getEntity = function (id) {
            return this._baseRepository.getEntity(id);
        };

        TimeBasedEventRepository.prototype.remove = function (id) {
            var entity = this.getEntity(id);

            this._singlePointEventRepository.remove(entity.endEvent.id);
            this._singlePointEventRepository.remove(entity.startEvent.id);

            return this._baseRepository.remove(id);
        };

        TimeBasedEventRepository.prototype.update = function (singlePointEvent) {
            return this._baseRepository.update(singlePointEvent);
        };

        TimeBasedEventRepository.prototype.clear = function () {
            return this._baseRepository.clear();
        };

        TimeBasedEventRepository.prototype.addAdditionalFunctionalityToEvent = function (event, func) {
            return {
                time: event.time,
                handler: function (args) {
                    func(args);
                    event.handler(args);
                },
                maxCallCount: event.maxCallCount,
                boundaryType: event.boundaryType,
                callCount: event.callCount,
                id: event.id
            };
        };
        return TimeBasedEventRepository;
    })();
    VjsPluginComponents.TimeBasedEventRepository = TimeBasedEventRepository;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var Timer = (function () {
        function Timer(delayService, dateService) {
            this._previousElapsed = 0;
            this._elapsed = 0;
            this._running = false;
            this._delayService = delayService;
            this._dateService = dateService;
        }
        Timer.prototype.start = function () {
            var _this = this;
            if (this._running == false) {
                this._lastStart = this._dateService.getCurrentTime();
                this._interval = this._delayService.setTimeout(function () {
                    _this.renewUpdateTime();
                }, 100);
                this._running = true;
            }
            ;
        };

        Timer.prototype.renewUpdateTime = function () {
            var _this = this;
            this._interval = this._delayService.setTimeout(function () {
                _this.renewUpdateTime();
            }, 100);
            this.updateTime();
        };

        Timer.prototype.updateTime = function () {
            var time = this._dateService.getCurrentTime() - this._lastStart;
            this._elapsed = time;
        };

        Timer.prototype.stop = function () {
            if (this._running == true) {
                this._previousElapsed += this._elapsed;
                this._delayService.clearTimeout(this._interval);
                this._elapsed = 0;
                this._running = false;
            }
        };

        Timer.prototype.reset = function () {
            this._previousElapsed = 0;
            this._elapsed = 0;
            this._lastStart = this._dateService.getCurrentTime();
        };

        Timer.prototype.getTime = function () {
            return (this._previousElapsed + this._elapsed);
        };
        return Timer;
    })();
    VjsPluginComponents.Timer = Timer;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var TriggerableEvent = (function () {
        function TriggerableEvent() {
            this.delegates = [];
        }
        return TriggerableEvent;
    })();
    VjsPluginComponents.TriggerableEvent = TriggerableEvent;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var Video = (function () {
        function Video(sources, setSource) {
            this._sourcesByType = {};
            this._sources = sources;
            this._setSource = setSource;
        }
        Video.prototype.getWithSrc = function (src) {
            return jQuery.grep(this.listSources(), function (value) {
                return value.src == src;
            })[0];
        };

        Video.prototype.getPlayingSource = function () {
            if (this._selectedSource === undefined) {
                return null;
            }
            ;

            return this._selectedSource;
        };

        Video.prototype.setPlayingMatching = function (matchFunc) {
            this.setPlayingSource(matchFunc(this.listSources()));
        };

        Video.prototype.setPlayingSource = function (source) {
            this._selectedSource = source;
            this._setSource(this.getWithSrc(source.src));
        };

        Video.prototype.listSourcesByType = function (type) {
            if (this._sourcesByType[type] === undefined) {
                var sources = jQuery.grep(this.listSources(), function (value) {
                    return value.type == type;
                });

                this._sourcesByType[type] = sources;

                this._sourcesByType[type].sort(function (a, b) {
                    return (parseFloat(b.resolution) - parseFloat(a.resolution));
                });
            }
            ;

            return this._sourcesByType[type];
        };

        Video.prototype.listSources = function () {
            return this._sources;
        };
        return Video;
    })();
    VjsPluginComponents.Video = Video;
})(VjsPluginComponents || (VjsPluginComponents = {}));
var VjsPluginComponents;
(function (VjsPluginComponents) {
    var WalkableList = (function () {
        function WalkableList(sortFunction, filterFunction, repository) {
            var _this = this;
            this._index = 0;
            this._objects = [];

            this._repository = repository;
            this._sortFunction = sortFunction;
            this._filterFunction = filterFunction;

            this.updateLocalArray();
            this._repository.on("create", function () {
                _this.updateLocalArray();
            });
            this._repository.on("remove", function () {
                _this.updateLocalArray();
            });
        }
        WalkableList.prototype.updateLocalArray = function () {
            this._objects = jQuery.grep(this._repository.toList(), this._filterFunction).sort(this._sortFunction);
        };

        WalkableList.prototype.getCurrent = function () {
            return this._objects[this._index];
        };

        WalkableList.prototype.moveNext = function () {
            this._index++;
        };

        WalkableList.prototype.hasNext = function () {
            return (this._index < this._objects.length);
        };

        WalkableList.prototype.isFinished = function () {
            return (this._index >= this._objects.length);
        };

        WalkableList.prototype.reset = function (condition) {
            this._index = 0;
            while (this.hasNext() && !condition(this._objects[this._index])) {
                this.moveNext();
            }
        };

        WalkableList.prototype.add = function (object) {
            return this._repository.create(object);
        };

        WalkableList.prototype.removeCurrent = function () {
            this._repository.remove(this._objects[this._index].id);
        };

        WalkableList.prototype.update = function (object) {
            this._repository.update(object);
        };

        WalkableList.prototype.remove = function (id) {
            return this._repository.remove(id);
        };
        return WalkableList;
    })();
    VjsPluginComponents.WalkableList = WalkableList;
})(VjsPluginComponents || (VjsPluginComponents = {}));
//# sourceMappingURL=file:////home/travis/build/Axonn/videojs-plugin-components/build/js/vjsplugincomponents.js.map
