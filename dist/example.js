/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(5);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(2);
	
	var utils = _interopRequireWildcard(_utils);
	
	var _element = __webpack_require__(3);
	
	var _element2 = _interopRequireDefault(_element);
	
	var _styles = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var STYLES = _styles.MODAL_CSS + _styles.ALERT_CSS;
	
	/**
	 * ------------------------------------------------------------------------
	 * Modal
	 * Creates Modal
	 * ------------------------------------------------------------------------
	 */
	
	var Alert = function () {
	    function Alert(type, options) {
	        _classCallCheck(this, Alert);
	
	        var args = arguments;
	        if (args[0] !== 'success' && args[0] !== 'info' && args[0] !== 'danger') {
	            type = 'success';
	            options = {
	                message: args[0]
	            };
	        } else if (typeof args[0] === 'string' && typeof args[1] === 'string') {
	            options = {
	                message: args[1]
	            };
	        }
	        this.type = type;
	        this.defaults = {
	            message: '',
	            theme: 'classic',
	            customClass: 'js_alert',
	            withBackdrop: false,
	            size: 'large', //large small
	            closeOthers: false,
	            timer: 3000,
	            title: '',
	            onClose: function onClose() {},
	            onOpen: function onOpen() {}
	        };
	
	        this.defaults = utils.extend(this.defaults, options);
	        this.parent = document.body;
	
	        if (this.defaults.closeOthers) this.__proto__.closeAll();
	        this.__proto__.instances.push(this);
	        this.buildTemplate();
	        this._injectTemplate();
	        if (this.defaults.autoClose) this.autoClose();
	
	        this._injectStyles();
	    }
	
	    _createClass(Alert, [{
	        key: 'autoClose',
	        value: function autoClose() {
	            var _this = this;
	
	            setTimeout(function () {
	                _this.close();
	            }, this.defaults.autoCloseTime);
	        }
	    }, {
	        key: 'buildTemplate',
	        value: function buildTemplate() {
	            var _this2 = this;
	
	            var sizeMap = {
	                'small': 'js_modal-sm',
	                'normal': '',
	                'large': 'js_modal-lg'
	            };
	            var sizeClass = sizeMap[this.defaults.size];
	
	            if (this.defaults.withBackdrop) {
	                this.backdrop = new _element2.default('div.modal-backdrop', document.body);
	            }
	
	            var header = this.defaults.title ? '<div class="modal-header">\n                    <button type="button" class="close"><span>×</span></button>\n                    <h4 class="modal-title" id="myModalLabel">' + this.defaults.title + '</h4>\n                </div>' : '<button type="button" class="close standalone"><span>×</span></button>';
	
	            var main = '\n                <div class="js_modal fadeInDown">\n                    <div class="js_dialog ' + sizeClass + '">\n                        <div class="modal-content">\n                            ' + header + '\n                            <div class="modal-body">\n                                <div>' + this.defaults.message + '</div>\n                            </div>\n                        </div>\n                    </div>\n                </div>';
	
	            this.modal = new _element2.default('div', {
	                html: main, 'class': 'modal-theme-' + this.defaults.theme + ' js_' + this.type,
	                cls: this.defaults.customClass
	            });
	
	            var btn = this.modal.querySelector('.close');
	            this.chainDialog = this.modal.querySelector('.js_dialog');
	            btn.onclick = function () {
	                _this2.close();
	            };
	            if (this.defaults.type === 'modal') {
	                utils.setClass(document.body, 'modal-mode');
	            }
	        }
	    }, {
	        key: '_injectTemplate',
	        value: function _injectTemplate() {
	            this.parent = document.querySelector('.js_alerts') || new _element2.default('div.js_alerts', document.body);
	            this.parent.appendChild(this.modal);
	        }
	    }, {
	        key: '_injectStyles',
	        value: function _injectStyles() {
	            if (!document.querySelector('.styleFallback')) {
	                new _element2.default('style.styleFallback', {
	                    html: STYLES
	                }, document.body);
	            }
	        }
	    }, {
	        key: '_close',
	        value: function _close() {
	            var _this3 = this;
	
	            var cb = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];
	
	            if (this.defaults.withBackdrop) {
	                utils.fadeOutRemove(this.backdrop);
	            }
	            utils.setClass(this.chainDialog, 'fadeOutTop');
	            setTimeout(function () {
	                _this3.modal.remove();
	                utils.removeClass(document.body, 'modal-mode');
	                cb();
	            }, 500);
	        }
	    }, {
	        key: 'close',
	        value: function close() {
	            this._close(this.defaults.onClose);
	        }
	    }]);
	
	    return Alert;
	}();
	
	Alert.prototype.instances = [];
	Alert.prototype.closeAll = function () {
	    this.instances.forEach(function (item) {
	        item._close();
	    });
	    this.instances.length = 0;
	};
	
	exports.default = Alert;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * ------------------------------------------------------------------------
	 * Utilities
	 * ------------------------------------------------------------------------
	 */
	
	var normalizeElement = exports.normalizeElement = function normalizeElement(element) {
	    function isElement(obj) {
	        return (obj[0] || obj).nodeType;
	    }
	
	    if (isElement(element)) {
	        return element;
	    }
	    if (typeof jQuery !== 'undefined') {
	        if (element instanceof jQuery) return element[0];
	    }
	    if (typeof element === 'string') {
	        return document.querySelector(element) || document.querySelector('#' + element) || document.querySelector('.' + element);
	    }
	};
	
	var setClass = exports.setClass = function setClass(el, className) {
	    //credit: http://youmightnotneedjquery.com/
	    if (el.classList) el.classList.add(className);else el.className += ' ' + className;
	};
	
	var removeClass = exports.removeClass = function removeClass(el, className) {
	    //credit: http://youmightnotneedjquery.com/
	    if (el.classList) el.classList.remove(className);else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	};
	
	var fadeOutRemove = exports.fadeOutRemove = function fadeOutRemove(el) {
	    el.style.transition = 'ease opacity 0.5s';
	    el.style.webkitTransition = 'ease opacity 0.5s';
	    el.style.opacity = 0;
	    setTimeout(function () {
	        el.remove();
	    }, 500);
	};
	
	//extend Object
	var extend = exports.extend = function extend() {
	    for (var i = 1; i < arguments.length; i++) {
	        for (var key in arguments[i]) {
	            if (arguments[i].hasOwnProperty(key)) arguments[0][key] = arguments[i][key];
	        }
	    }return arguments[0];
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(2);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * ------------------------------------------------------------------------
	 * Element generator check out the standalone version for docs
	 * https://github.com/Andrinoid/ElementGenerator.js
	 * ------------------------------------------------------------------------
	 */
	
	var Elm = function () {
	    //Simple element generator. Mootools style
	    //tries to find method for keys in options and run it
	
	    function Elm(type, options, parent) {
	        _classCallCheck(this, Elm);
	
	        function isElement(obj) {
	            return (obj[0] || obj).nodeType;
	        }
	
	        var args = arguments;
	        if (isElement(args[1] || {}) || typeof args[1] === 'string') {
	            options = {};
	            parent = args[1];
	        }
	
	        this.element = null;
	        if (type.indexOf('.') > -1) {
	            var separated = type.split('.');
	            var stype = separated[0];
	            var clsName = separated[1];
	            this.element = document.createElement(stype);
	            this._setClass(this.element, clsName);
	        } else {
	            this.element = document.createElement(type);
	        }
	        this.options = options || {};
	
	        for (var key in this.options) {
	            if (!this.options.hasOwnProperty(key)) {
	                continue;
	            }
	            var val = this.options[key];
	            try {
	                if (key === 'class') //fix for class name conflict
	                    key = 'cls';
	                this[key](val);
	            } catch (err) {
	                //pass
	            }
	        }
	
	        if (parent) {
	            this.inject(parent);
	        }
	
	        return this.element;
	    }
	
	    _createClass(Elm, [{
	        key: '_setClass',
	        value: function _setClass(el, className) {
	            //Method credit http://youmightnotneedjquery.com/
	            if (el.classList) {
	                el.classList.add(className);
	            } else {
	                el.className += ' ' + className;
	            }
	        }
	    }, {
	        key: 'cls',
	        value: function cls(value) {
	            var _this = this;
	
	            //Name can be comma or space separated values e.q 'foo, bar'
	            //Even if one class name is given we clean the string and end up with array
	            var clsList = value.replace(/[|&;$%@"<>()+,]/g, "").split(' ');
	
	            clsList.forEach(function (name) {
	                _this._setClass(_this.element, name);
	            });
	        }
	    }, {
	        key: 'id',
	        value: function id(value) {
	            this.element.id = value;
	        }
	    }, {
	        key: 'html',
	        value: function html(str) {
	            this.element.innerHTML = str;
	        }
	    }, {
	        key: 'text',
	        value: function text(str) {
	            this.element.innerText = str;
	        }
	    }, {
	        key: 'css',
	        value: function css(obj) {
	            for (var prop in obj) {
	                if (!obj.hasOwnProperty(prop)) {
	                    continue;
	                }
	                this.element.style[prop] = obj[prop];
	            }
	        }
	    }, {
	        key: 'click',
	        value: function click(fn) {
	            this.element.addEventListener('click', function () {
	                fn();
	            });
	        }
	    }, {
	        key: 'inject',
	        value: function inject(to) {
	            var parent = (0, _utils.normalizeElement)(to);
	            parent.appendChild(this.element);
	        }
	    }]);
	
	    return Elm;
	}();
	
	exports.default = Elm;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var MODAL_CSS = exports.MODAL_CSS = "\n        /* Modal styles */\n         body.modal-mode {\n             overflow: hidden\n         }\n         .modal-body,\n         .modal-title {\n             font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n             line-height: 1.42857143;\n             color: #333\n         }\n         .js_modal,\n         .modal-backdrop {\n             position: fixed;\n             top: 0;\n             right: 0;\n             bottom: 0;\n             left: 0\n         }\n         .modal-backdrop {\n             z-index: 1040;\n             background-color: #000;\n             opacity: .5\n         }\n\n         .js_modal {\n             z-index: 10000;\n             overflow-y: scroll;\n             -webkit-overflow-scrolling: touch;\n             outline: 0\n         }\n         .js_dialog {\n             position: relative;\n             width: auto;\n             margin: 10px\n         }\n         .modal-header .close {\n             margin-top: -2px;\n             position: static;\n             height: 30px;\n         }\n         .modal-theme-blue .close {\n             text-shadow: none;\n             opacity: 1;\n             font-size: 31px;\n             font-weight: normal;\n         }\n         .modal-theme-blue .close span {\n             color: white;\n         }\n         .modal-theme-blue .close span:hover {\n             color: #fbc217;\n         }\n         .close.standalone {\n             position: absolute;\n             right: 15px;\n             top: 13px;\n             z-index: 1;\n             height: 30px;\n         }\n         .modal-title {\n             margin: 0;\n             font-size: 18px;\n             font-weight: 500\n         }\n         button.close {\n             -webkit-appearance: none;\n             padding: 0;\n             cursor: pointer;\n             background: 0 0;\n             border: 0\n         }\n         .modal-content {\n             position: relative;\n             background-color: #fff;\n             background-clip: padding-box;\n             border: 1px solid #999;\n             border: 1px solid rgba(0, 0, 0, .2);\n             border-radius: 2px;\n             outline: 0;\n             box-shadow: 0 3px 9px rgba(0, 0, 0, .5)\n         }\n         .modal-theme-blue .modal-content {\n            background-color: #4a6173;\n         }\n         .modal-header {\n             min-height: 16.43px;\n             padding: 15px;\n             border-bottom: 1px solid #e5e5e5;\n             min-height: 30px\n         }\n         .modal-theme-blue .modal-header {\n            border-bottom: none;\n         }\n         .modal-body {\n             position: relative;\n             padding: 15px;\n             font-size: 14px\n         }\n         .close {\n             float: right;\n             font-size: 21px;\n             font-weight: 700;\n             line-height: 1;\n             color: #000;\n             text-shadow: 0 1px 0 #fff;\n             opacity: .2\n         }\n         @media (min-width: 768px) {\n             .js_dialog {\n                 width: 600px;\n                 margin: 30px auto\n             }\n             .modal-content {\n                 box-shadow: 0 5px 15px rgba(0, 0, 0, .5)\n             }\n             .js_modal-sm {\n                 width: 300px\n             }\n         }\n         @media (min-width: 992px) {\n             .js_modal-lg {\n                 width: 900px\n             }\n         }\n\n         .ghost-focus {\n             background: transparent;\n             z-index: 1000;\n         }\n\n\n         /*** Animations ***/\n         @-webkit-keyframes fadeInDown {\n             from {\n                 opacity: 0;\n                 -webkit-transform: translate3d(0, -10px, 0);\n                 transform: translate3d(0, -10px, 0);\n             }\n             to {\n                 opacity: 1;\n                 -webkit-transform: none;\n                 transform: none;\n             }\n         }\n         @keyframes fadeInDown {\n             from {\n                 opacity: 0;\n                 -webkit-transform: translate3d(0, -10px, 0);\n                 transform: translate3d(0, -10px, 0);\n             }\n             to {\n                 opacity: 1;\n                 -webkit-transform: none;\n                 transform: none;\n             }\n         }\n         @-webkit-keyframes fadeInTop {\n             from {\n                 opacity: 0;\n                 -webkit-transform: translate3d(0, 10px, 0);\n                 transform: translate3d(0, 10px, 0);\n             }\n             to {\n                 opacity: 1;\n                 -webkit-transform: none;\n                 transform: none;\n             }\n         }\n         @keyframes fadeInTop {\n             from {\n                 opacity: 0;\n                 -webkit-transform: translate3d(0, 10px, 0);\n                 transform: translate3d(0, 10px, 0);\n             }\n             to {\n                 opacity: 1;\n                 -webkit-transform: none;\n                 transform: none;\n             }\n         }\n         @-webkit-keyframes fadeOutTop {\n             0% {\n                 opacity: 1;\n                 -webkit-transform: none;\n                 transform: none\n             }\n             100% {\n                 opacity: 0;\n                 -webkit-transform: translate3d(0, -10px, 0);\n                 transform: translate3d(0, -10px, 0)\n             }\n         }\n         @keyframes fadeOutTop {\n             0% {\n                 opacity: 1;\n                 -webkit-transform: none;\n                 transform: none\n             }\n             100% {\n                 opacity: 0;\n                 -webkit-transform: translate3d(0, -10px, 0);\n                 transform: translate3d(0, -10px, 0)\n             }\n         }\n         @-webkit-keyframes fadeInLeft {\n             from {\n                 opacity: 0;\n                 -webkit-transform: translate3d(-10px, 0, 0);\n                 transform: translate3d(-10px, 0, 0);\n             }\n             to {\n                 opacity: 1;\n                 -webkit-transform: none;\n                 transform: none;\n             }\n         }\n         @keyframes fadeInLeft {\n             from {\n                 opacity: 0;\n                 -webkit-transform: translate3d(-10px, 0, 0);\n                 transform: translate3d(-10px, 0, 0);\n             }\n             to {\n                 opacity: 1;\n                 -webkit-transform: none;\n                 transform: none;\n             }\n         }\n         @-webkit-keyframes fadeInRight {\n             from {\n                 opacity: 0;\n                 -webkit-transform: translate3d(10px, 0, 0);\n                 transform: translate3d(10px, 0, 0);\n             }\n             to {\n                 opacity: 1;\n                 -webkit-transform: none;\n                 transform: none;\n             }\n         }\n         @keyframes fadeInRight {\n             from {\n                 opacity: 0;\n                 -webkit-transform: translate3d(10px, 0, 0);\n                 transform: translate3d(10px, 0, 0);\n             }\n             to {\n                 opacity: 1;\n                 -webkit-transform: none;\n                 transform: none;\n             }\n         }\n         .fadeInDown,\n         .fadeInLeft,\n         .fadeInRight,\n         .fadeInTop,\n         .fadeOutTop{\n             -webkit-animation-fill-mode: both;\n             -webkit-animation-duration: .5s;\n             animation-duration: .5s;\n             animation-fill-mode: both;\n         }\n         .fadeInDown {\n             -webkit-animation-name: fadeInDown;\n             animation-name: fadeInDown;\n         }\n         .fadeInLeft {\n             -webkit-animation-name: fadeInLeft;\n             animation-name: fadeInLeft;\n         }\n         .fadeInRight {\n             -webkit-animation-name: fadeInRight;\n             animation-name: fadeInRight;\n         }\n         .fadeInTop {\n             -webkit-animation-name: fadeInTop;\n             animation-name: fadeInTop;\n         }\n         .fadeOutTop {\n             -webkit-animation-name: fadeOutTop;\n             animation-name: fadeOutTop;\n         }";
	
	var ALERT_CSS = exports.ALERT_CSS = "\n        /* Alert styles */\n        .js_alerts {\n            position: absolute;\n            top: 0;\n            left: 0;\n            bottom: 0;\n            right: 0;\n            pointer-events: none;\n        }\n        .js_alerts .js_dialog {\n            pointer-events: all;\n        }\n        .js_alerts .js_alert .js_modal {\n            overflow-y: auto;\n            position: static;\n        }\n        .js_alerts .js_alert .modal-content {\n            padding: 20px;\n            margin: 20px 0;\n            border: 1px solid #eeeeee;\n            border-left-width: 5px;\n            border-radius: 3px;\n            font: inherit;\n        }\n        .js_alerts .js_success .modal-content{\n            border-left-color: #5bc0de;\n        }\n        .js_alerts .js_danger .modal-content{\n            border-left-color: #d9534f;\n        }\n        .js_alerts .js_info .modal-content{\n            border-left-color: #f0ad4e;\n        }\n\n        ";

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _alert = __webpack_require__(1);
	
	var _alert2 = _interopRequireDefault(_alert);
	
	var _modal = __webpack_require__(6);
	
	var _modal2 = _interopRequireDefault(_modal);
	
	var _element = __webpack_require__(3);
	
	var _element2 = _interopRequireDefault(_element);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	window.Alert = _alert2.default;
	window.Modal = _modal2.default;
	window.Elm = _element2.default;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(2);
	
	var utils = _interopRequireWildcard(_utils);
	
	var _element = __webpack_require__(3);
	
	var _element2 = _interopRequireDefault(_element);
	
	var _styles = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * ------------------------------------------------------------------------
	 * Modal
	 * Creates Modal
	 * ------------------------------------------------------------------------
	 */
	
	var Modal = function () {
	    function Modal(options) {
	        _classCallCheck(this, Modal);
	
	        this.defaults = {
	            title: '',
	            message: '',
	            theme: 'classic',
	            withBackdrop: true,
	            size: 'normal', //large small
	            customClass: '',
	            onClose: function onClose() {},
	            onOpen: function onOpen() {},
	            closeOthers: true,
	            autoClose: false,
	            autoCloseTime: 2000,
	            type: 'modal'
	        };
	        this.defaults = utils.extend(this.defaults, options);
	        this.parent = document.body;
	        this.STYLES = _styles.MODAL_CSS;
	
	        if (this.defaults.closeOthers) this.__proto__.closeAll();
	        this.__proto__.instances.push(this);
	        this.buildTemplate();
	        this._injectTemplate();
	        if (this.defaults.autoClose) this.autoClose();
	
	        this._injectStyles();
	    }
	
	    _createClass(Modal, [{
	        key: 'autoClose',
	        value: function autoClose() {
	            var _this = this;
	
	            setTimeout(function () {
	                _this.close();
	            }, this.defaults.autoCloseTime);
	        }
	    }, {
	        key: 'buildTemplate',
	        value: function buildTemplate() {
	            var _this2 = this;
	
	            var sizeMap = {
	                'small': 'js_modal-sm',
	                'normal': '',
	                'large': 'js_modal-lg'
	            };
	            var sizeClass = sizeMap[this.defaults.size];
	
	            if (this.defaults.withBackdrop) {
	                this.backdrop = new _element2.default('div.modal-backdrop', document.body);
	            }
	
	            var header = this.defaults.title ? '<div class="modal-header">\n                    <button type="button" class="close"><span>×</span></button>\n                    <h4 class="modal-title" id="myModalLabel">' + this.defaults.title + '</h4>\n                </div>' : '<button type="button" class="close standalone"><span>×</span></button>';
	
	            var main = '\n                <div class="js_modal fadeInDown">\n                    <div class="js_dialog ' + sizeClass + '">\n                        <div class="modal-content">\n                            ' + header + '\n                            <div class="modal-body">\n                                <div>' + this.defaults.message + '</div>\n                            </div>\n                        </div>\n                    </div>\n                </div>';
	
	            this.modal = new _element2.default('div', {
	                html: main, 'class': 'modal-theme-' + this.defaults.theme,
	                cls: this.defaults.customClass
	            });
	
	            var btn = this.modal.querySelector('.close');
	            this.chainDialog = this.modal.querySelector('.js_dialog');
	            btn.onclick = function () {
	                _this2.close();
	            };
	            if (this.defaults.type === 'modal') {
	                utils.setClass(document.body, 'modal-mode');
	            }
	        }
	    }, {
	        key: '_injectTemplate',
	        value: function _injectTemplate() {
	            this.parent.appendChild(this.modal);
	        }
	    }, {
	        key: '_injectStyles',
	        value: function _injectStyles() {
	            if (!document.querySelector('.styleFallback')) {
	                new _element2.default('style.styleFallback', {
	                    html: this.STYLES
	                }, document.body);
	            }
	        }
	    }, {
	        key: '_close',
	        value: function _close() {
	            var _this3 = this;
	
	            var cb = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];
	
	            if (this.defaults.withBackdrop) {
	                utils.fadeOutRemove(this.backdrop);
	            }
	            utils.setClass(this.chainDialog, 'fadeOutTop');
	            setTimeout(function () {
	                _this3.modal.remove();
	                utils.removeClass(document.body, 'modal-mode');
	                cb();
	            }, 500);
	        }
	    }, {
	        key: 'close',
	        value: function close() {
	            this._close(this.defaults.onClose);
	        }
	    }]);
	
	    return Modal;
	}();
	
	Modal.prototype.instances = [];
	Modal.prototype.closeAll = function () {
	    this.instances.forEach(function (item) {
	        item._close();
	    });
	    this.instances.length = 0;
	};
	
	exports.default = Modal;

/***/ }
/******/ ]);
//# sourceMappingURL=example.js.map