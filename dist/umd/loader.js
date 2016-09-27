;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Loader = factory();
  }
}(this, function() {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ------------------------------------------------------------------------
 * Loading creates a full sheet overlay with hypnotic balls
 * ------------------------------------------------------------------------
 */
var Loader = function () {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var STYLES = '\n         .simpleLoader {\n             position: fixed;\n             top: 0;\n             left: 0;\n             right: 0;\n             bottom: 0;\n             background: rgba(0, 0, 0, 0.36);\n             z-index: 9999;\n         }\n         .simpleLoader .sl-container {\n             position: absolute;\n             top: 50%;\n             left: 50%;\n             -webkit-transform: translate(-50%, -50%);\n             transform: translate(-50%, -50%);\n         }\n         .simpleLoader .sl-dot {\n             width: 20px;\n             height: 20px;\n             border: 2px solid white;\n             border-radius: 50%;\n             float: left;\n             margin: 0 5px;\n             -webkit-transform: scale(0);\n             transform: scale(0);\n             -webkit-animation: fx 1000ms ease infinite 0ms;\n             animation: fx 1000ms ease infinite 0ms;\n         }\n         .simpleLoader .sl-dot:nth-child(2) {\n             -webkit-animation: fx 1000ms ease infinite 300ms;\n             animation: fx 1000ms ease infinite 300ms;\n         }\n         .simpleLoader .sl-dot:nth-child(3) {\n             -webkit-animation: fx 1000ms ease infinite 600ms;\n             animation: fx 1000ms ease infinite 600ms;\n         }\n         @-webkit-keyframes fx {\n             50% {\n                 -webkit-transform: scale(1);\n                 transform: scale(1);\n                 opacity: 1;\n             }\n             100% {\n                 opacity: 0;\n             }\n         }\n         @keyframes fx {\n             50% {\n                 -webkit-transform: scale(1);\n                 transform: scale(1);\n                 opacity: 1;\n             }\n             100% {\n                 opacity: 0;\n             }\n         }\n     ';

    var Default = {
        removeDelay: 0
    };

    var Template = '\n         <div class="sl-container">\n             <div class="sl-dot"></div>\n             <div class="sl-dot"></div>\n             <div class="sl-dot"></div>\n         </div>\n     ';

    var Loader = function () {
        function Loader(options) {
            _classCallCheck(this, Loader);

            this.defaults = Utils.extend(Default, options);
            console.log(this.defaults);
            this.injectStyles();
            this.createDOM();
        }
        // getters

        _createClass(Loader, [{
            key: 'injectStyles',
            value: function injectStyles() {
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
        }, {
            key: 'createDOM',
            value: function createDOM() {
                var wrapper = document.createElement('div');
                wrapper.className = 'simpleLoader';
                wrapper.innerHTML = Template;
                document.body.appendChild(wrapper);
            }
        }, {
            key: 'remove',
            value: function remove() {
                setTimeout(function () {
                    var loaders = document.querySelectorAll('.simpleLoader');
                    for (var i = 0; i < loaders.length; i++) {
                        loaders[i].parentNode.removeChild(loaders[i]);
                    }
                }, this.defaults.removeDelay);
            }
        }, {
            key: 'STYLES',
            get: function get() {
                return STYLES;
            }
        }, {
            key: 'Template',
            get: function get() {
                return Template;
            }
        }], [{
            key: 'Default',
            get: function get() {
                return Default;
            }
        }]);

        return Loader;
    }();

    return Loader;
}();
return Loader;
}));
