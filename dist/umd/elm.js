;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Elm = factory();
  }
}(this, function() {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ------------------------------------------------------------------------
 * Element generator check out the standalone version for docs
 * https://github.com/Andrinoid/ElementGenerator.js
 * ------------------------------------------------------------------------
 */
var Elm = function () {
    //Simple element generator. Mootools style
    //tries to find method for keys in options and run it
    function Elm(type, options, parent, injectType) {
        _classCallCheck(this, Elm);

        function isElement(obj) {
            return (obj[0] || obj).nodeType;
        }

        var args = arguments;
        if (isElement(args[1] || {}) || typeof args[1] === 'string') {
            options = {};
            parent = args[1];
        }

        this.element = null;
        if (type.indexOf('.') > -1) {
            var separated = type.split('.');
            var stype = separated[0];
            var clsName = separated[1];
            this.element = document.createElement(stype);
            this._setClass(this.element, clsName);
        } else {
            this.element = document.createElement(type);
        }
        this.options = options || {};

        for (var key in this.options) {
            if (!this.options.hasOwnProperty(key)) {
                continue;
            }
            var val = this.options[key];

            if (key === 'class') //fix for class name conflict
                key = 'cls';

            try {
                if (this[key]) {
                    this[key](val);
                } else {
                    //no special method found for key
                    this.tryDefault(key, val);
                }
            } catch (err) {
                //pass
            }

            this.injectType = injectType || null; // can be null, top
        }

        if (parent) {
            this.inject(parent);
        }

        return this.element;
    }

    _createClass(Elm, [{
        key: 'tryDefault',
        value: function tryDefault(key, val) {
            /*
            * In many cases the element property key is nice so we only pass it forward
            * e.q this.element.value = value
            */
            if (key.indexOf('data-') > -1) {
                this.attr(key, val);
            }
            this.element[key] = val;
        }
    }, {
        key: '_setClass',
        value: function _setClass(el, className) {
            //Method credit http://youmightnotneedjquery.com/
            if (el.classList) {
                el.classList.add(className);
            } else {
                el.className += ' ' + className;
            }
        }
    }, {
        key: 'cls',
        value: function cls(value) {
            var _this = this;

            //Name can be comma or space separated values e.q 'foo, bar'
            //Even if one class name is given we clean the string and end up with array
            var clsList = value.replace(/[|&;$%@"<>()+,]/g, "").split(' ');

            clsList.forEach(function (name) {
                _this._setClass(_this.element, name);
            });
        }
    }, {
        key: 'html',
        value: function html(str) {
            this.element.innerHTML = str;
        }
    }, {
        key: 'attr',
        value: function attr(key, val) {
            this.element.setAttribute(key, val);
        }
    }, {
        key: 'text',
        value: function text(str) {
            this.element.innerText = str;
        }
    }, {
        key: 'css',
        value: function css(obj) {
            for (var prop in obj) {
                if (!obj.hasOwnProperty(prop)) {
                    continue;
                }
                this.element.style[prop] = obj[prop];
            }
        }
    }, {
        key: 'click',
        value: function click(fn) {
            this.element.addEventListener('click', function (e) {
                fn(e);
            });
        }
    }, {
        key: 'change',
        value: function change(fn) {
            this.element.addEventListener('change', function (e) {
                fn(e);
            });
        }
    }, {
        key: 'inject',
        value: function inject(elm) {
            var refElm = Utils.normalizeElement(elm);
            if (this.injectType === 'top') {
                // append as first child of refElm
                refElm.insertBefore(this.element, refElm.childNodes[0]);
            } else if (this.injectType === 'before') {
                // append before refElm
                parent = refElm.parentNode;
                refElm.parentNode.insertBefore(this.element, refElm);
            } else if (this.injectType === 'after') {
                // append after refElm
                parent = refElm.parentNode;
                refElm.parentNode.insertBefore(this.element, refElm.nextSibling);
            } else {
                // append as last child of refElm
                refElm.appendChild(this.element);
            }
        }
    }]);

    return Elm;
}();
return Elm;
}));
