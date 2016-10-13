import Elm from './elm'
import Utils from './utils';
/**
 * ------------------------------------------------------------------------
 * Simple Backdrop
 * ------------------------------------------------------------------------
 */
const Backdrop = (() => {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const STYLES = `
    .ghost-backdrop {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1040;
        background-color: #000;
        opacity: 0;
        transition: ease all 0.5s;
    }
     `;

     const Default = {
         removeDelay: 0
     };

    class Backdrop {
        constructor(options) {
            this.defaults = Utils.extend(Default, options);
            this.injectStyles()
            this.createDOM();
        }
        // getters
        get STYLES() {
            return STYLES
        }

        injectStyles() {
            //if styles exists do nothing
            if (document.getElementById('backdropStyles')) return;
            var tag = document.createElement('style');
            tag.type = 'text/css';
            tag.id = 'backdropStyles';
            if (tag.styleSheet) {
                tag.styleSheet.cssText = STYLES;
            } else {
                tag.appendChild(document.createTextNode(STYLES));
            }
            document.getElementsByTagName('head')[0].appendChild(tag);
        }

        createDOM() {
            let elm = new Elm('div.ghost-backdrop', document.body);
            setTimeout(function() {
                elm.style.opacity = 0.5;
            });
        }

        remove() {
            setTimeout(()=> {
                var backdrops = document.querySelectorAll('.ghost-backdrop');
                for (var i = 0; i < backdrops.length; i++) {
                    console.log('i', i);
                    let elm = backdrops[i];
                    elm.style.opacity = 0;
                    setTimeout(()=> {
                        console.log(elm);
                        elm.parentNode.removeChild(elm);
                    }, 500);
                }
            }, this.defaults.removeDelay);

        }
    }
    return Backdrop;
})();

export default Backdrop;
