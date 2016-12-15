'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
        helpText: '',
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
        value: '',
        backgroundUrlPrefix: '',
        url: 'http://kotturinn.com/icloud/upload/test',
        backgroundImage: '',
        maxFilesize: 8, //in MB
        acceptedFiles: 'jpeg, jpg, png, gif'
    }
};

//TODO list
/**
 * add validation for types
 * remove instance
 *
 */

var FormGenerator = function () {
    function FormGenerator(form, parent) {
        _classCallCheck(this, FormGenerator);

        this.form = form;
        //remove private keys from output object

        this.firstLoop = true;
        this.currentKey = null;
        this.parent = parent || document.body;
        this.typeModels = typeModels;
        this.arrayIndex = null;
        this.buildAllItems(this.form, this.parent);

        this.validators = {
            email: function email(_email) {
                var emailReg = new RegExp('[a-zA-Z0-9]+(?:(\\.|_)[A-Za-z0-9!#$%&\'*+\\/=?^`{|}~-]+)*@(?!([a-zA-Z0-9]*\\.[a-zA-Z0-9]*\\.[a-zA-Z0-9]*\\.))(?:[A-Za-z0-9](?:[a-zA-Z0-9-]*[A-Za-z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?');
                return emailReg.test(_email);
            }
        };
    }
    /**
     * Events to overide
     */


    _createClass(FormGenerator, [{
        key: 'onChange',
        value: function onChange(e) {}

        /**
         * Climbs the dom tree and gathers the keychain for given element
         * returns keychain
         */

    }, {
        key: 'getKeychain',
        value: function getKeychain(el) {
            var raw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

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
    }, {
        key: 'getAllKeychains',
        value: function getAllKeychains() {
            var _this = this;

            var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var suffix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            prefix = prefix ? prefix += '.' : '';
            suffix = suffix ? '.' + suffix : '';
            var formElms = this.parent.querySelectorAll('[data-key]');
            var keychains = [];
            _.forEach(formElms, function (item) {
                var root = _this.getKeychain(item);
                var keychain = '' + prefix + root + suffix;
                keychains.push(keychain);
            });
            return keychains;
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
            var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

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

    }, {
        key: 'pushArrayObject',
        value: function pushArrayObject(keychain, list) {
            var self = this;
            var schemaList = eval('self.form.' + keychain);
            var item = schemaList[0];
            var isSubform = !item.hasOwnProperty('type');
            schemaList.pop();
            _.forEach(list, function (val) {
                var clone = _.clone(item);
                clone.value = val;
                schemaList.push(clone);
            });
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
    }, {
        key: 'getElementModel',
        value: function getElementModel(elm) {}

        /**
         * Returns wrapper element for the given form item
         * Default is for most cases. Exceptions must be dealt with
         */

    }, {
        key: 'defaultWrapper',
        value: function defaultWrapper(model, parent, key) {
            key = this.getCycleKey(key);
            var wrapper = new Elm('div.form-group', {
                'data-key': key,
                cls: 'keypoint'
            }, parent);
            var label = model.label && new Elm('label', {
                text: model.label,
                cls: 'control-label'
            }, wrapper);
            var description = model.description && new Elm('p', {
                html: model.description
            }, wrapper);
            var inputContainer = new Elm('div', wrapper);
            var helptext = model.helpText && new Elm('span.help-block', {
                text: model.helpText
            }, wrapper);
            return inputContainer;
        }

        /**
         * Returns wrapper element for checkbox
         */

    }, {
        key: 'checkboxWrapper',
        value: function checkboxWrapper(model, parent, key) {
            key = this.getCycleKey(key);
            var wrapper = new Elm('div.checkbox', {
                'data-key': key,
                cls: 'keypoint'
            }, parent);
            var label = new Elm('label', wrapper);
            model['checked'] = model.value; // We only use checkbox as bool so if value is true its checked
            new Elm('span', {
                text: model.label
            }, label);
            var helptext = model.helpText && new Elm('span.help-block', {
                text: model.helpText
            }, wrapper);
            return label;
        }

        /**
         * Returns wrapper element for subform or simply an bootstrap panel
         */

    }, {
        key: 'subFormWrapper',
        value: function subFormWrapper(parent) {
            var toggle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var key = this.getCycleKey(this.currentKey);
            var label = void 0;
            if (key) label = new Elm('h4', {
                html: key,
                style: 'text-transform: capitalize'
            }, parent);
            var cls = this.firstLoop ? '' : 'panel panel-default keypoint';
            var panel = new Elm('div', {
                cls: cls,
                'data-key': key
            }, parent);
            var body = new Elm('div.panel-body', panel);
            if (toggle) {
                (function () {

                    var plus = new Elm('span', {
                        cls: 'glyphicon glyphicon-plus',
                        css: {
                            'margin-left': '10px',
                            'cursor': 'pointer',
                            'font-size': '16px'
                        }
                    }, label);
                    label.addEventListener('click', function (e) {
                        panel.style.display = 'block';
                        Utils.fadeOutRemove(plus);
                    });
                    panel.style.display = 'none';
                })();
            }

            return body;
        }

        /**
         * Returns wrapper element for array with plus button
         */

    }, {
        key: 'subFormWrapperPlus',
        value: function subFormWrapperPlus(parent) {
            var self = this;
            var key = this.getCycleKey(this.currentKey);
            //new Elm('h4', {html: key, style: 'text-transform: capitalize'}, parent);
            var panel = new Elm('div', {
                cls: 'panel panel-default keypoint',
                'data-key': key
            }, parent);
            var body = new Elm('div.panel-body', panel);

            var keychain = this.getKeychain(panel, true);
            keychain = keychain.join('.');

            this.addItemElm(panel, body, keychain);
            return body;
        }
    }, {
        key: 'removeItemElm',
        value: function removeItemElm(parent, keychain) {
            var _this2 = this;

            var self = this;
            var remove = new Elm('div.delSubForm', {
                cls: 'pull-right',
                html: '<i class="glyphicon glyphicon-remove"></i>',
                css: {
                    color: 'gray',
                    cursor: 'pointer'
                },
                'data-key': keychain,
                click: function click(e) {
                    var list = eval('self.form.' + _this2.jsKeychain(keychain));
                    var index = _this2.arrayIndex || 0;
                    var removed = list.splice(index, 1);
                    // removes only one item if removed is triggered in a row this.arrayIndex is fixed here
                    Utils.fadeOutRemove(parent);
                }
            }, parent);
        }
    }, {
        key: 'addItemElm',
        value: function addItemElm(parent, body, keychain) {
            var _this3 = this;

            var self = this;
            var plus = new Elm('div', {
                cls: 'btn btn-default',
                html: '<i class="glyphicon glyphicon-plus"></i> Add',
                style: 'margin:0 15px 15px',
                click: function click() {
                    var elmWrapper = new Elm('div', body);
                    var list = eval('self.form.' + keychain);
                    var clone = list[0];
                    clone.value = '';
                    list.push(clone);
                    _this3.arrayIndex = list.length - 1;
                    var isSubform = !clone.hasOwnProperty('type');
                    if (isSubform) {
                        _this3.buildSubForm(clone, body);
                    } else {
                        _this3.removeItemElm(elmWrapper, keychain);
                        _this3.buildOneItem(clone, elmWrapper);
                    }
                }
            }, parent);
        }
    }, {
        key: 'buildSubForm',
        value: function buildSubForm(subitem, parent) {
            var wrapper = new Elm('div.subform', parent);
            var keychain = this.getKeychain(wrapper, true);
            //keychain.pop();
            keychain = keychain.join('.');

            // No remove button on first item in array
            if (this.arrayIndex) {
                this.removeItemElm(wrapper, keychain);
            }
            this.buildAllItems(subitem, wrapper);
        }
    }, {
        key: 'buildOneItem',
        value: function buildOneItem(item, parent, key) {
            var _this4 = this;

            var self = this;
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
                Utils.foreach(item, function (subitem, i) {
                    _this4.arrayIndex = i;
                    var isSubform = !subitem.hasOwnProperty('type');
                    if (isSubform) {
                        _this4.buildSubForm(subitem, parent, key);
                    } else {
                        _this4.buildOneItem(subitem, parent);
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
                //parent = this.subFormWrapper(parent, key);

                //new Elm('hr', parent);
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
                    self.onChange(e);
                });
            }
            /**
             * Image is converted to droppad using ImageCloud
             */
            else if (model.type === 'image') {
                    wrapper = this.defaultWrapper(model, parent, key);
                    console.log(wrapper);
                    model['data-keychain'] = this.getKeychain(wrapper);
                    element = new Elm(model.element, model, wrapper);
                    model.backgroundImage = model.value;

                    var droppad = new Droppad(element, model);

                    // onchange for images
                    droppad.on('success', function (data) {
                        Utils.removeClass(wrapper.parentNode, 'has-error');
                        element.setAttribute('elm-value', data.image);
                        _this4.onChange(data);
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
                            self.onChange(e);
                        });
                        element.addEventListener('blur', function () {
                            var _this5 = this;

                            /**
                            * Onchange validation
                            * TODO add validation for all types
                            * TODO merge with getData validation
                            * return if no value. otherwise, loop through given validation on this model
                            * and collect those who return false and set error class on wrapper parent
                            */
                            var errors = [];
                            if (!this.value) {
                                return false;
                            }
                            if (model.validation) {
                                //dont fail if no validation id defined
                                model.validation.forEach(function (item) {
                                    !self.validators[item](_this5.value) && errors.push(item);
                                });
                            }

                            if (errors.length) {
                                var formGroup = Utils.findAncestor(this, 'form-group');
                                Utils.setClass(formGroup, 'has-error');
                            }
                        });
                        element.addEventListener('focus', function (e) {
                            Utils.removeClass(wrapper.parentNode, 'has-error');
                        });
                    }

            /**
             * If there is value defined on the model, we add it as elm-value attribute
             */
            if (model.value) {
                element.setAttribute('elm-value', model.value);
            } else {
                element.setAttribute('elm-value', '');
            }

            if (model.toggle) {
                (function () {
                    var label = wrapper.previousElementSibling;
                    var plus = new Elm('span', {
                        cls: 'glyphicon glyphicon-plus',
                        css: {
                            'margin-left': '10px',
                            'cursor': 'pointer'
                        }
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
                        var model = _this4.getModel(item);
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
            var _this6 = this;

            var orderKeys = form._order || [];
            var AllKeys = Object.keys(form);
            var diff = _.difference(AllKeys, orderKeys);
            var order = orderKeys.concat(diff);
            var toggle = form._toggle;

            var wrapper = this.subFormWrapper(parent, toggle);

            this.firstLoop = false;
            Utils.foreach(order, function (key) {
                if (!form.hasOwnProperty(key)) {
                    console.warn('Schema has no key: ' + key + '. Looks like _order list is outdated.');
                    return;
                }
                _this6.currentKey = key;
                var item = form[key];
                if (typeof item !== 'string') {
                    // Don't populate private keys
                    if (key.substring(0, 1) !== '_') {
                        _this6.buildOneItem(item, wrapper, key);
                    }
                }
            });
        }
    }, {
        key: 'getData',
        value: function getData() {
            var _this7 = this;

            // cleanup list of keys from object
            function deepRemoveKeys(obj, key) {
                var keys = typeof key === 'string' ? [key] : key;
                _.forEach(keys, function (key) {
                    if (obj && obj[key]) delete obj[key];
                });
                _.forEach(obj, function (item) {
                    if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
                        _.forEach(keys, function (key) {
                            if (item && item[key]) delete item[key];
                        });
                        deepRemoveKeys(item, key);
                    }
                });
            }

            var self = this;
            var elms = this.parent.querySelectorAll('[data-keychain]');
            this.output = {};
            var isValid = true;
            _.forEach(elms, function (elm) {
                var errors = [];
                var keyList = elm.getAttribute('data-keychain').split('.');
                var lastKey = keyList.pop();
                var keyChain = keyList.join('.');
                var jsKeychain = _this7.jsKeychain(keyChain);

                var model = void 0;
                jsKeychain ? model = eval('self.form.' + jsKeychain) : model = _this7.form;
                model = model[lastKey];

                /**
                * Validation
                * TODO add validation for all types
                * TODO merge with onchange validation
                * return if no value. otherwise, loop through given validation on this model
                * and collect those who return false and set error class on wrapper parent
                */
                var val = elm.getAttribute('elm-value');

                if (model.required && !val) {
                    errors.push('required');
                }

                if (model.validation) {
                    model.validation.forEach(function (item) {
                        !self.validators[item](val) && errors.push(item);
                    });
                }
                if (errors.length) {
                    var formGroup = Utils.findAncestor(elm, 'form-group');
                    Utils.setClass(formGroup, 'has-error');
                    isValid = false;
                }
                // Locate the right object in the output and add the value to it
                // if no jsKeychain we are on the first level of the object so we just return the whole output object
                var parentObj = void 0;
                jsKeychain ? parentObj = eval('self.output.' + jsKeychain) : parentObj = _this7.output;
                parentObj[lastKey] = val;
            });

            deepRemoveKeys(this.output, ['_order', '_name', '_toggle']);
            if (!isValid) {
                return false;
            }
            return this.output;
        }
    }, {
        key: 'setData',
        value: function setData(obj) {

            //TODO consider saving orginal schema and use for set data to prevent doubles if setData is done twice
            var self = this;
            this.firstLoop = true;
            this.currentKey = null;

            // Get keychains from the populated form
            var keychains = this.getAllKeychains();

            // obj can have populated lists but schema only defines one item so...
            // Iterate through keychains. and update schema for array's
            for (var i = 0; i < keychains.length; i++) {
                var keyChain = keychains[i];
                var jsKeychain = this.jsKeychain(keyChain);
                var val = void 0;
                try {
                    val = eval('obj.' + jsKeychain);
                } catch (err) {
                    val = null;
                }
                if (Utils.isArrey(val)) {
                    this.pushArrayObject(keyChain, val);
                }
                if (val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) !== 'object') {
                    var parentObj = eval('self.form.' + jsKeychain);
                    parentObj['value'] = val;
                }
            }

            this.parent.innerHTML = '';
            this.buildAllItems(this.form, this.parent);
        }
    }]);

    return FormGenerator;
}();

var SchemaDiscover = function SchemaDiscover(json) {
    _classCallCheck(this, SchemaDiscover);
};