import Utils from './utils';
/**
 * ------------------------------------------------------------------------
 * Loading creates a full sheet overlay with hypnotic balls
 * ------------------------------------------------------------------------
 */
const Loader = (() => {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const STYLES = `
         .simpleLoader {
             position: fixed;
             top: 0;
             left: 0;
             right: 0;
             bottom: 0;
             background: rgba(0, 0, 0, 0.36);
             z-index: 9999;
         }
         .simpleLoader .sl-container {
             position: absolute;
             top: 50%;
             left: 50%;
             -webkit-transform: translate(-50%, -50%);
             transform: translate(-50%, -50%);
         }
         .simpleLoader .sl-dot {
             width: 20px;
             height: 20px;
             border: 2px solid white;
             border-radius: 50%;
             float: left;
             margin: 0 5px;
             -webkit-transform: scale(0);
             transform: scale(0);
             -webkit-animation: fx 1000ms ease infinite 0ms;
             animation: fx 1000ms ease infinite 0ms;
         }
         .simpleLoader .sl-dot:nth-child(2) {
             -webkit-animation: fx 1000ms ease infinite 300ms;
             animation: fx 1000ms ease infinite 300ms;
         }
         .simpleLoader .sl-dot:nth-child(3) {
             -webkit-animation: fx 1000ms ease infinite 600ms;
             animation: fx 1000ms ease infinite 600ms;
         }
         @-webkit-keyframes fx {
             50% {
                 -webkit-transform: scale(1);
                 transform: scale(1);
                 opacity: 1;
             }
             100% {
                 opacity: 0;
             }
         }
         @keyframes fx {
             50% {
                 -webkit-transform: scale(1);
                 transform: scale(1);
                 opacity: 1;
             }
             100% {
                 opacity: 0;
             }
         }
     `;

    const Default = {
        removeDelay: 0
    };

    const Template = `
         <div class="sl-container">
             <div class="sl-dot"></div>
             <div class="sl-dot"></div>
             <div class="sl-dot"></div>
         </div>
     `;

    class Loader {
        constructor(options) {
            this.defaults = Utils.extend(Default, options);
            this.injectStyles();
            this.createDOM();
        }
            // getters

        static get Default() {
            return Default
        }

        get STYLES() {
            return STYLES
        }

        get Template() {
            return Template;
        }

        injectStyles() {
            //if styles exists do nothing
            if (document.getElementById('loaderStyles')) return;
            var tag = document.createElement('style');
            tag.type = 'text/css';
            tag.id = 'loaderStyles';
            if (tag.styleSheet) {
                tag.styleSheet.cssText = STYLES;
            } else {
                tag.appendChild(document.createTextNode(STYLES));
            }
            document.getElementsByTagName('head')[0].appendChild(tag);
        }

        createDOM() {
            let wrapper = document.createElement('div');
            wrapper.className = 'simpleLoader';
            wrapper.innerHTML = Template;
            document.body.appendChild(wrapper);
        }

        remove() {
            setTimeout(()=> {
                var loaders = document.querySelectorAll('.simpleLoader');
                for (var i = 0; i < loaders.length; i++) {
                    loaders[i].parentNode.removeChild(loaders[i]);
                }
            }, this.defaults.removeDelay);

        }
    }
    return Loader;
})();

export default Loader;
