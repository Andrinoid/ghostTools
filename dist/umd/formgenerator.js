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
var typeModels = {
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

var FormGenerator = function () {
    function FormGenerator(form, parent) {
        _classCallCheck(this, FormGenerator);

        this.form = form;
        this.output = _.cloneDeep(form);
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


    _createClass(FormGenerator, [{
        key: 'getKeychain',
        value: function getKeychain(el) {
            var raw = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

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

        /**
         * Returns javascript valid keychain from the generated dot seperated
         * e.g foo.bar.4.bas -> foo.bar[4].baz
         */

    }, {
        key: 'jsKeychain',
        value: function jsKeychain(str) {
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

    }, {
        key: 'getCycleKey',
        value: function getCycleKey(key) {
            var reverse = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            if (this.arrayIndex || this.arrayIndex === 0) {
                if (reverse) {
                    return key ? key + '.' + this.arrayIndex : this.arrayIndex;
                }
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
            var clone = _.clone(model);
            return Utils.extend(clone, item);
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
            var description = model.description && new Elm('p', { html: model.description }, wrapper);
            var inputContainer = new Elm('div', wrapper);
            var helptext = model.helpText && new Elm('span.help-block', { text: model.helpText }, wrapper);
            return inputContainer;
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
            var helptext = model.helpText && new Elm('span.help-block', { text: model.helpText }, wrapper);
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

            var self = this;
            key = this.getCycleKey(key);
            var panel = new Elm('div', { cls: 'panel panel-default keypoint', 'data-key': key }, parent);
            var body = new Elm('div.panel-body', panel);

            var keychain = this.getKeychain(panel, true);
            //keychain.pop();
            keychain = keychain.join('.');

            var plus = new Elm('div', {
                cls: 'btn btn-default',
                html: '<i class="glyphicon glyphicon-plus"></i> Add',
                style: 'margin:0 15px 15px',
                click: function click() {
                    var list = eval('self.form.' + keychain);

                    var listClone = _.cloneDeep(list);

                    var clone = listClone[0];
                    list.push(clone);
                    _this.arrayIndex = list.length - 1;

                    var isSubform = !clone.hasOwnProperty('type');
                    if (isSubform) {
                        _this.buildSubForm(clone, body, key);
                    } else {
                        _this.buildOneItem(clone, body);
                    }
                }
            }, panel);

            return body;
        }
    }, {
        key: 'buildSubForm',
        value: function buildSubForm(subitem, parent, key) {
            var _this2 = this;

            var wrapper = new Elm('div.subform', parent);
            var keychain = this.getKeychain(wrapper, true);
            //keychain.pop();
            keychain = keychain.join('.');

            var remove = new Elm('div.delSubForm', {
                cls: 'pull-right',
                html: '<i class="glyphicon glyphicon-remove"></i>',
                css: { color: 'gray', cursor: 'pointer' },
                'data-key': keychain,
                click: function click(e) {
                    console.log(_this2.jsKeychain(keychain));
                    var list = eval('self.form' + _this2.jsKeychain(keychain));
                    var index = _this2.arrayIndex || 0;
                    list.splice(index, 1);
                    Utils.fadeOutRemove(wrapper);
                }
            }, wrapper);
            this.buildAllItems(subitem, wrapper);
        }
    }, {
        key: 'buildOneItem',
        value: function buildOneItem(item, parent, key) {
            var _this3 = this;

            var self = this;
            /**
             * If item is array we need special wrapper
             */
            if (Utils.isArrey(item)) {
                new Elm('h4', { html: key, style: 'margin: 35px 0 0' }, parent);
                new Elm('hr', parent);
                parent = this.subFormWrapperPlus(parent, key);
                Utils.foreach(item, function (subitem, i) {
                    _this3.arrayIndex = i;
                    var isSubform = !subitem.hasOwnProperty('type');
                    if (isSubform) {
                        _this3.buildSubForm(subitem, parent, key);
                    } else {
                        _this3.buildOneItem(subitem, parent);
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
                    imagePortal.on('success', function (rsp) {
                        element.setAttribute('rv-checked', _this3.getKeychain(wrapper));
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

            if (model.toggle) {
                (function () {
                    var label = wrapper.previousElementSibling;
                    var plus = new Elm('span', {
                        cls: 'glyphicon glyphicon-plus',
                        css: { 'margin-left': '10px', 'cursor': 'pointer' }
                    }, label);
                    label.addEventListener('click', function (e) {
                        wrapper.style.display = 'block';
                        Utils.fadeOutRemove(plus);
                    });
                    wrapper.style.display = 'none';
                })();
            }
            // Some form elements have children. E.g select menus
            try {
                if (model.childnodes.length) {
                    Utils.foreach(model.childnodes, function (item) {
                        var model = _this3.getModel(item);
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
            var _this4 = this;

            var orderKeys = form._order || [];
            var AllKeys = Object.keys(form);
            var diff = _.difference(AllKeys, orderKeys);
            var order = orderKeys.concat(diff);

            Utils.foreach(order, function (key) {
                if (!form.hasOwnProperty(key)) {
                    console.warn('Schema has no key: ' + key + '. Looks like _order list is outdated.');
                    return;
                }
                var item = form[key];
                if (typeof item !== 'string') {
                    // Don't populate private keys
                    if (key.substring(0, 1) !== '_') {
                        _this4.buildOneItem(item, parent, key);
                    }
                }
            });
        }
    }, {
        key: 'getData',
        value: function getData() {
            var _this5 = this;

            var self = this;
            var elms = this.parent.querySelectorAll('[data-keychain]');
            _.forEach(elms, function (item) {
                var keyList = item.getAttribute('data-keychain').split('.');
                var lastKey = keyList.pop();
                var keyChain = keyList.join('.');
                var jsKeychain = _this5.jsKeychain(keyChain);

                var val = item.getAttribute('elm-value');
                var parentObj = void 0;
                jsKeychain ? parentObj = eval('self.output.' + jsKeychain) : parentObj = _this5.output;

                parentObj[lastKey] = val;
            });
            return this.output;
        }
    }]);

    return FormGenerator;
}();
return Formgenerator;
}));
