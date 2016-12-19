;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Utils = factory();
  }
}(this, function() {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * ------------------------------------------------------------------------
 * Polyfills
 * ------------------------------------------------------------------------
 */

//http://stackoverflow.com/questions/8830839/javascript-dom-remove-element
(function () {
    var typesToPatch = ['DocumentType', 'Element', 'CharacterData'],
        remove = function remove() {
        // The check here seems pointless, since we're not adding this
        // method to the prototypes of any any elements that CAN be the
        // root of the DOM. However, it's required by spec (see point 1 of
        // https://dom.spec.whatwg.org/#dom-childnode-remove) and would
        // theoretically make a difference if somebody .apply()ed this
        // method to the DOM's root node, so let's roll with it.
        if (this.parentNode != null) {
            this.parentNode.removeChild(this);
        }
    };

    for (var i = 0; i < typesToPatch.length; i++) {
        var type = typesToPatch[i];
        if (window[type] && !window[type].prototype.remove) {
            window[type].prototype.remove = remove;
        }
    }
})();

/**
 * ------------------------------------------------------------------------
 * Utilities
 * ------------------------------------------------------------------------
 */

var isArray = function () {
    if (typeof Array.isArray === 'undefined') {
        return function (value) {
            return toString.call(value) === '[object Array]';
        };
    }
    return Array.isArray;
}();

var Utils = {

    isArrey: function isArrey(obj) {
        return !!(obj && Array === obj.constructor);
    },

    isElement: function isElement(item) {
        return (item[0] || item).nodeType;
    },

    isObject: function isObject(value) {
        return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
    },

    normalizeElement: function normalizeElement(element) {
        if (this.isElement(element)) {
            return element;
        }
        if (typeof jQuery !== 'undefined') {
            if (element instanceof jQuery) return element[0];
        }
        if (typeof element === 'string') {
            return document.querySelector(element) || document.querySelector('#' + element) || document.querySelector('.' + element);
        }
    },

    setClass: function setClass(el, className) {
        //credit: http://youmightnotneedjquery.com/
        if (el.classList) el.classList.add(className);else el.className += ' ' + className;
    },

    removeClass: function removeClass(el, className) {
        //credit: http://youmightnotneedjquery.com/
        if (el.classList) el.classList.remove(className);else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    },

    fadeOutRemove: function fadeOutRemove(el) {
        el.style.transition = 'ease opacity 0.5s';
        el.style.webkitTransition = 'ease opacity 0.5s';
        el.style.opacity = 0;
        setTimeout(function () {
            el.remove();
        }, 500);
    },

    //extend Object
    extend: function extend() {
        for (var i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) arguments[0][key] = arguments[i][key];
            }
        }return arguments[0];
    },

    foreach: function foreach(arg, func) {
        if (this.isElement(arg)) {
            for (var i = 0; i < arg.length; i++) {
                if (isElement(arg[i])) func.call(window, arg[i], i, arg);
            }
            return false;
        }

        if (!isArray(arg) && !this.isObject(arg)) var arg = [arg];
        if (isArray(arg)) {
            for (var i = 0; i < arg.length; i++) {
                func.call(window, arg[i], i, arg);
            }
        } else if (this.isObject(arg)) {
            for (var key in arg) {
                func.call(window, arg[key], key, arg);
            }
        }
    },

    attemptJson: function attemptJson(str) {
        try {
            return JSON.parse(str);
        } catch (err) {
            return str;
        }
    },

    findAncestor: function findAncestor(el, cls) {
        if (el.classList.contains(cls)) return el;
        while ((el = el.parentElement) && !el.classList.contains(cls)) {}
        return el;
    },

    range: function range(n, offset, fill) {
        var a = [];
        offset = offset || 0;
        while (n) {
            if (fill > -1) {
                a.push(fill);
                --n;
            } else {
                a.push(--n + offset);
            }
        }
        return a.reverse();
    }
};
return Utils;
}));
