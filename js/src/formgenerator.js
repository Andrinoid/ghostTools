import Utils from './utils';
import Droppad from './droppad';
import Elm from './elm';


/**
 * ------------------------------------------------------------------------
 * Form generator
 * Generates form from json schema
 * ------------------------------------------------------------------------
 */


//Demo form
//    var form = [
//        {
//            type: 'text',
//            label: 'Name',
//            value: '',
//            placeholder: 'testholder'
//        }, {
//            type: 'text',
//            label: 'Email',
//            value: 'halló',
//            placeholder: 'testholder'
//        },
//        {
//            type: 'select',
//            label: 'select menu',
//            childnodes: [
//                {
//                    type: 'option',
//                    label: 'Foo',
//                    value: '9'
//                },
//                {
//                    type: 'option',
//                    label: 'Foo2',
//                    value: '10'
//                }
//            ]
//        },
//        {
//            type: 'checkbox',
//            label: 'my checkbox',
//            value: ''
//        },
//        {
//            type: 'number',
//            label: 'number field',
//            value: '',
//            placeholder: 'any number is fine'
//        },
//        {
//            type: 'text',
//            label: 'Email',
//            value: 'halló',
//            placeholder: 'testholder'
//        }, {
//            type: 'submit',
//            value: 'Lets Go'
//        }
//        "images": [
//                {
//                    "type": "image",
//                    "label": "campaign image",
//                    "width": "auto",
//                    "height": "auto",
//                    "quality": 80,
//                    "value": ""
//                }
//            ],
//        ];
let typeModels = {
    text: {
        element: 'input',
        type: 'text',
        cls: 'form-control',
        value: '',
        placeholder: '',
        helpText: '',
        validation: []
    },
    hidden: {
        element: 'input',
        type: 'hidden',
        value: '',
        validation: []
    },
    number: {
        element: 'input',
        type: 'number',
        cls: 'form-control',
        value: '',
        placeholder: '',
        validation: []
    },
    color: {
        element: 'input',
        type: 'color',
        cls: 'form-control',
        value: '',
        placeholder: '',
        validation: []
    },
    date: {
        element: 'input',
        type: 'date',
        cls: 'form-control',
        value: '',
        placeholer: '',
        validation: []
    },
    textarea: {
        element: 'textarea',
        cls: 'form-control',
        rows: 5,
        validation: []
    },
    submit: {
        element: 'input',
        type: 'submit',
        cls: 'btn btn-info',
        validation: []
    },
    select: {
        element: 'select',
        label: '',
        cls: 'form-control',
        childnodes: [],
        validation: []
    },
    option: {
        element: 'option',
        label: '',
        value: '',
    },
    checkbox: {
        element: 'input',
        type: 'checkbox',
        label: '',
        value: '',
    },
    image: {
        element: 'div',
        label: 'imagefield',
        description: '',
        value: '',
        backgroundUrlPrefix: '',
        url: 'http://kotturinn.com/icloud/upload/test',
        backgroundImage: '',
        maxFilesize: 8, //in MB
        acceptedFiles: 'jpeg, jpg, png, gif',
    },
    element: {

    }
};

//TODO list
/**
 * add validation for types
 * remove instance
 *
 */
class FormGenerator {

    constructor(form, parent) {
        this.form = form;
        //remove private keys from output object

        this.firstLoop = true;
        this.currentKey = null;
        this.parent = parent || document.body;
        this.typeModels = typeModels;
        this.arrayIndex = null;
        this.buildAllItems(this.form, this.parent);

        this.validators = {
            email: (email)=> {
                const emailReg = new RegExp('[a-zA-Z0-9]+(?:(\\.|_)[A-Za-z0-9!#$%&\'*+\\/=?^`{|}~-]+)*@(?!([a-zA-Z0-9]*\\.[a-zA-Z0-9]*\\.[a-zA-Z0-9]*\\.))(?:[A-Za-z0-9](?:[a-zA-Z0-9-]*[A-Za-z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?');
                return emailReg.test(email);
            },
            //TODO add validatiors
        }
    }
    /**
     * Events to overide
     */
    onChange(e) {}

