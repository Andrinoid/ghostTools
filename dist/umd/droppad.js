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

/**
 * //Events
 * dragenter
 * dragover
 * ondragleave
 * drop
 * progress
 * success
 * error
 * start
 * complete
 */

var Droppad = function () {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var STYLES = '\n        .imageCloud {\n            position: relative;\n            background-size: cover;\n            background-position: 50% 50%;\n            cursor: pointer;\n            font-family: arial, serif;\n            min-height: 200px;\n            display: flex;\n        }\n        .imageCloud input {\n            position: absolute;\n            top: 0;\n            right: 0;\n            bottom: 0;\n            left: 0;\n        }\n        .imageCloud .dropSheet {\n            position: absolute;\n            top: 0;\n            bottom: 0;\n            left: 0;\n            right: 0;\n            background: rgba(0, 0, 0, 0.5);\n            text-align: center;\n            padding: 10px;\n            opacity: 0;\n            transition: ease all 0.5s;\n            pointer-events: none;\n        }\n\n        .imageCloud .dropSheet.shown {\n            background: rgba(0, 0, 0, 0);\n            opacity: 1;\n        }\n\n        .imageCloud:hover .dropSheet {\n            background: rgba(0, 0, 0, 0.5);\n            opacity: 1;\n        }\n        .imageCloud:hover .dropSheet > div .dropLabel {\n            text-shadow: none;\n        }\n        .imageCloud.active {\n            background: rgba(0, 0, 0, 0.5);\n            background-size: cover;\n            background-position: center;\n        }\n\n        .imageCloud .dropSheet > div {\n            padding: 10px;\n            color: white;\n            border: dashed 2px #fff;\n            position: absolute;\n            top: 10px;\n            bottom: 10px;\n            left: 10px;\n            right: 10px;\n        }\n\n        .imageCloud .dropSheet > div .dropLabel {\n            position: absolute;\n            top: 50%;\n            left: 50%;\n            transform: translate(-50%, -50%);\n            transition: ease all 0.5s;\n            text-shadow: rgb(122, 122, 122) 1.5px 1.5px 0px, 0px 0px 9px rgba(0, 0, 0, 0.45);\n            width: 100%;\n        }\n\n        .imageCloud .dropSheet > div p {\n            font-size: 18px;\n        }\n\n        .imageCloud .fallBack {\n            flex-grow: 1;\n            pointer-events: none;\n            background-color: gray;\n            background-size: cover;\n            background-position: center;\n        }\n\n        .imageCloud .loadedImage {\n            flex-grow: 1;\n            pointer-events: none;\n            opacity: 0;\n            transition: ease opacity 0.5s;\n            background-size: cover;\n            background-position: center;\n            -webkit-filter: grayscale(100%); /* Chrome, Safari, Opera */\n            filter: grayscale(100%);\n        }\n        .imageCloud .progressbar {\n            position: absolute;\n            top: 0;\n            left: 0;\n            height: 6px;\n            width: 0%;\n            background: #4caf50;\n            z-index: 1;\n            transition: ease all 1s\n        }\n        .droppad-input {\n            position: absolute;\n            top: 0;\n            left: 0;\n            height: 0;\n            width: 0;\n            visibility: hidden;\n        }\n        .fillSpace {\n            position: absolute;\n            top: 0;\n            left: 0;\n            right: 0;\n            bottom: 0;\n            display: flex;\n            pointer-events: none;\n        }\n        .droppad-thumbnails {\n            padding-top: 20px;\n        }\n        .droppad-thumbnail {\n            background-size: cover;\n            background-position: center;\n            position: relative;\n            display: inline-block;\n            width: 120px;\n            height: 120px;\n            margin-right: 15px;\n            margin-bottom: 15px;\n        }\n        .icon-close-button {\n            width: 30px;\n            height: 30px;\n            background: black;\n            border-radius: 50%;\n            position: absolute;\n            right: -10px;\n            top: -10px;\n            cursor: pointer;\n        }\n        .icon-close-x {\n            stroke: white;\n            fill: transparent;\n            stroke-width: 3;\n        }\n    ';

    var Default = {
        backgroundUrlPrefix: '',
        url: '',
        backgroundImage: '',
        maxFilesize: 8, //in MB
        maxFiles: 20,
        paramName: "file", //TODO
        includeStyles: true,
        acceptedFiles: 'jpeg, jpg, png, gif',
        showErrors: true,
        title: 'Drop Image',
        subTitle: 'or click here',
        customHandler: false,
        backgroundLoading: true,
        thumbnailLoading: true,
        thumbnailParent: null,
        initThumbnails: [] // ['http://example.jpg', 'http://example2.jpg']
    };

    var Template = '\n        <div class="progressbar"></div>\n        <div class="fillSpace afterLoad">\n\n        </div>\n        <div class="fillSpace beforeLoad">\n\n        </div>\n        <div class="dropSheet shown">\n            <div>\n                <div class="dropLabel">\n                    <p>*|title|*</p>\n                    <p>\n                        <small>*|subTitle|*</small>\n                    </p>\n                </div>\n            </div>\n        </div>\n    ';

    var CloseIcon = '\n        <div class="icon-close-button">\n            <svg viewbox="0 0 40 40">\n                <path class="icon-close-x" d="M 10,10 L 30,30 M 30,10 L 10,30" />\n            </svg>\n        </div>\n    ';

    var Droppad = function (_Emitter) {
        _inherits(Droppad, _Emitter);

        function Droppad(elm, options) {
            _classCallCheck(this, Droppad);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Droppad).call(this));

            var defaultOpt = JSON.parse(JSON.stringify(Default));
            _this.defaults = Utils.extend(defaultOpt, options);
            _this.droppad = elm;
            _this.currentImage = null;
            _this.uid = 0;
            _this.beforeElmQue = [];
            _this.afterElmQue = [];
            _this.uploadedFiles = {};
            _this.injectStyles();
            _this.createDOM();
            _this.setEvents();
            _this.droppadElements();
            _this.setBackground();
            _this.initThumbnails();
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

                this.dropArea = new Elm('div', this.droppad);
                Utils.setClass(this.dropArea, 'imageCloud');
                Utils.setClass(this.dropArea, 'active');
                Utils.setClass(this.dropArea, 'droppad-clickable');
                var template = (' ' + this.Template).slice(1); //Force string copy. Bug in some  chrome versions
                template = template.replace('*|title|*', this.defaults.title || '').replace('*|subTitle|*', this.defaults.subTitle || '');

                this.dropArea.innerHTML = template;
                this.el_clickableInput = new Elm('input.droppad-input', {
                    type: 'file',
                    id: 'id-' + Math.floor(Math.random() * 100), //TODO remove
                    change: function change(e) {
                        //let file = e.target.files[0];
                        _this2.showAsBackground(e.target.files);
                        _this2.upload(e.target.files);
                    },
                    multiple: true
                }, this.dropArea);
                if (this.defaults.thumbnailLoading) {
                    if (!this.defaults.thumbnailParent) {
                        this.el_thumbails = new Elm('div.droppad-thumbnails', this.droppad);
                    } else {
                        this.el_thumbails = this.defaults.thumbnailParent;
                    }
                }
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
                this.dropArea.ondragenter = function (e) {
                    noPropagation(e);
                    _this3.dragenter(e);
                };
                this.dropArea.ondragover = function (e) {
                    noPropagation(e);
                    _this3.dragover(e);
                };
                this.dropArea.ondragleave = function (e) {
                    noPropagation(e);
                    _this3.dragleave(e);
                };
                this.dropArea.ondrop = function (e) {
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
                // get the template elements
                this.el_fallback = this.dropArea.querySelector('.fallBack');
                this.el_loadedImage = this.dropArea.querySelector('.loadedImage');
                this.el_progressbar = this.dropArea.querySelector('.progressbar');
            }
        }, {
            key: 'uploadModalTrigger',
            value: function uploadModalTrigger() {
                //Method to call if you need external trigger like button
                this.el_clickableInput.click();
            }
        }, {
            key: 'setBackground',
            value: function setBackground() {
                if (!this.defaults.backgroundImage) return;
                var prefix = this.defaults.backgroundUrlPrefix === '' ? '' : this.defaults.backgroundUrlPrefix.replace(/\/?$/, '/');
                var url = prefix + this.defaults.backgroundImage;
                this.dropArea.style.backgroundImage = 'url(' + url + ')';
            }
        }, {
            key: 'showAsBackground',
            value: function showAsBackground(files) {
                var _this4 = this;

                /**
                 * let the images fade in 500ms
                 */
                Utils.removeClass(this.dropArea, 'active');
                var len = files.length > this.defaults.maxFiles ? this.defaults.maxFiles : files.length;

                var _loop = function _loop(i) {
                    var elBefore = new Elm('div.loadedImage', {
                        css: {
                            'opacity': 1
                        }
                    }, _this4.dropArea.querySelector('.beforeLoad'));
                    var elAfter = new Elm('div.fallBack', { cls: 'uid-' + files[i].uid }, _this4.dropArea.querySelector('.afterLoad'));
                    _this4.beforeElmQue.push(elBefore);
                    _this4.afterElmQue.push(elAfter);
                    var file = files[i];
                    reader = new FileReader();

                    reader.onload = function (event) {
                        elBefore.style.backgroundImage = 'url(' + event.target.result + ')';
                        elBefore.style.opacity = 1;
                        setTimeout(function () {
                            elAfter.style.backgroundImage = 'url(' + event.target.result + ')';
                        }, 500);
                    };
                    reader.readAsDataURL(file);
                };

                for (var i = 0; i < len; i++) {
                    var reader;

                    _loop(i);
                }
            }
        }, {
            key: 'initThumbnails',
            value: function initThumbnails() {
                var _this5 = this;

                console.log('hello');
                if (!this.defaults.initThumbnails.length) return;

                var _loop2 = function _loop2(i) {
                    var uid = ++_this5.uid;
                    var imageUrl = _this5.defaults.initThumbnails[i];
                    var thumb = new Elm('div.droppad-thumbnail', {
                        cls: 'uid-' + uid,
                        html: CloseIcon
                    }, //click: () => {this.remove(files[i]['uid'])} // this would be a nice place to enlarge the thumbnail
                    _this5.el_thumbails);
                    var close = thumb.querySelector('.icon-close-button');
                    close.addEventListener('click', function () {
                        _this5.remove(uid);
                    }, false);
                    thumb.style.backgroundImage = 'url(' + imageUrl + ')';
                    _this5.uploadedFiles['uid-' + _this5.uid] = { image: imageUrl, file: { uid: uid } };
                };

                for (var i = 0; i < this.defaults.initThumbnails.length; i++) {
                    _loop2(i);
                }
            }
        }, {
            key: 'createThumbnails',
            value: function createThumbnails(files) {
                var _this6 = this;

                var len = files.length > this.defaults.maxFiles ? this.defaults.maxFiles : files.length;

                var _loop3 = function _loop3(i) {
                    var thumb = new Elm('div.droppad-thumbnail', {
                        cls: 'uid-' + files[i]['uid'],
                        html: CloseIcon
                    }, //click: () => {this.remove(files[i]['uid'])} // this would be a nice place to enlarge the thumbnail
                    _this6.el_thumbails);
                    var close = thumb.querySelector('.icon-close-button');
                    close.addEventListener('click', function () {
                        _this6.remove(files[i]['uid']);
                    }, false);

                    var file = files[i];
                    reader = new FileReader();

                    reader.onload = function (event) {
                        thumb.style.backgroundImage = 'url(' + event.target.result + ')';
                    };
                    reader.readAsDataURL(file);
                };

                for (var i = 0; i < len; i++) {
                    var reader;

                    _loop3(i);
                }
            }
        }, {
            key: 'remove',
            value: function remove(uid) {
                this.trigger('remove', uid);
                delete this.uploadedFiles['uid-' + uid];
                if (!this.uploadedFiles.length) {
                    Utils.setClass(this.dropArea, 'active');
                }
                // elms can be thumbnail and / or backgroundImage
                var elms = this.droppad.querySelectorAll('.uid-' + uid);
                for (var i = 0; i < elms.length; i++) {
                    Utils.fadeOutRemove(elms[i]);
                }
            }
        }, {
            key: 'dragenter',
            value: function dragenter(e) {
                Utils.setClass(this.dropArea, 'dragenter');
                this.trigger('dragenter', e);
            }
        }, {
            key: 'dragover',
            value: function dragover(e) {
                Utils.removeClass(this.dropArea, 'dragover');
                this.trigger('dragover', e);
            }
        }, {
            key: 'dragleave',
            value: function dragleave(e) {
                Utils.removeClass(this.dropArea, 'dragover');
                this.trigger('dragleave', e);
            }
        }, {
            key: 'drop',
            value: function drop(e) {
                Utils.removeClass(this.dropArea, 'dragover');
                this.trigger('drop', e);
                var files = e.target.files || e.dataTransfer.files;

                //Add reference id to each file so we can access it throug thumbnails
                for (var i = 0; i < files.length; i++) {
                    files[i]['uid'] = ++this.uid;
                }
                if (this.defaults.backgroundLoading) {
                    this.showAsBackground(files);
                }
                if (this.defaults.thumbnailLoading) {
                    this.createThumbnails(files);
                }
                this.upload(files);
            }
        }, {
            key: 'validate',
            value: function validate(_file) {
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
                    fn(_file);
                });

                return errors;
            }
        }, {
            key: 'uploadSingle',
            value: function uploadSingle(file, id) {
                var _this7 = this;

                var headers = {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': '*/*'
                };

                var formData = new FormData();

                var errors = this.validate(file);
                if (errors.length) {
                    Utils.foreach(errors, function (err) {
                        _this7.trigger('error', err);
                        if (_this7.defaults.showErrors) {
                            new Alert('danger', {
                                message: err,
                                timer: 6000
                            });
                        }
                    });
                    this.remove(document.querySelectorAll('.uid-' + file.uid));
                    return;
                }
                formData.append('file', file, file.name);

                var xhr = new XMLHttpRequest();
                //add tailing slash if doesn't exists
                var url = this.defaults.url;
                xhr.open('POST', url, true);
                for (var key in headers) {
                    xhr.setRequestHeader(key, headers[key]);
                }

                xhr.onreadystatechange = function (e) {
                    if (xhr.readyState !== 4) return;
                    var data = Utils.attemptJson(xhr.responseText);
                    if (xhr.status === 200) {
                        _this7.uploadSuccess(data, file);
                    } else {
                        _this7.uploadError(data);
                        //TODO show this to the user
                    }
                };
                xhr.upload.addEventListener('progress', function (e) {
                    _this7.chunkTotal.totals[id] = e.total;
                    _this7.chunkTotal.loads[id] = e.loaded;
                    _this7.uploadProgress();
                }, false);

                xhr.send(formData);
            }
        }, {
            key: 'upload',
            value: function upload(files) {
                this.trigger('start');
                this.chunkTotal = {
                    totals: Utils.range(files.length, 0, 0),
                    loads: Utils.range(files.length, 0, 0) };

                // returns e.q [0,0,0] for three files
                this.filesLenght = files.length;

                if (this.defaults.customHandler) {
                    this.defaults.customHandler(files);
                    return;
                }

                for (var i = 0; i < files.length; i++) {
                    var file = files[i];

                    var counter = i + 1;
                    if (counter > this.defaults.maxFiles) {
                        var err = 'The maximum amount of files you can upload is ' + this.defaults.maxFiles;
                        this.trigger('error', err);
                        if (this.defaults.showErrors) {
                            new Alert('danger', {
                                message: err,
                                timer: 6000
                            });
                        }
                        break;
                    }

                    this.uploadSingle(file, i);
                }
            }
        }, {
            key: 'uploadProgress',
            value: function uploadProgress() {
                var loaded = this.chunkTotal.loads.reduce(function (a, b) {
                    return a + b;
                }, 0); // returns sum of array values
                var total = this.chunkTotal.totals.reduce(function (a, b) {
                    return a + b;
                }, 0);
                var percentage = (loaded / total * 100).toFixed();
                this.trigger('progress', percentage);
                this.el_progressbar.style.width = percentage + '%';
            }
        }, {
            key: 'uploadSuccess',
            value: function uploadSuccess(data, file) {
                var _this8 = this;

                data['file'] = file;
                this.uploadedFiles['uid-' + file.uid] = data;

                this.trigger('success', data);
                this.el_progressbar.style.display = 'none';
                this.el_progressbar.style.width = 0;

                var elBefore = this.beforeElmQue.shift();
                var elAfter = this.afterElmQue.shift();
                if (this.defaults.backgroundLoading) {
                    elAfter.style.opacity = 1;
                    elBefore.style.opacity = 0;
                }
                this.currentImage = data;
                setTimeout(function () {
                    _this8.el_progressbar.style.display = 'block';
                }, 400);

                this.successCounter = this.successCounter ? this.successCounter + 1 : 1;
                if (this.filesLenght === this.successCounter) {
                    this.trigger('complete');
                    this.successCounter = 0;
                    this.filesLenght = 0;
                }
            }
        }, {
            key: 'uploadError',
            value: function uploadError(data) {
                this.trigger('error', data);
                new Alert('danger', 'not successfull');
            }
        }, {
            key: 'getUploadedFiles',
            value: function getUploadedFiles() {
                return this.uploadedFiles;
            }
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

            // setters
            ,
            set: function set(template) {
                Template = template;
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
//Check browser support
//change fallBack to more appropriate name
//add option for single multiple
//option to hide labels when active image
return Droppad;
}));
