    /**
     * ------------------------------------------------------------------------
     * Utilities
     * ------------------------------------------------------------------------
     */

    export var normalizeElement = function (element) {
        function isElement(obj) {
            return (obj[0] || obj).nodeType
        }

        if (isElement(element)) {
            return element;
        }
        if (typeof jQuery !== 'undefined') {
            if (element instanceof jQuery)
                return element[0];
        }
        if (typeof(element) === 'string') {
            return document.querySelector(element) || document.querySelector('#' + element) || document.querySelector('.' + element);
        }
    };

    export var setClass = function (el, className) {
        //credit: http://youmightnotneedjquery.com/
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    };

    export var removeClass = function (el, className) {
        //credit: http://youmightnotneedjquery.com/
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    };


    export var fadeOutRemove = function (el) {
        el.style.transition = 'ease opacity 0.5s';
        el.style.webkitTransition = 'ease opacity 0.5s';
        el.style.opacity = 0;
        setTimeout(() => {
            el.remove();
        }, 500);
    };

    //extend Object
    export var extend = function () {
        for (var i = 1; i < arguments.length; i++)
            for (var key in arguments[i])
                if (arguments[i].hasOwnProperty(key))
                    arguments[0][key] = arguments[i][key];
        return arguments[0];
    };
