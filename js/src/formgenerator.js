import Utils from './utils';
import Elm from './elm';



//_.mixin({
//    deeply: function (map) {
//        return function(obj, fn) {
//            return map(_.mapValues(obj, function (v) {
//                return _.isPlainObject(v) ? _.deeply(map)(v, fn) : v;
//            }), fn);
//        }
//    },
//});

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
        helpText: ''
    },
    number: {
        element: 'input',
        type: 'number',
        cls: 'form-control',
        value: '',
        placeholder: ''
    },
    date: {
        element: 'input',
        type: 'date',
        cls: 'form-control',
        value: '',
        placeholer: ''
    },
    textarea: {
        element: 'textarea',
        cls: 'form-control',
        rows: 5
    },
    submit: {
        element: 'input',
        type: 'submit',
        cls: 'btn btn-info'
    },
    select: {
        element: 'select',
        label: '',
        cls: 'form-control',
        childnodes: []
    },
    option: {
        element: 'option',
        label: '',
        value: ''
    },
    checkbox: {
        element: 'input',
        type: 'checkbox',
        label: '',
        value: ''
    },
    image: {
        element: 'div',
        label: 'imagefield',
        description: '',
        width: 'auto',
        height: 'auto',
        quality: 60,
        value: '',
        currentImage: ''
    }
};

//TODO list
/**
 * add validation for types
 * remove instance
 */
class FormGenerator {

