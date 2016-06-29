/**
 * ------------------------------------------------------------------------
 * Utilities
 * ------------------------------------------------------------------------
 */


var isArray = (function () {
    if (typeof Array.isArray === 'undefined') {
        return function (value) {
            return toString.call(value) === '[object Array]';
        };
    }
    return Array.isArray;
})();

const Utils = {

    isArrey: function(obj) {
        return !!(obj && Array === obj.constructor);
    },

    isElement: function (item) {
        return (item[0] || item).nodeType
    },

    isObject: function (value) {
        return value != null && typeof value === 'object';
    },

    normalizeElement: function (element) {
        if (this.isElement(element)) {
            return element;
        }
        if (typeof jQuery !== 'undefined') {
            if (element instanceof jQuery)
                return element[0];
        }
        if (typeof(element) === 'string') {
            return document.querySelector(element) || document.querySelector('#' + element) || document.querySelector('.' + element);
        }
    },

    setClass: function (el, className) {
        //credit: http://youmightnotneedjquery.com/
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    },

    removeClass: function (el, className) {
        //credit: http://youmightnotneedjquery.com/
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    },


    fadeOutRemove: function (el) {
        el.style.transition = 'ease opacity 0.5s';
        el.style.webkitTransition = 'ease opacity 0.5s';
        el.style.opacity = 0;
        setTimeout(() => {
            el.remove();
        }, 500);
    },

//extend Object
    extend: function () {
        for (var i = 1; i < arguments.length; i++)
            for (var key in arguments[i])
                if (arguments[i].hasOwnProperty(key))
                    arguments[0][key] = arguments[i][key];
        return arguments[0];
    },

    foreach: function (arg, func) {
        if (this.isElement(arg)) {
            for (var i = 0; i < arg.length; i++) {
                if (isElement(arg[i]))
                    func.call(window, arg[i], i, arg);
            }
            return false;
        }

        if (!isArray(arg) && !this.isObject(arg))
            var arg = [arg];
        if (isArray(arg)) {
            for (var i = 0; i < arg.length; i++) {
                func.call(window, arg[i], i, arg);
            }
        } else if (this.isObject(arg)) {
            for (var key in arg) {
                func.call(window, arg[key], key, arg);
            }
        }
    }

};


export default utils
