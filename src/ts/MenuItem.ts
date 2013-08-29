///<reference path='../definitions/VideoJS.d.ts'/>
///<reference path='../definitions/JQuery.d.ts'/> 
///<reference path='IPlayer.ts'/>
///<reference path='Button.ts'/>

module VjsPluginComponents {
    export class MenuItem extends Button {
        buttonText: string;

        constructor(player: VjsPluginComponents.IPlayer) {
            super(player);

            this.on('click', () => { this.onClick() });
            this.on('focus', () => { this.onFocus() });
            this.on('blur', () => { this.onBlur() });
        }

        /**
         * Create the component's DOM element.
         * @param  {String=} tagName  Element's node type. e.g. 'div'
         * @param  {Object=} attributes An object of element attributes that should be set on the element.
         * @return {Element}
         */
        createEl(tagName?, properties?): HTMLElement {

            //Add standard Aria and Tabindex info
            properties = jQuery.extend({
                role: "button",
                'aria-live': 'polite',
                tabIndex: 0,
            },properties);

            return super.createEl("li", properties); //super.createEl(type, props);
        }

        onClick(): void {
        }

        onFocus(): void {
        }

        onBlur(): void {
        }
    }
}