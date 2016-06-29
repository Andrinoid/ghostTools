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
        this.buildAllItems(this.form, this.parent);
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
    defaultWrapper(model, parent) {
        let wrapper = new Elm('div.form-group', parent);
        let label = model.label && new Elm('label', {text: model.label}, wrapper);
        return wrapper;
    }

    /**
     * Returns wrapper element for checkbox
     */
    checkboxWrapper(model, parent) {
        let wrapper = new Elm('div.checkbox', parent);
        let label = new Elm('label', wrapper);
        model['checked'] = model.value; // We only use checkbox as bool so if value is true its checked
        new Elm('span', {text: model.label}, label);
        return label;
    }

    subFormWrapper(parent) {
        let panel = new Elm('div', {cls: 'panel panel-default'}, parent);
        let body = new Elm('div.panel-body', panel);
        return body;
    }

    subFormWrapperPlus(parent) {
        let panel = new Elm('div', {cls: 'panel panel-default'}, parent);
        let body = new Elm('div.panel-body', panel);
        let plus = new Elm('div', {cls: 'btn btn-default', html: '<i class="glyphicon glyphicon-plus"></i> Add', style: 'margin:0 15px 15px'}, panel);
        return body;
    }

    buildOneItem(item, parent, key) {

            /**
             * If item is array we need special wrapper
             */
            if(Utils.isArrey(item)) {
                new Elm('h4', {html: key, style: 'margin: 35px 0 0'}, parent);
                new Elm('hr', parent);
                parent = this.subFormWrapperPlus(parent);
                Utils.foreach(item, (subitem)=> {
                    let isSubform = !subitem.hasOwnProperty('type');

                    if(isSubform) {
                        this.buildAllItems(subitem, parent);
                    } else {
                        this.buildOneItem(subitem, parent);//dirti fix to wrap item in object. find better solution
                    }
                    new Elm('hr', parent);
                });
                return;
            }

            /**
             * If item don't have type key it is treated as subform
             * this has a potential failure if the actual field name is type
             */
            let isSubform = !item.hasOwnProperty('type');
            if(isSubform) {
                parent = this.subFormWrapper(parent);
                new Elm('h4', {html: key}, parent);
                new Elm('hr', parent);
                this.buildAllItems(item, parent);
                return false;
            }
            let model = this.getModel(item);
            let wrapper = null;
            let element = null;

            // Generate wrapper template for given type
            if(model.type === 'checkbox') {
                wrapper = this.checkboxWrapper(model, parent);
                element = new Elm(model.element, model, wrapper, 'top'); //top because label comes after input
            } else {
                wrapper = this.defaultWrapper(model, parent);
                element = new Elm(model.element, model, wrapper);
            }

            // Some form elements have children. E.g select menus
            try {
                if (model.childnodes.length) {
                    Utils.foreach(model.childnodes, (item)=> {
                        let model = this.getModel(item);
                        new Elm(model.element, model, element);
                    });
                }
            } catch(err) {
                // No childnodes defined
            }
    }

    buildAllItems(form, parent) {
        Utils.foreach(form, (item, key)=> {
            this.buildOneItem(item, parent, key);
        });
    }

}

export default FormGenerator;