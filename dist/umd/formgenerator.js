;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Formgenerator = factory();
  }
}(this, function() {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var typeModels = {
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
        label: 'dfdf',
        value: ''
    }
};

var FormGenerator = function () {
    function FormGenerator(form, parent) {
        _classCallCheck(this, FormGenerator);

        this.form = form;
        this.parent = parent || document.body;
        this.typeModels = typeModels;
        this.keychain = [];
        this.buildAllItems(this.form, this.parent, this.keychain);
    }

    /**
     * Returns the model for given form item
     */


    _createClass(FormGenerator, [{
        key: 'getModel',
        value: function getModel(item) {
            var model = this.typeModels[item.type];
            return Utils.extend(model, item);
        }

        /**
         * Returns wrapper element for the given form item
         * Default is for most cases. Exceptions must be dealt with
         */

    }, {
        key: 'defaultWrapper',
        value: function defaultWrapper(model, parent) {
            var wrapper = new Elm('div.form-group', parent);
            var label = model.label && new Elm('label', { text: model.label }, wrapper);
            return wrapper;
        }

        /**
         * Returns wrapper element for checkbox
         */

    }, {
        key: 'checkboxWrapper',
        value: function checkboxWrapper(model, parent) {
            var wrapper = new Elm('div.checkbox', parent);
            var label = new Elm('label', wrapper);
            model['checked'] = model.value; // We only use checkbox as bool so if value is true its checked
            new Elm('span', { text: model.label }, label);
            return label;
        }
    }, {
        key: 'subFormWrapper',
        value: function subFormWrapper(parent) {
            var panel = new Elm('div', { cls: 'panel panel-default' }, parent);
            var body = new Elm('div.panel-body', panel);
            return body;
        }
    }, {
        key: 'subFormWrapperPlus',
        value: function subFormWrapperPlus(parent) {
            var panel = new Elm('div', { cls: 'panel panel-default' }, parent);
            var body = new Elm('div.panel-body', panel);
            var plus = new Elm('div', {
                cls: 'btn btn-default',
                html: '<i class="glyphicon glyphicon-plus"></i> Add',
                style: 'margin:0 15px 15px'
            }, panel);
            return body;
        }
    }, {
        key: 'buildOneItem',
        value: function buildOneItem(item, parent, key, keychain) {
            var _this = this;

            keychain.push(key);
            console.log(keychain);
            /**
             * If item is array we need special wrapper
             */
            if (Utils.isArrey(item)) {
                new Elm('h4', { html: key, style: 'margin: 35px 0 0' }, parent);
                new Elm('hr', parent);
                parent = this.subFormWrapperPlus(parent);
                Utils.foreach(item, function (subitem) {
                    var isSubform = !subitem.hasOwnProperty('type');

                    if (isSubform) {
                        _this.buildAllItems(subitem, parent);
                    } else {
                        _this.buildOneItem(subitem, parent, keychain); //dirti fix to wrap item in object. find better solution
                    }
                    new Elm('hr', parent);
                });
                return;
            }

            /**
             * If item don't have type key it is treated as subform
             * this has a potential failure if the actual field name is type
             */
            var isSubform = !item.hasOwnProperty('type');
            if (isSubform) {
                parent = this.subFormWrapper(parent);
                new Elm('h4', { html: key }, parent);
                new Elm('hr', parent);
                this.buildAllItems(item, parent);
                return false;
            }
            var model = this.getModel(item);
            var wrapper = null;
            var element = null;

            // Generate wrapper template for given type
            if (model.type === 'checkbox') {
                wrapper = this.checkboxWrapper(model, parent);
                element = new Elm(model.element, model, wrapper, 'top'); //top because label comes after input
            } else {
                    wrapper = this.defaultWrapper(model, parent);
                    element = new Elm(model.element, model, wrapper);
                }

            // Some form elements have children. E.g select menus
            try {
                if (model.childnodes.length) {
                    Utils.foreach(model.childnodes, function (item) {
                        var model = _this.getModel(item);
                        new Elm(model.element, model, element);
                    });
                }
            } catch (err) {
                // No childnodes defined
            }

            this.keychain = [];
        }
    }, {
        key: 'buildAllItems',
        value: function buildAllItems(form, parent, keychain) {
            var _this2 = this;

            Utils.foreach(form, function (item, key) {
                _this2.buildOneItem(item, parent, key, keychain);
            });
        }
    }]);

    return FormGenerator;
}();
return Formgenerator;
}));
