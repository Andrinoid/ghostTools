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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var inline = new Inline();

var Droppadstyles = '\n\n    .imageCloud {\n        position: relative;\n        background-size: cover;\n        background-position: 50% 50%;\n        cursor: pointer;\n        font-family: arial, serif;\n        min-height: 200px;\n    }\n    .imageCloud input {\n        position: absolute;\n        top: 0;\n        right: 0;\n        bottom: 0;\n        left: 0;\n    }\n    .imageCloud .dropSheet {\n        position: absolute;\n        top: 0;\n        bottom: 0;\n        left: 0;\n        right: 0;\n        background: rgba(0, 0, 0, 0.5);\n        text-align: center;\n        padding: 10px;\n        opacity: 0;\n        transition: ease all 0.5s;\n        pointer-events: none;\n    }\n\n    .imageCloud .dropSheet.shown {\n        background: rgba(0, 0, 0, 0);\n        opacity: 1;\n    }\n\n    .imageCloud:hover .dropSheet {\n        background: rgba(0, 0, 0, 0.5);\n        opacity: 1;\n    }\n\n    .imageCloud .dropSheet > div {\n        padding: 10px;\n        color: white;\n        border: dashed 2px #fff;\n        position: absolute;\n        top: 10px;\n        bottom: 10px;\n        left: 10px;\n        right: 10px;\n    }\n\n    .imageCloud .dropSheet > div .dropLabel {\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        transform: translate(-50%, -50%);\n        white-space: nowrap;\n    }\n\n    .imageCloud .dropSheet > div p {\n        font-size: 18px;\n    }\n\n    .imageCloud .fallBack {\n        position: absolute;\n        top: 0;\n        bottom: 0;\n        left: 0;\n        right: 0;\n        pointer-events: none;\n        background-color: gray;\n        background-size: cover;\n        background-position: center;\n    }\n\n    .imageCloud .loadedImage {\n        position: absolute;\n        top: 0;\n        bottom: 0;\n        left: 0;\n        right: 0;\n        pointer-events: none;\n        opacity: 0;\n        transition: ease opacity 0.5s;\n        background-size: cover;\n        background-position: center;\n    }\n    .droppad-input {\n        position: absolute;\n        top: 0;\n        left: 0;\n        height: 0;\n        width: 0;\n        visibility: hidden;\n    }\n';

