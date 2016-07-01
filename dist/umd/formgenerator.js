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
        this.keyHistory = [];
        this.arrayIndex = null;
        this.buildAllItems(this.form, this.parent);
        this.bind();
        //this.binding = rivets.bind(this.parent, {form: this.form});
    }

    _createClass(FormGenerator, [{
        key: 'bind',
        value: function bind() {
            this.binding = rivets.bind(this.parent, { form: this.form });
        }

        /**
         * Climbs the dom tree and gathers the keychain for given element
         * returns keychain
         */

    }, {
        key: 'getKeychain',
        value: function getKeychain(el) {
            var raw = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            var keyList = ['value'];
            while (el.parentNode && el.parentNode != document.body) {
                if ((' ' + el.className + ' ').indexOf(' ' + 'keypoint' + ' ') > -1) {
                    keyList.push(el.getAttribute('data-key'));
                }
                el = el.parentNode;
            }
            keyList.push('form');

            return raw ? keyList.reverse() : keyList.reverse().join('.');
        }

        /**
         * Returns javascript valid keychain from the generated dot seperated
         * e.g foo.bar.4.bas -> foo.bar[4].baz
         */

    }, {
        key: 'jsKeychain',
        value: function jsKeychain(str) {
            return str.replace(new RegExp('\.[0-9]+'), '[' + str.match('\.[0-9]+')[0].slice(1) + ']');
        }

        /**
         * if we are inside a loop prepend the index to the key
         * e.g if arrayIndex is 2 and key is foo we return 2
         */

    }, {
        key: 'getCycleKey',
        value: function getCycleKey(key) {
            if (this.arrayIndex || this.arrayIndex === 0) {
                return key ? this.arrayIndex + '.' + key : this.arrayIndex;
            }
            return key;
        }

        /**
         * Returns the model for given form item
         */

    }, {
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
        value: function defaultWrapper(model, parent, key) {
            key = this.getCycleKey(key);
            var wrapper = new Elm('div.form-group', { 'data-key': key, cls: 'keypoint' }, parent);
            var label = model.label && new Elm('label', { text: model.label }, wrapper);
            return wrapper;
        }

        /**
         * Returns wrapper element for checkbox
         */

    }, {
        key: 'checkboxWrapper',
        value: function checkboxWrapper(model, parent, key) {
            key = this.getCycleKey(key);
            var wrapper = new Elm('div.checkbox', { 'data-key': key, cls: 'keypoint' }, parent);
            var label = new Elm('label', wrapper);
            model['checked'] = model.value; // We only use checkbox as bool so if value is true its checked
            new Elm('span', { text: model.label }, label);
            return label;
        }

        /**
         * Returns wrapper element for subform or simply an bootstrap panel
         */

    }, {
        key: 'subFormWrapper',
        value: function subFormWrapper(parent, key) {
            key = this.getCycleKey(key);
            var panel = new Elm('div', { cls: 'panel panel-default keypoint', 'data-key': key }, parent);
            var body = new Elm('div.panel-body', panel);
            return body;
        }

        /**
         * Returns wrapper element for array with plus button
         */

    }, {
        key: 'subFormWrapperPlus',
        value: function subFormWrapperPlus(parent, key) {
            var _this = this;

            key = this.getCycleKey(key);
            var panel = new Elm('div', { cls: 'panel panel-default keypoint', 'data-key': key }, parent);
            var body = new Elm('div.panel-body', panel);

            var keychain = this.getKeychain(panel, true);
            keychain.pop();
            keychain = keychain.join('.');

            var plus = new Elm('div', {
                cls: 'btn btn-default',
                html: '<i class="glyphicon glyphicon-plus"></i> Add',
                style: 'margin:0 15px 15px',
                click: function click() {
                    //TODO this undbind and rebind feels hacky.
                    _this.binding.unbind();
                    var list = new Function('return this.' + keychain)();
                    list.push(Object.assign({}, list[0]));
                    _this.arrayIndex = list.length - 1;
                    _this.buildOneItem(list[0], body);
                    new Elm('hr', body);
                    _this.bind();
                }
            }, panel);

            return body;
        }
    }, {
        key: 'buildOneItem',
        value: function buildOneItem(item, parent, key) {
            var _this2 = this;

            /**
             * If item is array we need special wrapper
             */
            if (Utils.isArrey(item)) {
                new Elm('h4', { html: key, style: 'margin: 35px 0 0' }, parent);
                new Elm('hr', parent);
                parent = this.subFormWrapperPlus(parent, key);
                Utils.foreach(item, function (subitem, i) {
                    _this2.arrayIndex = i;
                    var isSubform = !subitem.hasOwnProperty('type');
                    if (isSubform) {
                        _this2.buildAllItems(subitem, parent);
                    } else {
                        _this2.buildOneItem(subitem, parent); //dirti fix to wrap item in object. find better solution
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
            var isSubform = !item.hasOwnProperty('type');
            if (isSubform) {
                parent = this.subFormWrapper(parent, key);
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
                wrapper = this.checkboxWrapper(model, parent, key);
                model['data-keychain'] = this.getKeychain(wrapper);
                element = new Elm(model.element, model, wrapper, 'top'); //top because label comes after input
                element.setAttribute('rv-value', this.getKeychain(wrapper));
            } else {
                wrapper = this.defaultWrapper(model, parent, key);
                model['data-keychain'] = this.getKeychain(wrapper);
                element = new Elm(model.element, model, wrapper);
                element.setAttribute('rv-value', this.getKeychain(wrapper));
            }

            // Some form elements have children. E.g select menus
            try {
                if (model.childnodes.length) {
                    Utils.foreach(model.childnodes, function (item) {
                        var model = _this2.getModel(item);
                        new Elm(model.element, model, element);
                    });
                }
            } catch (err) {
                // No childnodes defined
            }
        }
    }, {
        key: 'buildAllItems',
        value: function buildAllItems(form, parent) {
            var _this3 = this;

            Utils.foreach(form, function (item, key) {
                _this3.keyHistory.push(key);
                _this3.buildOneItem(item, parent, key);
            });
        }
    }]);

    return FormGenerator;
}();
return Formgenerator;
}));
