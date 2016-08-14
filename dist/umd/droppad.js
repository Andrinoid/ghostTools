;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Droppad = factory();
  }
}(this, function() {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var inline = new Inline();

var Droppad = function (_Emitter) {
    _inherits(Droppad, _Emitter);

    function Droppad(elm, options) {
        _classCallCheck(this, Droppad);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Droppad).call(this));

        _this.droppad = elm;
        _this.defaults = {
            url: 'http://kotturinn.com/icloud/upload/body/test',
            //method: "post",
            maxFilesize: 256, //in MB
            paramName: "file"
        };
        _this.defaults = Utils.extend(_this.defaults, options);
        _this.createDOM();
        _this.setEvents();
        return _this;
    }

    _createClass(Droppad, [{
        key: 'createDOM',
        value: function createDOM() {}
    }, {
        key: 'setEvents',
        value: function setEvents() {
            var _this2 = this;

            function noPropagation(e) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                if (e.preventDefault) {
                    e.preventDefault();
                }
            }
            this.droppad.ondragenter = function (e) {
                noPropagation(e);
                _this2.dragenter(e);
            };
            this.droppad.ondragover = function (e) {
                noPropagation(e);
                _this2.dragover(e);
            };
            this.droppad.ondragleave = function (e) {
                noPropagation(e);
                _this2.dragleave(e);
            };
            this.droppad.ondrop = function (e) {
                noPropagation(e);
                _this2.drop(e);
            };
        }
    }, {
        key: 'showAsBackground',
        value: function showAsBackground(file) {
            var _this3 = this;

            var reader = new FileReader();
            reader.onload = function (event) {
                console.log(event.target.result);
                var display = _this3.droppad.querySelector('.loadedImage');
                display.style.backgroundImage = 'url(' + event.target.result + ')';
                display.style.opacity = 1;
                // setTimeout(function() {
                //     var bgElm2 = self.parent.querySelector('.fallBack');
                //     bgElm2.style.backgroundImage = 'url(' + url + ')';
                //     bgElm2.style.opacity = 1;
                //     bgElm.style.opacity = 0;
                // }, 500);
            };
            reader.readAsDataURL(file);
        }
    }, {
        key: 'sendFile',
        value: function sendFile(file) {
            console.log('sending file');
            function progress(value) {
                console.log(value);
            }
            function callback(data) {
                console.log(data);
            }
            inline.upload(this.defaults.url, file, null, progress).run(callback);
        }
    }, {
        key: 'dragenter',
        value: function dragenter(e) {
            Utils.setClass(this.droppad, 'dragenter');
            this.trigger('dragenter', e);
        }
    }, {
        key: 'dragover',
        value: function dragover(e) {
            Utils.removeClass(this.droppad, 'dragover');
            this.trigger('dragover', e);
        }
    }, {
        key: 'dragleave',
        value: function dragleave(e) {
            Utils.removeClass(this.droppad, 'dragover');
            this.trigger('dragenter', e);
        }
    }, {
        key: 'drop',
        value: function drop(e) {
            Utils.removeClass(this.droppad, 'dragover');
            this.trigger('dragenter', e);
            var files = e.target.files || e.dataTransfer.files;
            var file = files[0];
            console.log(file);
            this.showAsBackground(file);
            this.sendFile(file);
        }
    }]);

    return Droppad;
}(Emitter);
//TODO
//add regular input for clickable area
//show progress on upload
//Image service should return full path as webkit-overflow-scrolling
//Check browser support
return Droppad;
}));