var Droppad = function (_Emitter) {
    _inherits(Droppad, _Emitter);

    function Droppad(elm, options) {
        _classCallCheck(this, Droppad);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Droppad).call(this));

        _this.droppad = elm;
        _this.defaults = {
            url: 'http://kotturinn.com/icloud/upload/body/test',
            backgroundImage: null,
            //method: "post",
            maxFilesize: 256, //in MB TODO
            paramName: "file",
            includeStyles: true,
            acceptedFiles: 'jpeg, jpg, png, gif'
        };
        _this.defaults = Utils.extend(_this.defaults, options);
        _this.injectStyles();
        _this.createDOM();
        _this.setEvents();
        return _this;
    }

    _createClass(Droppad, [{
        key: 'createDOM',
        value: function createDOM() {
            var _this2 = this;

            Utils.setClass(this.droppad, 'imageCloud');
            Utils.setClass(this.droppad, 'droppad-clickable');
            var baseElements = '\n        <div class="fallBack" style="opacity: 1; background-image: url(\'\';);"></div>\n        <div class="loadedImage"></div>\n        <div class="dropSheet shown">\n            <div>\n                <div class="dropLabel"><p>Drop Image here.</p>\n                    <p>\n                        <small>or click here</small>\n                    </p>\n                </div>\n            </div>\n        </div>\n        ';
            this.droppad.innerHTML = baseElements;
            this.el_clickableInput = new Elm('input.droppad-input', {
                type: 'file',
                change: function change(e) {
                    var file = e.target.files[0];
                    _this2.showAsBackground(file);
                    //this.sendFile(file);
                    _this2.upload(e.target.files);
                }
            }, document.body);
            this.droppadElements();
        }
    }, {
        key: 'droppadElements',
        value: function droppadElements() {
            this.el_fallback = this.droppad.querySelector('.fallBack');
            this.el_loadedImage = this.droppad.querySelector('.loadedImage');
        }
    }, {
        key: 'injectStyles',
        value: function injectStyles() {
            //if styles exists do nothing
            if (document.getElementById('imagecloudStyles')) return;
            var tag = document.createElement('style');
            tag.type = 'text/css';
            tag.id = 'imagecloudStyles';
            if (tag.styleSheet) {
                tag.styleSheet.cssText = Droppadstyles;
            } else {
                tag.appendChild(document.createTextNode(Droppadstyles));
            }
            document.getElementsByTagName('head')[0].appendChild(tag);
        }
    }, {
        key: 'setEvents',
        value: function setEvents() {
            var _this3 = this;

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
                _this3.dragenter(e);
            };
            this.droppad.ondragover = function (e) {
                noPropagation(e);
                _this3.dragover(e);
            };
            this.droppad.ondragleave = function (e) {
                noPropagation(e);
                _this3.dragleave(e);
            };
            this.droppad.ondrop = function (e) {
                noPropagation(e);
                _this3.drop(e);
            };
            // add event to document and listen for droppad-clickable elements
            document.addEventListener('click', function (e) {
                var clsList = Array.prototype.slice.call(e.target.classList);
                if (clsList.indexOf('droppad-clickable') > -1) {
                    _this3.el_clickableInput.click();
                }
            });
        }
    }, {
        key: 'showAsBackground',
        value: function showAsBackground(file) {
            var _this4 = this;

            var reader = new FileReader();
            reader.onload = function (event) {
                _this4.el_loadedImage.style.backgroundImage = 'url(' + event.target.result + ')';
                _this4.el_loadedImage.style.opacity = 1;
                setTimeout(function () {
                    _this4.el_fallback.style.backgroundImage = 'url(' + event.target.result + ')';
                    _this4.el_fallback.style.opacity = 1;
                    _this4.el_loadedImage.style.opacity = 0;
                }, 500);
            };
            reader.readAsDataURL(file);
        }
    }, {
        key: 'isFileValid',
        value: function isFileValid(file) {
            var mimeType = file.type;
            var baseMimeType = file.type.split('/')[0];
            // check against defaults.acceptedFiles
            return !file.type.match('image.*');
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
            //this.upload(files);
        }
    }, {
        key: 'sendFile',
        value: function sendFile(file) {
            function progress(value) {
                console.log(value);
            }

            function callback(data) {
                console.log(data);
            }
            inline.upload(this.defaults.url, file, null, progress).run(callback);
        }
    }, {
        key: 'upload',
        value: function upload(files) {
            var headers = _defineProperty({
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': '*/*',
                'Cache-Control': null
            }, 'X-Requested-With', null);

            var formData = new FormData();
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (!this.isFileValid) {
                    continue;
                }
                formData.append('file', file, file.name); //file.name is not required Check server side implementation of this
            }
            var xhr = new XMLHttpRequest();
            xhr.open('POST', this.defaults.url, true);
            for (var key in headers) {
                xhr.setRequestHeader(key, headers[key]);
            }
            xhr.onload = function () {
                if (xhr.status === 200) {
                    console.log('file uploaded');
                } else {
                    console.log('ohh crap');
                }
            };
            xhr.send(formData);
        }
    }]);

    return Droppad;
}(Emitter);

//TODO
//change imagecloud to droppad or somthing unique
// add baseclass to given element
//add regular input for clickable area
//show progress on upload
//check filesize
//Image service should return full path as webkit-overflow-scrolling
//Check browser support
//do built in xhr requests
// change fallBack to more appropriate name
// deal with multiple files
return Droppad;
}));
