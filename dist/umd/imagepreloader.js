;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Imagepreloader = factory();
  }
}(this, function() {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * ------------------------------------------------------------------------
 * Image preloader
 * example:
 *
 * a = new Preloader([
 * 'https://stopiniceland.is/icloud/images/bokundev/87l1477058801.jpeg?size=550x_',
 * 'https://stopiniceland.is/icloud/images/bokundev/37l1477058511.jpeg?size=550x_',
 * 'https://stopiniceland.is/icloud/images/bokundev/181l1477059083.jpeg?size=550x_'
 * ]);
 *
 * a.on('each', function(rsp) {console.log(rsp)})
 * a.on('done', function(rsp){ console.log(rsp)});
 * ------------------------------------------------------------------------
 */

var Preloader = function () {
    var Preloader = function (_Emitter) {
        _inherits(Preloader, _Emitter);

        function Preloader(pathList, options) {
            _classCallCheck(this, Preloader);

            var _this = _possibleConstructorReturn(this, (Preloader.__proto__ || Object.getPrototypeOf(Preloader)).call(this));

            _this.defaults = {
                prefix: null
            };
            _.extend(_this.defaults, options);

            _this.pathList = pathList;
            _this.loadedImages = [];
            _this.total = _this.pathList.length;
            _this.counter = 0;
            _this.percent = 0;

            _this.loadImages();
            return _this;
        }

        _createClass(Preloader, [{
            key: 'loadImages',
            value: function loadImages() {
                var _this2 = this;

                var self = this;
                for (var i = 0; i < this.pathList.length; i++) {
                    try {
                        var img = this.loadedImages[i] = document.createElement('img');
                        if (this.defaults.prefix) {
                            //add trailing slash if doesn't exists
                            var prefix = this.defaults.prefix.replace(/\/?$/, '/');
                        } else {
                            prefix = '';
                        }

                        img.onload = function () {
                            _this2.counter++;
                            _this2.percent = _this2.counter / _this2.total * 100;

                            _this2.trigger('each', _this2.counter, _this2.percent);
                            if (_this2.counter === _this2.total) {
                                _this2.trigger('done', _this2.loadedImages);
                            }
                        };

                        img.onerror = function (err) {
                            //prevent component from stoping if last image is not found
                            _this2.counter++;
                            if (_this2.total === _this2.counter) {
                                _this2.trigger('each', _this2.counter, 100);
                                _this2.trigger('done', _this2.loadedImages);
                            }
                        };
                        img.src = prefix + this.pathList[i];
                    } catch (err) {
                        console.warn(err);
                    }
                }
            }
        }]);

        return Preloader;
    }(Emitter);

    return Preloader;
}();
return Imagepreloader;
}));
