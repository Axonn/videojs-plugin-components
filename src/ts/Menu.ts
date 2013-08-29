///<reference path='../definitions/VideoJS.d.ts'/>
///<reference path='../definitions/JQuery.d.ts'/> 
///<reference path='IPlayer.ts'/>
///<reference path='Component.ts'/>
///<reference path='MenuItem.ts'/>

module VjsPluginComponents {
    export class Menu extends Component {
        buttonText: string;
        items: VjsPluginComponents.MenuItem[] = [];

        constructor(player: VjsPluginComponents.IPlayer) {
            super(player);
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
                className: 'vjs-menu',
            }, properties);

            return super.createEl("ul", properties); //super.createEl(type, props);
        }

        addItem(item: VjsPluginComponents.MenuItem) {
            this.items.push(item);
            this.addChild(item);
            item.on('click', () => {
                this.unlockShowing();
            });
        }
    }
}