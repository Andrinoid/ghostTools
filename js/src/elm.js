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
        if(key.indexOf('data-') > -1) {
            this.attr(key, val);
        }
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

    attr(key, val) {
        this.element.setAttribute(key, val);
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
        this.element.addEventListener('click', function (e) {
            fn(e);
        });
    }

    change(fn) {
        this.element.addEventListener('change', function (e) {
            fn(e);
        });
    }

    inject(elm) {
        let refElm = Utils.normalizeElement(elm);
        if(this.injectType === 'top') { // append as first child of refElm
            refElm.insertBefore(this.element, refElm.childNodes[0]);
        } else if(this.injectType === 'before')  { // append before refElm
            parent = refElm.parentNode;
            refElm.parentNode.insertBefore(this.element, refElm);
        } else if(this.injectType === 'after') { // append after refElm
            parent = refElm.parentNode;
            refElm.parentNode.insertBefore(this.element, refElm.nextSibling);
        }
        else { // append as last child of refElm
            refElm.appendChild(this.element);
        }
    }

}

export default Elm;
