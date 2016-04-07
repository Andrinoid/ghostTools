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
    constructor(type, options, parent) {
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
            try {
                if (key === 'class')//fix for class name conflict
                    key = 'cls';
                this[key](val);
            }
            catch (err) {
                //pass
            }
        }

        if (parent) {
            this.inject(parent);
        }

        return this.element;
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

    id(value) {
        this.element.id = value;
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
        parent.appendChild(this.element);
    }

}

export default Elm;