    constructor(form, parent) {
        this.form = form;
        //remove private keys from output object

        this.parent = parent || document.body;
        this.typeModels = typeModels;
        this.arrayIndex = null;
        this.buildAllItems(this.form, this.parent);
    }

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
        _.forEach(formElms, (item)=> {
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
        _.forEach(list, (val)=> {
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

    /**
     * Returns wrapper element for the given form item
     * Default is for most cases. Exceptions must be dealt with
     */
    defaultWrapper(model, parent, key) {
        key = this.getCycleKey(key);
        let wrapper = new Elm('div.form-group', {'data-key': key, cls: 'keypoint'}, parent);
        let label = model.label && new Elm('label', {text: model.label}, wrapper);
        let description = model.description && new Elm('p', {html: model.description}, wrapper);
        let inputContainer = new Elm('div', wrapper);
        let helptext = model.helpText && new Elm('span.help-block', {text: model.helpText}, wrapper);
        return inputContainer;
    }

    /**
     * Returns wrapper element for checkbox
     */
    checkboxWrapper(model, parent, key) {
        key = this.getCycleKey(key);
        let wrapper = new Elm('div.checkbox', {'data-key': key, cls: 'keypoint'}, parent);
        let label = new Elm('label', wrapper);
        model['checked'] = model.value; // We only use checkbox as bool so if value is true its checked
        new Elm('span', {text: model.label}, label);
        let helptext = model.helpText && new Elm('span.help-block', {text: model.helpText}, wrapper);
        return label;
    }

    /**
     * Returns wrapper element for subform or simply an bootstrap panel
     */
    subFormWrapper(parent, key) {
        key = this.getCycleKey(key);
        let panel = new Elm('div', {cls: 'panel panel-default keypoint', 'data-key': key}, parent);
        let body = new Elm('div.panel-body', panel);
        return body;
    }


    removeItemElm(parent, keychain) {
        var self = this;
        let remove = new Elm('div.delSubForm', {
            cls: 'pull-right',
            html: '<i class="glyphicon glyphicon-remove"></i>',
            css: {color: 'gray', cursor: 'pointer'},
            'data-key': keychain,
            click: (e)=> {
                let list = eval('self.form.' + this.jsKeychain(keychain));
                let index = this.arrayIndex || 0;
                let removed = list.splice(index, 1);
                console.log(removed); //// removes only one item if removed is triggered in a row this.arrayIndex is fixed here
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
            click: ()=> {
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


    /**
     * Returns wrapper element for array with plus button
     */
    subFormWrapperPlus(parent, key) {
        var self = this;
        key = this.getCycleKey(key);
        let panel = new Elm('div', {cls: 'panel panel-default keypoint', 'data-key': key}, parent);
        let body = new Elm('div.panel-body', panel);

        let keychain = this.getKeychain(panel, true);
        keychain = keychain.join('.');

        this.addItemElm(panel, body, keychain);
        return body;
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
            new Elm('h4', {html: key, style: 'margin: 35px 0 0'}, parent);
            new Elm('hr', parent);
            parent = this.subFormWrapperPlus(parent, key);
            Utils.foreach(item, (subitem, i)=> {
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
            parent = this.subFormWrapper(parent, key);
            new Elm('h4', {html: key}, parent);
            new Elm('hr', parent);
            this.buildAllItems(item, parent);
            return false;
        }


        let model = this.getModel(item);
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
            element.addEventListener('change', function (e) {
                this.setAttribute('elm-value', this.checked);
            });

        }
        /**
         * Image is converted to droppad using ImageCloud
         */
        else if (model.type === 'image') {
            wrapper = this.defaultWrapper(model, parent, key);
            model['data-keychain'] = this.getKeychain(wrapper);
            element = new Elm(model.element, model, wrapper);
            model.currentImage = model.value;
            var imagePortal = new ImageCloud(element, model);
            imagePortal.on('success', (rsp)=> {
                element.setAttribute('rv-checked', this.getKeychain(wrapper));
                element.setAttribute('elm-value', rsp.url);
            });

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
            element.addEventListener('change', function (e) {
                this.setAttribute('elm-value', this.value);
            });
        }

        /**
         * If there is value defined on the model, we add it as elm-value attribute
         */
        if (model.value) {
            element.setAttribute('elm-value', model.value);
        }

        if (model.toggle) {
            let label = wrapper.previousElementSibling;
            let plus = new Elm('span', {
                cls: 'glyphicon glyphicon-plus',
                css: {'margin-left': '10px', 'cursor': 'pointer'}
            }, label);
            label.addEventListener('click', (e)=> {
                wrapper.style.display = 'block';
                Utils.fadeOutRemove(plus);
            });
            wrapper.style.display = 'none';
        }
        // Some form elements have children. E.g select menus
        try {
            if (model.childnodes.length) {
                Utils.foreach(model.childnodes, (item)=> {
                    let model = this.getModel(item);
                    new Elm(model.element, model, element);
                });
            }
        } catch (err) {
            // No childnodes defined
        }
    }

    buildAllItems(form, parent) {
        let orderKeys = form._order || [];
        let AllKeys = Object.keys(form);
        let diff = _.difference(AllKeys, orderKeys);
        let order = orderKeys.concat(diff);

        Utils.foreach(order, (key)=> {
            if (!form.hasOwnProperty(key)) {
                console.warn('Schema has no key: ' + key + '. Looks like _order list is outdated.');
                return;
            }
            let item = form[key];
            if (typeof(item) !== 'string') {
                // Don't populate private keys
                if (key.substring(0, 1) !== '_') {
                    this.buildOneItem(item, parent, key);
                }
            }
        });
    }

    getData() {
        let self = this;
        let elms = this.parent.querySelectorAll('[data-keychain]');
        this.output = _.cloneDeep(this.form);
        _.forEach(elms, (item) => {
            let keyList = item.getAttribute('data-keychain').split('.');
            let lastKey = keyList.pop();
            let keyChain = keyList.join('.');
            let jsKeychain = this.jsKeychain(keyChain);

            let val = item.getAttribute('elm-value');
            let parentObj;
            jsKeychain ? parentObj = eval('self.output.' + jsKeychain) : parentObj = this.output;

            parentObj[lastKey] = val;

        });
        return this.output;

    }

    setData(obj) {
        //TODO consider saving orginal schema and use for set data to prevent doubles if setData is done twice
        var self = this;
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
            if (val && typeof(val) !== 'object') { //FIXME this is a layzy fix. real solution is to not set data-key to non input elements
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


export default {FormGenerator, SchemaDiscover};