    /**
     * Climbs the dom tree and gathers the keychain for given element
     * returns keychain
     */
    getKeychain(el, raw = false) {
        //var keyList = ['value']; //list is reversed so this is the end key // reference for adding value to the end
        var keyList = []; //list is reversed so this is the end key
        while (el.parentNode && el.parentNode != document.body) {
            if ((' ' + el.className + ' ').indexOf(' ' + 'keypoint' + ' ') > -1) {
                keyList.push(el.getAttribute('data-key'));
            }
            el = el.parentNode;
        }
        //keyList.push('form');

        return raw ? keyList.reverse() : keyList.reverse().join('.');

    }

    getAllKeychains(prefix = null, suffix = null) {
        prefix = prefix ? prefix += '.' : '';
        suffix = suffix ? '.' + suffix : '';
        let formElms = this.parent.querySelectorAll('[data-key]');
        let keychains = [];
        _.forEach(formElms, (item) => {
            let root = this.getKeychain(item);
            let keychain = `${prefix}${root}${suffix}`;
            keychains.push(keychain);
        });
        return keychains;
    }

    /**
     * Returns javascript valid keychain from the generated dot seperated
     * e.g foo.bar.4.bas -> foo.bar[4].baz
     */
    jsKeychain(str) {
        try {
            return str.replace(new RegExp('\.[0-9]+'), '[' + str.match('\.[0-9]+')[0].slice(1) + ']');
        } catch (err) {
            return str;
        }
    }

    /**
     * if we are inside a loop prepend the index to the key
     * e.g if arrayIndex is 2 and key is foo we return 2
     */
    getCycleKey(key, reverse = false) {
        if (this.arrayIndex || this.arrayIndex === 0) {
            if (reverse) {
                return key ? key + '.' + this.arrayIndex : this.arrayIndex;
            }
            return key ? this.arrayIndex + '.' + key : this.arrayIndex;
        }
        return key;
    }

    /**
     * Populate list n times with default object
     */
    pushArrayObject(keychain, list) {
        var self = this;
        let schemaList = eval('self.form.' + keychain);
        let item = schemaList[0];
        let isSubform = !item.hasOwnProperty('type');
        schemaList.pop();
        _.forEach(list, (val) => {
            let clone = _.clone(item);
            clone.value = val;
            schemaList.push(clone);
        });
    }

    /**
     * Returns the model for given form item
     */
    getModel(item) {
        let model = this.typeModels[item.type];
        let clone = _.clone(model);
        return Utils.extend(clone, item);
    }

    getElementModel(elm) {

    }

    /**
     * Returns wrapper element for the given form item
     * Default is for most cases. Exceptions must be dealt with
     */
    defaultWrapper(model, parent, key) {
        key = this.getCycleKey(key);
        let wrapper = new Elm('div.form-group', {
            'data-key': key,
            cls: 'keypoint'
        }, parent);
        let label = model.label && new Elm('label', {
            text: model.label,
            cls: 'control-label'
        }, wrapper);
        let description = model.description && new Elm('p', {
            html: model.description
        }, wrapper);
        let inputContainer = new Elm('div', wrapper);
        let helptext = model.helpText && new Elm('span.help-block', {
            text: model.helpText
        }, wrapper);
        return inputContainer;
    }

    /**
     * Returns wrapper element for checkbox
     */
    checkboxWrapper(model, parent, key) {
        key = this.getCycleKey(key);
        let wrapper = new Elm('div.checkbox', {
            'data-key': key,
            cls: 'keypoint'
        }, parent);
        let label = new Elm('label', wrapper);
        model['checked'] = model.value; // We only use checkbox as bool so if value is true its checked
        new Elm('span', {
            text: model.label
        }, label);
        let helptext = model.helpText && new Elm('span.help-block', {
            text: model.helpText
        }, wrapper);
        return label;
    }

