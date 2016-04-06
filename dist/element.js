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

	module.exports = __webpack_require__(3);


/***/ },
/* 1 */,
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

/***/ }
/******/ ]);
//# sourceMappingURL=element.js.map