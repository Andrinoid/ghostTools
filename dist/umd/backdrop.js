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
        removeDelay: 0,
        'zIndex': 2001,
        allowMany: false,
        closeOnClick: true };

    var Backdrop = function () {
        function Backdrop(options) {
            _classCallCheck(this, Backdrop);

            this.defaults = Utils.extend(Default, options);
            if (this.__proto__.instances.length && !this.defaults.allowMany) {
                return;
            }
            this.__proto__.instances.push(this);

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
                // remove on click or not
                var ev = this.defaults.closeOnClick ? { click: this.__proto__.removeAll.bind(this) } : {};
                var elm = new Elm('div.ghost-backdrop', ev, document.body);
                elm.style.zIndex = this.defaults.zIndex;

                setTimeout(function () {
                    elm.style.opacity = 0.5;
                });
            }
        }, {
            key: 'remove',
            value: function remove() {
                setTimeout(function () {
                    var backdrops = document.querySelectorAll('.ghost-backdrop');

                    var _loop = function _loop() {
                        console.log('i', i);
                        var elm = backdrops[i];
                        elm.style.opacity = 0;
                        setTimeout(function () {
                            console.log(elm);
                            elm.parentNode.removeChild(elm);
                        }, 500);
                    };

                    for (var i = 0; i < backdrops.length; i++) {
                        _loop();
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

    Backdrop.prototype.instances = [];
    Backdrop.prototype.removeAll = function () {
        this.instances.forEach(function (item) {
            item.remove();
        });
        this.instances.length = 0;
    };
    return Backdrop;
}();
return Backdrop;
}));
