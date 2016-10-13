;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Backdrop = factory();
  }
}(this, function() {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ------------------------------------------------------------------------
 * Simple Backdrop
 * ------------------------------------------------------------------------
 */
var Backdrop = function () {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var STYLES = '\n    .ghost-backdrop {\n        position: fixed;\n        top: 0;\n        right: 0;\n        bottom: 0;\n        left: 0;\n        z-index: 1040;\n        background-color: #000;\n        opacity: 0;\n        transition: ease all 0.5s;\n    }\n     ';

    var Default = {
        removeDelay: 0
    };

    var Backdrop = function () {
        function Backdrop(options) {
            _classCallCheck(this, Backdrop);

            this.defaults = Utils.extend(Default, options);
            this.injectStyles();
            this.createDOM();
        }
        // getters


        _createClass(Backdrop, [{
            key: 'injectStyles',
            value: function injectStyles() {
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
        }, {
            key: 'createDOM',
            value: function createDOM() {
                var elm = new Elm('div.ghost-backdrop', document.body);
                setTimeout(function () {
                    elm.style.opacity = 0.5;
                });
            }
        }, {
            key: 'remove',
            value: function remove() {
                setTimeout(function () {
                    var backdrops = document.querySelectorAll('.ghost-backdrop');
                    for (var i = 0; i < backdrops.length; i++) {
                        console.log('i', i);
                        backdrops[i].style.opacity = 0;
                        setTimeout(function () {
                            console.log(backdrops);
                            backdrops[i].parentNode.removeChild(backdrops[i]);
                        }, 500);
                    }
                }, this.defaults.removeDelay);
            }
        }, {
            key: 'STYLES',
            get: function get() {
                return STYLES;
            }
        }]);

        return Backdrop;
    }();

    return Backdrop;
}();
return Backdrop;
}));
