///<reference path='../definitions/VideoJS.d.ts'/>
///<reference path='../definitions/JQuery.d.ts'/> 
///<reference path='IPlayer.ts'/>
///<reference path='Component.ts'/>

module VjsPluginComponents {
    export class Button extends Component {
        buttonText: string;

        constructor(player: VjsPluginComponents.IPlayer) {
            super(player);

            this.on('click', () => { this.onClick() });
            this.on('focus', () => { this.onFocus() });
            this.on('blur', () => { this.onBlur() });
            this._component = new _V_.Component(player.toOriginal(), { el: this.createEl() });
        }

        /**
         * Create the component's DOM element.
         * @param  {String=} tagName  Element's node type. e.g. 'div'
         * @param  {Object=} attributes An object of element attributes that should be set on the element.
         * @return {Element}
         */
        createEl(tagName?, properties?): HTMLElement {

            //Add standard Aria and Tabindex info
            //var properties = {
            //    className: this.buildCSSClass(),
            //    innerHTML: '<div><span class="vjs-quality-text">' + this.buttonText + '</span></div>',
            //    role: "button",
            //    'aria-live': 'polite',
            //    tabIndex: 0,
            //};

            //var tagName = "div";

            //props.className = "lololo";

            return super.createEl(tagName, properties); //super.createEl(type, props);
        }

        onClick(): void {
        }

        onFocus(): void {
        }

        onBlur(): void {
        }
    }
}