    /**
     * Returns wrapper element for subform or simply an bootstrap panel
     */
    subFormWrapper(parent, toggle = false) {
        let key = this.getCycleKey(this.currentKey);
        let label;
        if (key) label = new Elm('h4', {
            html: key,
            style: 'text-transform: capitalize'
        }, parent);
        let cls = this.firstLoop ? '' : 'panel panel-default keypoint';
        let panel = new Elm('div', {
            cls: cls,
            'data-key': key
        }, parent);
        let body = new Elm('div.panel-body', panel);
        if (toggle) {

            let plus = new Elm('span', {
                cls: 'glyphicon glyphicon-plus',
                css: {
                    'margin-left': '10px',
                    'cursor': 'pointer',
                    'font-size': '16px'
                }
            }, label);
            label.addEventListener('click', (e) => {
                panel.style.display = 'block';
                Utils.fadeOutRemove(plus);
            });
            panel.style.display = 'none';
        }

        return body;
    }

    /**
     * Returns wrapper element for array with plus button
     */
    subFormWrapperPlus(parent) {
        var self = this;
        let key = this.getCycleKey(this.currentKey);
        //new Elm('h4', {html: key, style: 'text-transform: capitalize'}, parent);
        let panel = new Elm('div', {
            cls: 'panel panel-default keypoint',
            'data-key': key
        }, parent);
        let body = new Elm('div.panel-body', panel);

        let keychain = this.getKeychain(panel, true);
        keychain = keychain.join('.');

        this.addItemElm(panel, body, keychain);
        return body;
    }


    removeItemElm(parent, keychain) {
        var self = this;
        let remove = new Elm('div.delSubForm', {
            cls: 'pull-right',
            html: '<i class="glyphicon glyphicon-remove"></i>',
            css: {
                color: 'gray',
                cursor: 'pointer'
            },
            'data-key': keychain,
            click: (e) => {
                let list = eval('self.form.' + this.jsKeychain(keychain));
                let index = this.arrayIndex || 0;
                let removed = list.splice(index, 1);
                // removes only one item if removed is triggered in a row this.arrayIndex is fixed here
                Utils.fadeOutRemove(parent);
            }
        }, parent);
    }

    addItemElm(parent, body, keychain) {
        var self = this;
        let plus = new Elm('div', {
            cls: 'btn btn-default',
            html: '<i class="glyphicon glyphicon-plus"></i> Add',
            style: 'margin:0 15px 15px',
            click: () => {
                let elmWrapper = new Elm('div', body);
                let list = eval('self.form.' + keychain);
                let clone = list[0];
                clone.value = '';
                list.push(clone);
                this.arrayIndex = list.length - 1;
                let isSubform = !clone.hasOwnProperty('type');
                if (isSubform) {
                    this.buildSubForm(clone, body);
                } else {
                    this.removeItemElm(elmWrapper, keychain);
                    this.buildOneItem(clone, elmWrapper);
                }
            }
        }, parent);
    }


    buildSubForm(subitem, parent) {
        let wrapper = new Elm('div.subform', parent);
        let keychain = this.getKeychain(wrapper, true);
        //keychain.pop();
        keychain = keychain.join('.');

        // No remove button on first item in array
        if (this.arrayIndex) {
            this.removeItemElm(wrapper, keychain);
        }
        this.buildAllItems(subitem, wrapper);
    }

