import Utils from './utils';

/**
 * ------------------------------------------------------------------------
 * Element generator check out the standalone version for docs
 * https://github.com/Andrinoid/ElementGenerator.js
 * ------------------------------------------------------------------------
 */
class Elm {
    //Simple element generator. Mootools style
    //tries to find method for keys in options and run it
    constructor(type, options, parent, injectType) {
        function isElement(obj) {
            return (obj[0] || obj).nodeType
        }

        let args = arguments;
        if (isElement(args[1] || {}) || typeof(args[1]) === 'string') {
            options = {};
            parent = args[1];
        }

        this.element = null;
        if (type.indexOf('.') > -1) {
            let separated = type.split('.');
            let stype = separated[0];
            let clsName = separated[1];
            this.element = document.createElement(stype);
            this._setClass(this.element, clsName);
        }
        else {
            this.element = document.createElement(type);
        }
        this.options = options || {};

        for (let key in this.options) {
            if (!this.options.hasOwnProperty(key)) {
                continue;
            }
            let val = this.options[key];

            if (key === 'class')//fix for class name conflict
                key = 'cls';

            try {
                if(this[key]) {
                    this[key](val);
                } else {
                    //no special method found for key
                    this.tryDefault(key, val);
                }

            }
            catch (err) {
                //pass
            }

            this.injectType = injectType || null; // can be null, top
        }

        if (parent) {
            this.inject(parent);
        }

        return this.element;
    }

    tryDefault(key, val) {
        /*
        * In many cases the element property key is nice so we only pass it forward
        * e.q this.element.value = value
        */
        this.element[key] = val;
    }

    _setClass(el, className) {
        //Method credit http://youmightnotneedjquery.com/
        if (el.classList) {
            el.classList.add(className);
        }
        else {
            el.className += ' ' + className;
        }
    }

    cls(value) {
        //Name can be comma or space separated values e.q 'foo, bar'
        //Even if one class name is given we clean the string and end up with array
        let clsList = value.replace(/[|&;$%@"<>()+,]/g, "").split(' ');

        clsList.forEach(name=> {
            this._setClass(this.element, name);
        });
    }

    html(str) {
        this.element.innerHTML = str;
    }

    text(str) {
        this.element.innerText = str;
    }

    css(obj) {
        for (let prop in obj) {
            if (!obj.hasOwnProperty(prop)) {
                continue;
            }
            this.element.style[prop] = obj[prop];
        }
    }

    click(fn) {
        this.element.addEventListener('click', function () {
            fn();
        });
    }

    inject(to) {
        let parent = Utils.normalizeElement(to);
        if(this.injectType === 'top') {
            parent.insertBefore(this.element, parent.childNodes[0]);
        } else {
            parent.appendChild(this.element);
        }
    }

}

export default Elm;