import Utils from './utils';
import Elm from './elm';
import Emitter from './emitter';
import Alert from './alert';

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

const Droppad = (() => {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const STYLES = `
        .imageCloud {
            position: relative;
            background-size: cover;
            background-position: 50% 50%;
            cursor: pointer;
            font-family: arial, serif;
            min-height: 200px;
            display: flex;
        }
        .imageCloud input {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
        }
        .imageCloud .dropSheet {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.5);
            text-align: center;
            padding: 10px;
            opacity: 0;
            transition: ease all 0.5s;
            pointer-events: none;
        }

        .imageCloud .dropSheet.shown {
            background: rgba(0, 0, 0, 0);
            opacity: 1;
        }

        .imageCloud:hover .dropSheet {
            background: rgba(0, 0, 0, 0.5);
            opacity: 1;
        }
        .imageCloud:hover .dropSheet > div .dropLabel {
            text-shadow: none;
        }
        .imageCloud.active {
            background: rgba(0, 0, 0, 0.5);
            background-size: cover;
            background-position: center;
        }

        .imageCloud .dropSheet > div {
            padding: 10px;
            color: white;
            border: dashed 2px #fff;
            position: absolute;
            top: 10px;
            bottom: 10px;
            left: 10px;
            right: 10px;
        }

        .imageCloud .dropSheet > div .dropLabel {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: ease all 0.5s;
            text-shadow: rgb(122, 122, 122) 1.5px 1.5px 0px, 0px 0px 9px rgba(0, 0, 0, 0.45);
            width: 100%;
        }

        .imageCloud .dropSheet > div p {
            font-size: 18px;
        }

        .imageCloud .fallBack {
            flex-grow: 1;
            pointer-events: none;
            background-color: gray;
            background-size: cover;
            background-position: center;
        }

        .imageCloud .loadedImage {
            flex-grow: 1;
            pointer-events: none;
            opacity: 0;
            transition: ease opacity 0.5s;
            background-size: cover;
            background-position: center;
            -webkit-filter: grayscale(100%); /* Chrome, Safari, Opera */
            filter: grayscale(100%);
        }
        .imageCloud .progressbar {
            position: absolute;
            top: 0;
            left: 0;
            height: 6px;
            width: 0%;
            background: #4caf50;
            z-index: 1;
            transition: ease all 1s
        }
        .droppad-input {
            position: absolute;
            top: 0;
            left: 0;
            height: 0;
            width: 0;
            visibility: hidden;
        }
        .fillSpace {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            pointer-events: none;
        }
        .droppad-thumbnails {
            padding-top: 20px;
        }
        .droppad-thumbnail {
            background-size: cover;
            background-position: center;
            position: relative;
            display: inline-block;
            width: 120px;
            height: 120px;
            margin-right: 15px;
            margin-bottom: 15px;
        }
        .icon-close-button {
            width: 30px;
            height: 30px;
            background: black;
            border-radius: 50%;
            position: absolute;
            right: -10px;
            top: -10px;
            cursor: pointer;
        }
        .icon-close-x {
            stroke: white;
            fill: transparent;
            stroke-width: 3;
        }
    `;

    const Default = {
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
        thumbnailLoading: false,
        thumbnailParent: null,
        initThumbnails: [], // ['http://example.jpg', 'http://example2.jpg'],
        headers: {}
    };

    let Template = `
        <div class="progressbar"></div>
        <div class="fillSpace afterLoad">

        </div>
        <div class="fillSpace beforeLoad">

        </div>
        <div class="dropSheet shown">
            <div>
                <div class="dropLabel">
                    <p>*|title|*</p>
                    <p>
                        <small>*|subTitle|*</small>
                    </p>
                </div>
            </div>
        </div>
    `;

    let CloseIcon = `
        <div class="icon-close-button">
            <svg viewbox="0 0 40 40">
                <path class="icon-close-x" d="M 10,10 L 30,30 M 30,10 L 10,30" />
            </svg>
        </div>
    `;

    class Droppad extends Emitter {

        constructor(elm, options) {
            super();
            let defaultOpt = JSON.parse(JSON.stringify(Default));
            this.defaults = Utils.extend(defaultOpt, options);
            this.droppad = elm;
            this.currentImage = null;
            this.uid = 0;
            this.beforeElmQue = [];
            this.afterElmQue = [];
            this.uploadedFiles = {};
            this.injectStyles();
            this.createDOM();
            this.setEvents();
            this.droppadElements();
            this.setBackground();
            this.initThumbnails();
        }
        // getters

        static get Default() {
            return Default;
        }

        get STYLES() {
            return STYLES;
        }

        get Template() {
            return Template;
        }

        // setters
        set Template(template) {
            Template = template;
        }

        injectStyles() {
            //if styles exists do nothing
            if (document.getElementById('imagecloudStyles'))
                return;
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

        createDOM() {
            this.dropArea = new Elm('div', this.droppad);
            Utils.setClass(this.dropArea, 'imageCloud');
            Utils.setClass(this.dropArea, 'active');
            Utils.setClass(this.dropArea, 'droppad-clickable');
            let template = (' ' + this.Template).slice(1); //Force string copy. Bug in some  chrome versions
            template = template.replace('*|title|*', this.defaults.title || '').replace('*|subTitle|*', this.defaults.subTitle || '');

            this.dropArea.innerHTML = template;
            this.el_clickableInput = new Elm('input.droppad-input', {
                type: 'file',
                id: 'id-' + Math.floor(Math.random() * 100), //TODO remove
                change: (e) => {
                    this.drop(e);
                },
                multiple: true
            }, this.dropArea);
            if(this.defaults.thumbnailLoading) {
                if(!this.defaults.thumbnailParent) {
                    this.el_thumbails = new Elm('div.droppad-thumbnails', this.droppad);
                } else {
                    this.el_thumbails = this.defaults.thumbnailParent;
                }
            }

        }

        setEvents() {
            function noPropagation(e) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                if (e.preventDefault) {
                    e.preventDefault();
                }
            }
            this.dropArea.ondragenter = (e) => {
                noPropagation(e);
                this.dragenter(e);
            };
            this.dropArea.ondragover = (e) => {
                noPropagation(e);
                this.dragover(e);
            };
            this.dropArea.ondragleave = (e) => {
                noPropagation(e);
                this.dragleave(e);
            };
            this.dropArea.ondrop = (e) => {
                noPropagation(e);
                this.drop(e);
            };
            let self = this;
            // add event to document and listen for droppad-clickable elements
            if (!this.__proto__.isClickable) {
                const clickInput = (e)=> {
                    var clsList = Array.prototype.slice.call(e.target.classList);
                    if (clsList.indexOf('droppad-clickable') > -1) {
                        let droppad = Utils.findAncestor(e.target, 'imageCloud');
                        let input = droppad.querySelector('.droppad-input');
                        input.click();
                    }
                };

                document.addEventListener('click', (e) => {
                    clickInput(e);
                });

            }
            this.__proto__.isClickable = true;
        }

        droppadElements() {
            // get the template elements
            this.el_fallback = this.dropArea.querySelector('.fallBack');
            this.el_loadedImage = this.dropArea.querySelector('.loadedImage');
            this.el_progressbar = this.dropArea.querySelector('.progressbar');
        }

        uploadModalTrigger() {
            //Method to call if you need external trigger like button
            this.el_clickableInput.click();
        }

        setBackground() {
            if(!this.defaults.backgroundImage) return;
            let prefix = (this.defaults.backgroundUrlPrefix === '') ? '' : this.defaults.backgroundUrlPrefix.replace(/\/?$/, '/');
            let url = prefix + this.defaults.backgroundImage;
            this.dropArea.style.backgroundImage = `url(${url})`;
        }

        showAsBackground(files) {
            /**
             * let the images fade in 500ms
             */
            Utils.removeClass(this.dropArea, 'active');
            let len = files.length > this.defaults.maxFiles ? this.defaults.maxFiles : files.length;
            for (let i = 0; i < len; i++) {
                let elBefore = new Elm('div.loadedImage', {
                    css: {
                        'opacity': 1
                    }
                }, this.dropArea.querySelector('.beforeLoad'));
                let elAfter = new Elm('div.fallBack', {cls:'uid-' + files[i].uid}, this.dropArea.querySelector('.afterLoad'));
                this.beforeElmQue.push(elBefore);
                this.afterElmQue.push(elAfter);
                let file = files[i];
                var reader = new FileReader();
                reader.onload = (event) => {
                    elBefore.style.backgroundImage = 'url(' + event.target.result + ')';
                    elBefore.style.opacity = 1;
                    setTimeout(() => {
                        elAfter.style.backgroundImage = 'url(' + event.target.result + ')';
                    }, 500);
                };
                reader.readAsDataURL(file);
            }

        }

        initThumbnails() {
            if(!this.defaults.initThumbnails.length) return;
            for (let i = 0; i < this.defaults.initThumbnails.length; i++) {
                let uid = ++this.uid;
                let imageUrl = this.defaults.initThumbnails[i];
                let thumb = new Elm('div.droppad-thumbnail', {
                    cls: 'uid-' + uid,
                    html: CloseIcon,
                    //click: () => {this.remove(files[i]['uid'])} // this would be a nice place to enlarge the thumbnail
                }, this.el_thumbails);
                let close = thumb.querySelector('.icon-close-button');
                close.addEventListener('click', ()=> {this.remove(uid);}, false);
                thumb.style.backgroundImage = 'url(' + imageUrl + ')';
                this.uploadedFiles['uid-' + this.uid] = {image: imageUrl, file: {uid: uid}};
            }
        }

        createThumbnails(files) {
            let len = files.length > this.defaults.maxFiles ? this.defaults.maxFiles : files.length;
            for (let i = 0; i < len; i++) {
                let thumb = new Elm('div.droppad-thumbnail', {
                    cls: 'uid-' + files[i].uid,
                    html: CloseIcon,
                    //click: () => {this.remove(files[i]['uid'])} // this would be a nice place to enlarge the thumbnail
                }, this.el_thumbails);
                let close = thumb.querySelector('.icon-close-button');
                close.addEventListener('click', ()=> {this.remove(files[i].uid);}, false);

                let file = files[i];
                var reader = new FileReader();
                reader.onload = (event) => {
                    thumb.style.backgroundImage = 'url(' + event.target.result + ')';
                };
                reader.readAsDataURL(file);
            }
        }

        remove(uid) {
            delete this.uploadedFiles['uid-' + uid];
            if(!this.uploadedFiles.length) {
                Utils.setClass(this.dropArea, 'active');
            }
            // elms can be thumbnail and / or backgroundImage
            let elms = document.querySelectorAll('.uid-' + uid);
            for(let i = 0; i < elms.length; i++) {
                Utils.fadeOutRemove(elms[i]);
            }
            this.trigger('remove', uid);
        }

        dragenter(e) {
            Utils.setClass(this.dropArea, 'dragenter');
            this.trigger('dragenter', e);
        }

        dragover(e) {
            Utils.removeClass(this.dropArea, 'dragover');
            this.trigger('dragover', e);
        }

        dragleave(e) {
            Utils.removeClass(this.dropArea, 'dragover');
            this.trigger('dragleave', e);
        }

        drop(e) {
            Utils.removeClass(this.dropArea, 'dragover');
            this.trigger('drop', e);
            var files = e.target.files || e.dataTransfer.files;

            //Add reference id to each file so we can access it throug thumbnails
            for(let i = 0; i < files.length; i++) {
                files[i].uid = ++this.uid;
            }
            if (this.defaults.backgroundLoading) {
                this.showAsBackground(files);
            }
            if (this.defaults.thumbnailLoading) {
                this.createThumbnails(files);
            }
            this.upload(files);
        }

        validate(_file) {
            let self = this;
            let errors = [];
            let tests = [
                function size(file) {
                    const maxFilesize = self.defaults.maxFilesize * 1024 * 1024;
                    if (file.size > maxFilesize) {
                        errors.push(`File is ${self.formatBytes(file.size).human}. Thats larger than the maximum file size ${self.formatBytes(maxFilesize).human}`);
                    }
                },
                function type(file) {
                    const baseMimeType = file.type.split('/')[0];
                    const mimeType = file.type.split('/')[1];
                    let acceptedFiles = self.defaults.acceptedFiles.replace(/ /g, '').split(',');
                    // Check if mimeType is allowed
                    if (acceptedFiles.indexOf(mimeType) < 0) {
                        errors.push(`File type ${mimeType} is not allowed`);
                    }
                }
            ];

            Utils.foreach(tests, (fn) => {
                fn(_file);
            });

            return errors;
        }

        uploadSingle(file, id) {

            let headers = this.default.headers || {};
            
            if(!headers['X-Requested-With']){
                headers['X-Requested-With'] = 'XMLHttpRequest';
            }
            
            if(!headers['Accept']){
                headers['Accept'] = '*/*';
            }

            let formData = new FormData();

            let errors = this.validate(file);
            if (errors.length) {
                Utils.foreach(errors, (err) => {
                    this.trigger('error', err);
                    if (this.defaults.showErrors) {
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

            let xhr = new XMLHttpRequest();
            //add tailing slash if doesn't exists
            let url = this.defaults.url;
            xhr.open('POST', url, true);
            for (var key in headers) {
                xhr.setRequestHeader(key, headers[key]);
            }

            xhr.onreadystatechange = (e) => {
                if (xhr.readyState !== 4)
                    return;
                var data = Utils.attemptJson(xhr.responseText);
                if (xhr.status === 200) {
                    this.uploadSuccess(data, file);
                } else {
                    this.uploadError(data);
                    //TODO show this to the user
                }
            };

            xhr.upload.addEventListener('progress', (e) => {
                this.chunkTotal.totals[id] = e.total;
                this.chunkTotal.loads[id] = e.loaded;
                this.uploadProgress();
            }, false);

            xhr.send(formData);
        }

        upload(files) {
            this.trigger('start');
            this.chunkTotal = {
                totals: Utils.range(files.length, 0, 0),
                loads: Utils.range(files.length, 0, 0), // returns e.q [0,0,0] for three files
            };

            this.filesLenght = files.length;

            if (this.defaults.customHandler) {
                this.defaults.customHandler(files);
                return;
            }

            for (let i = 0; i < files.length; i++) {
                let file = files[i];

                let counter = i + 1;
                if (counter > this.defaults.maxFiles) {
                    const err = 'The maximum amount of files you can upload is ' + this.defaults.maxFiles;
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

        uploadProgress() {
            let loaded = this.chunkTotal.loads.reduce((a, b) => a + b, 0); // returns sum of array values
            let total = this.chunkTotal.totals.reduce((a, b) => a + b, 0);
            let percentage = (loaded / total * 100).toFixed();
            this.trigger('progress', percentage);
            this.el_progressbar.style.width = percentage + '%';
        }

        uploadSuccess(data, file) {
            data.file = file;
            this.uploadedFiles['uid-' + file.uid] = data;

            this.trigger('success', data);
            this.el_progressbar.style.display = 'none';
            this.el_progressbar.style.width = 0;

            let elBefore = this.beforeElmQue.shift();
            let elAfter = this.afterElmQue.shift();
            if (this.defaults.backgroundLoading) {
                elAfter.style.opacity = 1;
                elBefore.style.opacity = 0;
            }
            this.currentImage = data;
            setTimeout(() => {
                this.el_progressbar.style.display = 'block';
            }, 400);

            this.successCounter = this.successCounter ? (this.successCounter + 1) : 1;
            if (this.filesLenght === this.successCounter) {
                this.trigger('complete');
                this.successCounter = 0;
                this.filesLenght = 0;
            }

        }

        uploadError(data) {
            this.trigger('error', data);
            new Alert('danger', 'not successfull');
        }

        getUploadedFiles() {
            let li = [];
            for(let key in this.uploadedFiles) {
                li.push(this.defaults.backgroundUrlPrefix + this.uploadedFiles[key].image);
            }
            return li;
        }

        formatBytes(bytes) {
            var kb = 1024;
            var ndx = Math.floor(Math.log(bytes) / Math.log(kb));
            var fileSizeTypes = [
                "bytes",
                "KB",
                "MB",
                "GB",
                "TB",
                "PB",
                "EB",
                "ZB",
                "YB"
            ];

            return {
                size: + (bytes / kb / kb).toFixed(2),
                type: fileSizeTypes[ndx],
                human: + (bytes / kb / kb).toFixed(2) + fileSizeTypes[ndx]
            };
        }
    }
    Droppad.prototype.isClickable = false;
    return Droppad;
})();

//TODO
//change imagecloud to droppad or somthing unique
//Check browser support
//change fallBack to more appropriate name
//add option for single multiple
//option to hide labels when active image

export default Droppad;