    buildOneItem(item, parent, key) {
        let self = this;
        /**
         * If item is array we need special wrapper
         */
        if (Utils.isArrey(item)) {
            //new Elm('hr', parent);
            new Elm('h4', {
                html: key,
                style: 'text-transform: capitalize'
            }, parent);
            parent = this.subFormWrapperPlus(parent, key);
            Utils.foreach(item, (subitem, i) => {
                this.arrayIndex = i;
                let isSubform = !subitem.hasOwnProperty('type');
                if (isSubform) {
                    this.buildSubForm(subitem, parent, key);

                } else {
                    this.buildOneItem(subitem, parent);
                }
                //new Elm('hr', parent);
            });
            this.arrayIndex = null;
            return;
        }

        /**
         * If item don't have type key it is treated as subform
         * this has a potential failure if the actual field name is type
         */

        let isSubform = !item.hasOwnProperty('type');
        if (isSubform) {
            //parent = this.subFormWrapper(parent, key);

            //new Elm('hr', parent);
            this.buildAllItems(item, parent);
            return false;
        }


        let model = this.getModel(item);
        console.log(model.type);
        let wrapper = null;
        let element = null;


        /**
         * Bellow are special model types. They either don't fit the defaultWrapper pattern
         * or need some special treatment e.g image will be converted to image Droppad
         * using our IMAGECLOUD service
         */

        /**
         * Checkboxes don't fit in the defaultWrapper
         */
        if (model.type === 'checkbox') {
            wrapper = this.checkboxWrapper(model, parent, key);
            model['data-keychain'] = this.getKeychain(wrapper);
            element = new Elm(model.element, model, wrapper, 'top'); //top because label comes after input
            //set value as attribute on change
            element.addEventListener('change', function(e) {
                this.setAttribute('elm-value', this.checked);
                self.onChange(e);
            });

        }

        /**
         * Image is converted to droppad using ImageCloud
         */
        else if (model.type === 'image') {
            wrapper = this.defaultWrapper(model, parent, key);
            model['data-keychain'] = this.getKeychain(wrapper);
            element = new Elm(model.element, model, wrapper);
            model.backgroundImage = model.value;

            var droppad = new Droppad(element, model);

            // onchange for images
            droppad.on('success', (data) => {
                Utils.removeClass(wrapper.parentNode, 'has-error');
                element.setAttribute('elm-value', data.image);
                this.onChange(data);
            });

        }

        else if(model.type === 'element') {
            console.log(model);
            new Elm('div', {html: model.html}, parent);
        }

        /**
         * No special treatment needed
         * these elements are normal html inputs and should have onchange event
         */
        else {
            wrapper = this.defaultWrapper(model, parent, key);
            model['data-keychain'] = this.getKeychain(wrapper);
            element = new Elm(model.element, model, wrapper);

            //set value as attribute on change
            element.addEventListener('change', function(e) {
                this.setAttribute('elm-value', this.value);
                self.onChange(e);
            });
            element.addEventListener('blur', function() {
                /**
                * return if no value. otherwise, loop through given validation on this model
                * and collect those who return false and set error class on wrapper parent
                */
                let errors = [];
                if(!this.value) {
                    return false;
                }
                if(model.validation) { //dont fail if no validation id defined
                    model.validation.forEach((item)=> {
                        !self.validators[item](this.value) && errors.push(item);
                    });
                }

                if(errors.length) {
                    let formGroup = Utils.findAncestor(this, 'form-group');
                    Utils.setClass(formGroup, 'has-error');
                }
            });
            element.addEventListener('focus', function(e) {
                Utils.removeClass(wrapper.parentNode, 'has-error');
            });
        }

        /**
         * If there is value defined on the model, we add it as elm-value attribute
         */
        if (model.value) {
            element.setAttribute('elm-value', model.value);
        } else {
            try {
                element.setAttribute('elm-value', '');
            } catch (err) {}
        }

        if (model.toggle) {
            let label = wrapper.previousElementSibling;
            let plus = new Elm('span', {
                cls: 'glyphicon glyphicon-plus',
                css: {
                    'margin-left': '10px',
                    'cursor': 'pointer'
                }
            }, label);
            label.addEventListener('click', (e) => {
                wrapper.style.display = 'block';
                Utils.fadeOutRemove(plus);
            });
            wrapper.style.display = 'none';
        }
        // Some form elements have children. E.g select menus
        try {
            if (model.childnodes.length) {
                Utils.foreach(model.childnodes, (item) => {
                    let model = this.getModel(item);
                    new Elm(model.element, model, element);
                });
            }
        } catch (err) {
            // No childnodes defined
        }

        if(model.type === 'select') {
            element.setAttribute('elm-value', element.options[element.selectedIndex].value);
        }
    }

