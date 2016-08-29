'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Events
 * dragenter
 * dragover
 * ondragleave
 * drop
 * progress
 * success
 * error
 */
var Droppad = function () {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var STYLES = '\n        .imageCloud {\n            position: relative;\n            background-size: cover;\n            background-position: 50% 50%;\n            cursor: pointer;\n            font-family: arial, serif;\n            min-height: 200px;\n        }\n        .imageCloud input {\n            position: absolute;\n            top: 0;\n            right: 0;\n            bottom: 0;\n            left: 0;\n        }\n        .imageCloud .dropSheet {\n            position: absolute;\n            top: 0;\n            bottom: 0;\n            left: 0;\n            right: 0;\n            background: rgba(0, 0, 0, 0.5);\n            text-align: center;\n            padding: 10px;\n            opacity: 0;\n            transition: ease all 0.5s;\n            pointer-events: none;\n        }\n\n        .imageCloud .dropSheet.shown {\n            background: rgba(0, 0, 0, 0);\n            opacity: 1;\n        }\n\n        .imageCloud:hover .dropSheet {\n            background: rgba(0, 0, 0, 0.5);\n            opacity: 1;\n        }\n\n        .imageCloud .dropSheet > div {\n            padding: 10px;\n            color: white;\n            border: dashed 2px #fff;\n            position: absolute;\n            top: 10px;\n            bottom: 10px;\n            left: 10px;\n            right: 10px;\n        }\n\n        .imageCloud .dropSheet > div .dropLabel {\n            position: absolute;\n            top: 50%;\n            left: 50%;\n            transform: translate(-50%, -50%);\n            white-space: nowrap;\n        }\n\n        .imageCloud .dropSheet > div p {\n            font-size: 18px;\n        }\n\n        .imageCloud .fallBack {\n            position: absolute;\n            top: 0;\n            bottom: 0;\n            left: 0;\n            right: 0;\n            pointer-events: none;\n            background-color: gray;\n            background-size: cover;\n            background-position: center;\n        }\n\n        .imageCloud .loadedImage {\n            position: absolute;\n            top: 0;\n            bottom: 0;\n            left: 0;\n            right: 0;\n            pointer-events: none;\n            opacity: 0;\n            transition: ease opacity 0.5s;\n            background-size: cover;\n            background-position: center;\n            -webkit-filter: grayscale(100%); /* Chrome, Safari, Opera */\n            filter: grayscale(100%);\n        }\n        .imageCloud .progressbar {\n            position: absolute;\n            top: 0;\n            left: 0;\n            height: 6px;\n            width: 0%;\n            background: #66ce66;\n            z-index: 1;\n            transition: ease all 0.4s\n        }\n        .droppad-input {\n            position: absolute;\n            top: 0;\n            left: 0;\n            height: 0;\n            width: 0;\n            visibility: hidden;\n        }\n    ';

    var Default = {
        url: '',
        backgroundImage: '',
        maxFilesize: 8, //in MB
        paramName: "file", //TODO
        includeStyles: true,
        acceptedFiles: 'jpeg, jpg, png, gif',
        showErrors: true
    };

    var Template = '\n        <div class="progressbar"></div>\n        <div class="fallBack" style="opacity: 1;"></div>\n        <div class="loadedImage"></div>\n        <div class="dropSheet shown">\n            <div>\n                <div class="dropLabel"><p>Drop Image here.</p>\n                    <p>\n                        <small>or click here</small>\n                    </p>\n                </div>\n            </div>\n        </div>\n    ';

    var Droppad = function (_Emitter) {
        _inherits(Droppad, _Emitter);

        function Droppad(elm, options) {
            _classCallCheck(this, Droppad);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Droppad).call(this));

            _this.defaults = Utils.extend(Default, options);
            _this.droppad = elm;
            _this.injectStyles();
            _this.createDOM();
            _this.setEvents();
            _this.droppadElements();
            _this.setBackground();
            return _this;
        }
        // getters

        _createClass(Droppad, [{
            key: 'injectStyles',
            value: function injectStyles() {
                //if styles exists do nothing
                if (document.getElementById('imagecloudStyles')) return;
                var tag = document.createElement('style');
                tag.type = 'text/css';
                tag.id = 'imagecloudStyles';
                if (tag.styleSheet) {
                    tag.styleSheet.cssText = STYLES;
                } else {
                    tag.appendChild(document.createTextNode(STYLES));
                }
                document.getElementsByTagName('head')[0].appendChild(tag);
            }
        }, {
            key: 'createDOM',
            value: function createDOM() {
                var _this2 = this;

                Utils.setClass(this.droppad, 'imageCloud');
                Utils.setClass(this.droppad, 'droppad-clickable');

                this.droppad.innerHTML = Template;
                this.el_clickableInput = new Elm('input.droppad-input', {
                    type: 'file',
                    id: 'id-' + Math.floor(Math.random() * 100), //TODO remove
                    change: function change(e) {
                        var file = e.target.files[0];
                        _this2.showAsBackground(file);
                        _this2.upload(e.target.files);
                    }
                }, this.droppad);
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
                var self = this;
                // add event to document and listen for droppad-clickable elements
                if (!this.__proto__.isClickable) {
                    document.addEventListener('click', function (e) {
                        var clsList = Array.prototype.slice.call(e.target.classList);
                        if (clsList.indexOf('droppad-clickable') > -1) {
                            var droppad = Utils.findAncestor(e.target, 'imageCloud');
                            var input = droppad.querySelector('.droppad-input');
                            input.click();
                        }
                    });
                }
                this.__proto__.isClickable = true;
            }
        }, {
            key: 'droppadElements',
            value: function droppadElements() {
                this.el_fallback = this.droppad.querySelector('.fallBack');
                this.el_loadedImage = this.droppad.querySelector('.loadedImage');
                this.el_progressbar = this.droppad.querySelector('.progressbar');
            }
        }, {
            key: 'setBackground',
            value: function setBackground() {
                this.el_fallback.style.backgroundImage = 'url(' + this.defaults.backgroundImage + ')';
            }
        }, {
            key: 'showAsBackground',
            value: function showAsBackground(file) {
                var _this4 = this;

                /**
                 * let the image fade in 500ms
                 * then add it to the layer behind so we can repeat the effect on next drop
                 */
                var reader = new FileReader();
                reader.onload = function (event) {
                    _this4.el_loadedImage.style.backgroundImage = 'url(' + event.target.result + ')';
                    _this4.el_loadedImage.style.opacity = 1;
                    setTimeout(function () {
                        _this4.el_fallback.style.backgroundImage = 'url(' + event.target.result + ')';
                    }, 500);
                };
                reader.readAsDataURL(file);
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
                this.trigger('dragleave', e);
            }
        }, {
            key: 'drop',
            value: function drop(e) {
                Utils.removeClass(this.droppad, 'dragover');
                this.trigger('drop', e);
                var files = e.target.files || e.dataTransfer.files;
                var file = files[0];

                this.showAsBackground(file);
                this.upload(files);
            }
        }, {
            key: 'validate',
            value: function validate(file) {
                var self = this;
                var errors = [];

                var tests = [function size(file) {
                    var maxFilesize = self.defaults.maxFilesize * 1024 * 1024;
                    if (file.size > maxFilesize) {
                        errors.push('File is ' + self.formatBytes(file.size).human + '. Thats larger than the maximum file size ' + self.formatBytes(maxFilesize).human);
                    }
                }, function type(file) {
                    var baseMimeType = file.type.split('/')[0];
                    var mimeType = file.type.split('/')[1];
                    var acceptedFiles = self.defaults.acceptedFiles.replace(/ /g, '').split(',');
                    // Check if mimeType is allowed
                    if (acceptedFiles.indexOf(mimeType) < 0) {
                        errors.push('File type ' + mimeType + ' is not allowed');
                    }
                }];

                Utils.foreach(tests, function (fn) {
                    fn(file);
                });

                return errors;
            }
        }, {
            key: 'upload',
            value: function upload(files) {
                var _this5 = this;

                var headers = {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': '*/*'
                };

                var formData = new FormData();
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];

                    var errors = this.validate(file);
                    if (errors.length) {
                        Utils.foreach(errors, function (err) {
                            _this5.trigger('error', err);
                            if (_this5.defaults.showErrors) {
                                new Alert('danger', { message: err, timer: 6000 });
                            }
                        });
                        return;
                    }
                    formData.append('file', file, file.name); //file.name is not required Check server side implementation of this
                }
                var xhr = new XMLHttpRequest();
                xhr.open('POST', this.defaults.url, true);
                for (var key in headers) {
                    xhr.setRequestHeader(key, headers[key]);
                }

                xhr.onreadystatechange = function (e) {
                    if (xhr.readyState !== 4) return;
                    var data = Utils.attemptJson(xhr.responseText);
                    if (xhr.status === 200) {
                        _this5.uploadSuccess(data);
                    } else {
                        _this5.uploadError(data);
                    }
                };
                xhr.upload.addEventListener('progress', function (e) {
                    var loadedPercent = (e.loaded / e.total * 100).toFixed();
                    _this5.uploadProgress(loadedPercent);
                }, false);

                xhr.send(formData);
            }
        }, {
            key: 'uploadProgress',
            value: function uploadProgress(percentage) {
                this.trigger('progress', percentage);
                this.el_progressbar.style.width = percentage + '%';
            }
        }, {
            key: 'uploadSuccess',
            value: function uploadSuccess(data) {
                var _this6 = this;

                this.trigger('success', data);
                this.el_progressbar.style.display = 'none';
                this.el_progressbar.style.width = 0;

                this.el_fallback.style.opacity = 1;
                this.el_loadedImage.style.opacity = 0;

                setTimeout(function () {
                    _this6.el_progressbar.style.display = 'block';
                }, 400);
            }
        }, {
            key: 'uploadError',
            value: function uploadError(data) {
                this.trigger('error', data);
            }

            //add to Utils?

        }, {
            key: 'formatBytes',
            value: function formatBytes(bytes) {
                var kb = 1024;
                var ndx = Math.floor(Math.log(bytes) / Math.log(kb));
                var fileSizeTypes = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

                return {
                    size: +(bytes / kb / kb).toFixed(2),
                    type: fileSizeTypes[ndx],
                    human: +(bytes / kb / kb).toFixed(2) + fileSizeTypes[ndx]
                };
            }
        }, {
            key: 'STYLES',
            get: function get() {
                return STYLES;
            }
        }, {
            key: 'Template',
            get: function get() {
                return Template;
            }
        }], [{
            key: 'Default',
            get: function get() {
                return Default;
            }
        }]);

        return Droppad;
    }(Emitter);

    Droppad.prototype.isClickable = false;
    return Droppad;
}();

//TODO
//change imagecloud to droppad or somthing unique
//Image service should return full path as webkit-overflow-scrolling
//Check browser support
//change fallBack to more appropriate name
//deal with multiple files q