;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Loader = factory();
  }
}(this, function() {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ------------------------------------------------------------------------
 * Loading creates a full sheet overlay with hypnotic balls
 * ------------------------------------------------------------------------
 */
var Loader = function () {

    /**
     * ------------------------------------------------------------------------
     * Constants
     *
     * ------------------------------------------------------------------------
     */
    var Templates = [];
    Templates.push('\n      <div class="sl-container">\n         <style scoped>\n         .simpleLoader {\n             position: fixed;\n             top: 0;\n             left: 0;\n             right: 0;\n             bottom: 0;\n             background: rgba(0, 0, 0, 0.36);\n             z-index: 9999;\n         }\n         .simpleLoader .sl-container {\n             position: absolute;\n             top: 50%;\n             left: 50%;\n             -webkit-transform: translate(-50%, -50%);\n             transform: translate(-50%, -50%);\n         }\n         .simpleLoader .sl-dot {\n             width: 20px;\n             height: 20px;\n             border: 2px solid white;\n             border-radius: 50%;\n             float: left;\n             margin: 0 5px;\n             -webkit-transform: scale(0);\n             transform: scale(0);\n             -webkit-animation: fx 1000ms ease infinite 0ms;\n             animation: fx 1000ms ease infinite 0ms;\n         }\n         .simpleLoader .sl-dot:nth-child(2) {\n             -webkit-animation: fx 1000ms ease infinite 300ms;\n             animation: fx 1000ms ease infinite 300ms;\n         }\n         .simpleLoader .sl-dot:nth-child(3) {\n             -webkit-animation: fx 1000ms ease infinite 600ms;\n             animation: fx 1000ms ease infinite 600ms;\n         }\n         @-webkit-keyframes fx {\n             50% {\n                 -webkit-transform: scale(1);\n                 transform: scale(1);\n                 opacity: 1;\n             }\n             100% {\n                 opacity: 0;\n             }\n         }\n         @keyframes fx {\n             50% {\n                 -webkit-transform: scale(1);\n                 transform: scale(1);\n                 opacity: 1;\n             }\n             100% {\n                 opacity: 0;\n             }\n         }\n         </style>\n         <div class="sl-dot"></div>\n         <div class="sl-dot"></div>\n         <div class="sl-dot"></div>\n       </div>\n     ');

    // Material design circular activity spinner
    // This is the built in chrome spinner and might fail in other browsers
    Templates.push('\n    <div class="loaderWrapper">\n        <svg version="1" xmlns="http://www.w3.org/2000/svg"\n                         xmlns:xlink="http://www.w3.org/1999/xlink"\n             width="25px" height="25px" viewBox="0 0 16 16">\n            <style scoped>\n              .simpleLoader {\n                  position: absolute;\n                  left: 50%;\n                  top: 50%;\n                  transform: translate(-50%, -50%);\n                  z-index: 1000;\n              }\n              .qp-circular-loader {\n                width:16px;  /* 2*RADIUS + STROKEWIDTH */\n                height:16px; /* 2*RADIUS + STROKEWIDTH */\n              }\n              .qp-circular-loader-path {\n                stroke-dasharray: 32.4;  /* 2*RADIUS*PI * ARCSIZE/360 */\n                stroke-dashoffset: 32.4; /* 2*RADIUS*PI * ARCSIZE/360 */\n                                         /* hides things initially */\n              }\n              /* SVG elements seem to have a different default origin */\n              .qp-circular-loader, .qp-circular-loader * {\n                -webkit-transform-origin: 50% 50%;\n              }\n              /* Rotating the whole thing */\n              @-webkit-keyframes rotate {\n                from {transform: rotate(0deg);}\n                to {transform: rotate(360deg);}\n              }\n              .qp-circular-loader {\n                -webkit-animation-name: rotate;\n                -webkit-animation-duration: 1568.63ms; /* 360 * ARCTIME / (ARCSTARTROT + (360-ARCSIZE)) */\n                -webkit-animation-iteration-count: infinite;\n                -webkit-animation-timing-function: linear;\n              }\n              /* Filling and unfilling the arc */\n              @-webkit-keyframes fillunfill {\n                from {\n                  stroke-dashoffset: 32.3 /* 2*RADIUS*PI * ARCSIZE/360 - 0.1 */\n                                          /* 0.1 a bit of a magic constant here */\n                }\n                50% {\n                  stroke-dashoffset: 0;\n                }\n                to {\n                  stroke-dashoffset: -31.9 /* -(2*RADIUS*PI * ARCSIZE/360 - 0.5) */\n                                           /* 0.5 a bit of a magic constant here */\n                }\n              }\n              @-webkit-keyframes rot {\n                from {\n                  transform: rotate(0deg);\n                }\n                to {\n                  transform: rotate(-360deg);\n                }\n              }\n              @-webkit-keyframes colors {\n                from {\n                  stroke: #4285f4;\n                }\n                to {\n                  stroke: #4285f4;\n                }\n              }\n              .qp-circular-loader-path {\n                -webkit-animation-name: fillunfill, rot, colors;\n                -webkit-animation-duration: 1333ms, 5332ms, 5332ms; /* ARCTIME, 4*ARCTIME, 4*ARCTIME */\n                -webkit-animation-iteration-count: infinite, infinite, infinite;\n                -webkit-animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), steps(4), linear;\n                -webkit-animation-play-state: running, running, running;\n                -webkit-animation-fill-mode: forwards;\n              }\n            </style>\n            <!-- 2.25= STROKEWIDTH -->\n            <!-- 8 = RADIUS + STROKEWIDTH/2 -->\n            <!-- 6.875= RADIUS -->\n            <!-- 1.125=  STROKEWIDTH/2 -->\n            <g class="qp-circular-loader">\n            <path class="qp-circular-loader-path" fill="none"\n                  d="M 8,1.125 A 6.875,6.875 0 1 1 1.125,8" stroke-width="2.25"\n                  stroke-linecap="round"></path>\n            </g>\n            </svg>\n        </div>\n    ');

    var Default = {
        template: '0', // 0 or 1
        parent: document.body,
        allowMany: false
    };

    var Loader = function () {
        function Loader(options) {
            _classCallCheck(this, Loader);

            this.id = 'loader-' + ++this.__proto__.counter;
            this.defaults = Utils.extend(Default, options);
            if (!this.defaults.allowMany) {
                this.__proto__.removeAll();
            }
            this.__proto__.instances[this.id] = this;
            this.createDOM();
        }

        _createClass(Loader, [{
            key: 'createDOM',
            value: function createDOM() {
                var wrapper = document.createElement('div');
                wrapper.id = this.id;
                wrapper.className = 'simpleLoader';
                wrapper.innerHTML = Templates[this.defaults.template];
                this.defaults.parent.appendChild(wrapper);
            }
        }, {
            key: 'remove',
            value: function remove() {
                var loader = document.querySelector('#' + this.id);
                loader.parentNode.removeChild(loader);
                delete this.__proto__.instances[this.id];
            }
        }]);

        return Loader;
    }();

    return Loader;
}();
Loader.prototype.instances = {};
Loader.prototype.counter = 0;
Loader.prototype.removeAll = function () {
    Utils.foreach(this.instances, function (item) {
        try {
            item.remove();
        } catch (err) {
            //pass
        }
    });
    this.instances.length = 0;
};
return Loader;
}));