    buildAllItems(form, parent) {
        let orderKeys = form._order || [];
        let AllKeys = Object.keys(form);
        let diff = _.difference(AllKeys, orderKeys);
        let order = orderKeys.concat(diff);
        let toggle = form._toggle;

        let wrapper = this.subFormWrapper(parent, toggle);

        this.firstLoop = false;
        Utils.foreach(order, (key) => {
            if (!form.hasOwnProperty(key)) {
                console.warn('Schema has no key: ' + key + '. Looks like _order list is outdated.');
                return;
            }
            this.currentKey = key;
            let item = form[key];
            if (typeof(item) !== 'string') {
                // Don't populate private keys
                if (key.substring(0, 1) !== '_') {
                    this.buildOneItem(item, wrapper, key);
                }
            }
        });
    }

    getData() {
        // cleanup list of keys from object
        function deepRemoveKeys(obj, key) {
            let keys = typeof(key) === 'string' ? [key] : key;
            _.forEach(keys, (key) => {
                if (obj && obj[key]) delete obj[key];
            });
            _.forEach(obj, function(item) {
                if (typeof(item) === 'object') {
                    _.forEach(keys, (key) => {
                        if (item && item[key]) delete item[key];
                    });
                    deepRemoveKeys(item, key);
                }
            });
        }

        let self = this;
        let elms = this.parent.querySelectorAll('[data-keychain]');
        this.output = {};
        let isValid = true;
        _.forEach(elms, (elm) => {
            let errors = [];
            let keyList = elm.getAttribute('data-keychain').split('.');
            let lastKey = keyList.pop();
            let keyChain = keyList.join('.');
            let jsKeychain = this.jsKeychain(keyChain);

            let model;
            jsKeychain ? model = eval('self.form.' + jsKeychain) : model = this.form;
            model = model[lastKey];

            /**
            * Validation
            * TODO add validation for all types
            * TODO merge with onchange validation
            * return if no value. otherwise, loop through given validation on this model
            * and collect those who return false and set error class on wrapper parent
            */
            let val = elm.getAttribute('elm-value');

            if(model.required && !val) {
                errors.push('required');
            }

            if(model.validation) {
                model.validation.forEach((item)=> {
                    !self.validators[item](val) && errors.push(item);
                });
            }
            if(errors.length) {
                let formGroup = Utils.findAncestor(elm, 'form-group');
                Utils.setClass(formGroup, 'has-error');
                isValid = false;
            }
            // Locate the right object in the output and add the value to it
            // if no jsKeychain we are on the first level of the object so we just return the whole output object
            let parentObj;
            jsKeychain ? parentObj = eval('self.output.' + jsKeychain) : parentObj = this.output;
            parentObj[lastKey] = val;
        });

        deepRemoveKeys(this.output, ['_order', '_name', '_toggle']);
        if(!isValid) {
            return false;
        }
        return this.output;
    }

    setData(obj) {

        //TODO consider saving orginal schema and use for set data to prevent doubles if setData is done twice
        var self = this;
        this.firstLoop = true;
        this.currentKey = null;

        // Get keychains from the populated form
        let keychains = this.getAllKeychains();

        // obj can have populated lists but schema only defines one item so...
        // Iterate through keychains. and update schema for array's
        for (let i = 0; i < keychains.length; i++) {
            let keyChain = keychains[i];
            let jsKeychain = this.jsKeychain(keyChain);
            let val;
            try {
                val = eval('obj.' + jsKeychain)
            } catch (err) {
                val = null;
            }
            if (Utils.isArrey(val)) {
                this.pushArrayObject(keyChain, val);
            }
            if (val && typeof(val) !== 'object') {
                let parentObj = eval('self.form.' + jsKeychain);
                parentObj['value'] = val;
            }

        }

        this.parent.innerHTML = '';
        this.buildAllItems(this.form, this.parent);
    }

}

class SchemaDiscover {

    constructor(json) {


    }
}


export default {FormGenerator}
