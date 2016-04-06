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

	module.exports = __webpack_require__(2);


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

/***/ }
/******/ ]);
//# sourceMappingURL=utils.js.map