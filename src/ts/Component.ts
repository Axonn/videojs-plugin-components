///<reference path='../definitions/VideoJS.d.ts'/>
///<reference path='../definitions/JQuery.d.ts'/> 
///<reference path='IPlayer.ts'/>

module VjsPluginComponents {
    export class Component {
        _component: _V_.IComponent;
        _player: VjsPluginComponents.IPlayer;

        constructor(player: VjsPluginComponents.IPlayer) {
            this._player = player;
            this._component = new _V_.Component(player.toOriginal(), { el: this.createEl() });
        }

        dispose(): void {
            this._component.dispose();
        }

        /**
         * Create the component's DOM element.
         * @param  {String=} tagName  Element's node type. e.g. 'div'
         * @param  {Object=} attributes An object of element attributes that should be set on the element.
         * @return {Element}
         */
        createEl(tagName?, properties?): HTMLElement {
            return this.elCreator(tagName, properties);
        }

        elCreator(tagName, properties): HTMLElement {
            var el = document.createElement(tagName || 'div');

            for (var propName in properties) {
                if (properties.hasOwnProperty(propName)) {
                    //el[propName] = properties[propName];
                    // Not remembering why we were checking for dash
                    // but using setAttribute means you have to use getAttribute

                    // The check for dash checks for the aria-* attributes, like aria-label, aria-valuemin.
                    // The additional check for "role" is because the default method for adding attributes does not
                    // add the attribute "role". My guess is because it's not a valid attribute in some namespaces, although
                    // browsers handle the attribute just fine. The W3C allows for aria-* attributes to be used in pre-HTML5 docs.
                    // http://www.w3.org/TR/wai-aria-primer/#ariahtml. Using setAttribute gets around this problem.

                    if (propName.indexOf('aria-') !== -1 || propName == 'role') {
                        el.setAttribute(propName, properties[propName]);
                    } else {
                        el[propName] = properties[propName];
                    }
                }
            }
            return el;
        }


        el() {
            return this._component.el();
        }

        addChild(child, options?) {
            if (options === undefined) {
                this._component.addChild(child);
            } else {
                this._component.addChild(child, options);
            }
        }

        children() {
            return this._component.children();
        }

        on(type: string, fn: () => void ) {
            this._component.on(type, fn);
        }

        off(type: string, fn: () => void ) {
            this._component.off(type, fn);
        }

        one(type: string, fn: () => void ) {
            this._component.one(type, fn);
        }

        trigger(type: string, event?: any) {
            this._component.trigger(type, event);
        }

        show(): void {
            this._component.show();
        }

        hide(): void {
            this._component.hide();
        }

        width(): number {
            return this._component.width();
        }

        height(): number {
            return this._component.height();
        }

        dimensions(width: number, height: number) {
            this._component.dimensions(width, height);
        }

        addClass (className:string) {
            jQuery(this.el()).addClass(className);
        }

        removeClass(className: string) {
            jQuery(this.el()).removeClass(className);
        }

        unlockShowing() {
            this._component.unlockShowing();
        }

        lockShowing() {
            this._component.lockShowing();
        }
    }
}