import Utils from './utils';
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
//    ];
let typeModels = {
    text: {
        element: 'input',
        type: 'text',
        cls: 'form-control',
        value: '',
        placeholder: ''
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
        placeholer: '',
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
        label: 'dfdf',
        value: ''
    }
};

class FormGenerator {

    constructor(form, parent) {
        this.form = form;
        this.parent = parent || document.body;
        this.typeModels = typeModels;
        this.keyHistory = [];
        this.keyChain = [];
        this.arrayIndex = null;
        this.buildAllItems(this.form, this.parent);

        rivets.bind(this.parent, {form: this.form});
    }

    /**
     * Climbs the dom tree and gathers the keychain for given element
     * returns keychain
     */
    getKeychain(el) {
        var keyList = ['value'];
        while (el.parentNode && el.parentNode != document.body) {
            if ((' ' + el.className + ' ').indexOf(' ' + 'keypoint' + ' ') > -1) {
                keyList.push(el.getAttribute('data-key'));
            }
            el = el.parentNode;
        }
        keyList.push('form');
        return keyList.reverse().join('.');
    }

    /**
     * Returns javascript valid keychain from the generated dot seperated
     * e.g foo.bar.4.bas -> foo.bar[4].baz
     */
    jsKeychain(str) {
        return str.replace(new RegExp('\.[0-9]+'), '[' + str.match('\.[0-9]+')[0].slice(1) + ']');
    }

    /**
     * if we are inside a loop prepend the index to the key
     * e.g if arrayIndex is 2 and key is foo we return 2
     */
    getCycleKey(key) {
        if (this.arrayIndex || this.arrayIndex === 0) {
            return key ? this.arrayIndex + '.' + key : this.arrayIndex;
        }
        return key;
    }

    /**
     * Returns the model for given form item
     */
    getModel(item) {
        let model = this.typeModels[item.type];
        return Utils.extend(model, item);
    }

    /**
     * Returns wrapper element for the given form item
     * Default is for most cases. Exceptions must be dealt with
     */
    defaultWrapper(model, parent, key) {
        key = this.getCycleKey(key);
        let wrapper = new Elm('div.form-group', {'data-key': key, cls: 'keypoint'}, parent);
        let label = model.label && new Elm('label', {text: model.label}, wrapper);
        return wrapper;
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

    /**
     * Returns wrapper element for array with plus button
     */
    subFormWrapperPlus(parent, key) {
        key = this.getCycleKey(key);
        let panel = new Elm('div', {cls: 'panel panel-default keypoint', 'data-key': key}, parent);
        let body = new Elm('div.panel-body', panel);
        let plus = new Elm('div', {
            cls: 'btn btn-default',
            html: '<i class="glyphicon glyphicon-plus"></i> Add',
            style: 'margin:0 15px 15px'
        }, panel);
        return body;
    }

    buildOneItem(item, parent, key) {

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
                    this.buildAllItems(subitem, parent);
                } else {
                    this.buildOneItem(subitem, parent);//dirti fix to wrap item in object. find better solution
                }
                new Elm('hr', parent);
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

        // Generate wrapper template for given type
        if (model.type === 'checkbox') {
            wrapper = this.checkboxWrapper(model, parent, key);
            model['data-keychain'] = this.getKeychain(wrapper);
            element = new Elm(model.element, model, wrapper, 'top'); //top because label comes after input
        } else {
            wrapper = this.defaultWrapper(model, parent, key);
            model['data-keychain'] = this.getKeychain(wrapper);
            element = new Elm(model.element, model, wrapper);
            element.setAttribute('rv-value', this.getKeychain(wrapper));

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
        Utils.foreach(form, (item, key)=> {
            this.keyHistory.push(key);
            this.buildOneItem(item, parent, key);
        });
    }

}

export default FormGenerator;
