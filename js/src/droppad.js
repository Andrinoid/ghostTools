import Utils from './utils';
import Elm from './elm';
import Emitter from './emitter';
import Alert from './alert';


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
            white-space: nowrap;
            transition: ease all 0.5s;
            text-shadow: rgb(122, 122, 122) 1.5px 1.5px 0px, 0px 0px 9px rgba(0, 0, 0, 0.45);
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
    `;

    const Default = {
        backgroundUrlPrefix: '',
        url: '',
        backgroundImage: '',
        maxFilesize: 8, //in MB
        paramName: "file", //TODO
        includeStyles: true,
        acceptedFiles: 'jpeg, jpg, png, gif',
        showErrors: true,
        title: 'Drop Image',
        subTitle: 'or click here'
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

    class Droppad extends Emitter {

        constructor(elm, options) {
                super();
                this.defaults = Utils.extend(Default, options);
                this.droppad = elm;
                this.currentImage = null;
                this.beforeElmQue = [];
                this.afterElmQue = [];
                this.injectStyles();
                this.createDOM();
                this.setEvents();
                this.droppadElements();
                this.setBackground();//TODO
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

        injectStyles() {
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

        createDOM() {
            Utils.setClass(this.droppad, 'imageCloud');
            Utils.setClass(this.droppad, 'active');
            Utils.setClass(this.droppad, 'droppad-clickable');
            let template = (' ' + Template).slice(1); //Force string copy for. Bug in some  chrome versions
            template = template.replace('*|title|*', this.defaults.title).replace('*|subTitle|*', this.defaults.subTitle);

            this.droppad.innerHTML = template;
            this.el_clickableInput = new Elm('input.droppad-input', {
                type: 'file',
                id: 'id-' + Math.floor(Math.random() * 100), //TODO remove
                change: (e) => {
                    //let file = e.target.files[0];
                    this.showAsBackground(e.target.files);
                    this.upload(e.target.files);
                },
                multiple: true
            }, this.droppad);
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
            this.droppad.ondragenter = (e) => {
                noPropagation(e);
                this.dragenter(e);
            };
            this.droppad.ondragover = (e) => {
                noPropagation(e);
                this.dragover(e);
            };
            this.droppad.ondragleave = (e) => {
                noPropagation(e);
                this.dragleave(e);
            };
            this.droppad.ondrop = (e) => {
                noPropagation(e);
                this.drop(e);
            };
            let self = this;
            // add event to document and listen for droppad-clickable elements
            if (!this.__proto__.isClickable) {
                document.addEventListener('click', (e) => {
                    var clsList = Array.prototype.slice.call(e.target.classList);
                    if (clsList.indexOf('droppad-clickable') > -1) {
                        let droppad = Utils.findAncestor(e.target, 'imageCloud');
                        let input = droppad.querySelector('.droppad-input')
                        input.click();
                    }
                });
            }
            this.__proto__.isClickable = true;
        }

        droppadElements() {
            this.el_fallback = this.droppad.querySelector('.fallBack');
            this.el_loadedImage = this.droppad.querySelector('.loadedImage');
            this.el_progressbar = this.droppad.querySelector('.progressbar');
        }

        setBackground() {
            let prefix = (this.defaults.backgroundUrlPrefix === '') ? '' : this.defaults.backgroundUrlPrefix.replace(/\/?$/, '/');
            let url = prefix + this.defaults.backgroundImage;
            this.droppad.style.backgroundImage = `url(${url})`;
        }

        showAsBackground(files) {
            /**
             * let the images fade in 500ms
             */
            Utils.removeClass(this.droppad, 'active');
            for (let i = 0; i < files.length; i++) {
                let elBefore = new Elm('div.loadedImage', {
                    css: {
                        'opacity': 1
                    }
                }, this.droppad.querySelector('.beforeLoad'));
                let elAfter = new Elm('div.fallBack', this.droppad.querySelector('.afterLoad'));
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

        dragenter(e) {
            Utils.setClass(this.droppad, 'dragenter');
            this.trigger('dragenter', e);
        }

        dragover(e) {
            Utils.removeClass(this.droppad, 'dragover');
            this.trigger('dragover', e);
        }

        dragleave(e) {
            Utils.removeClass(this.droppad, 'dragover');
            this.trigger('dragleave', e);
        }

        drop(e) {
            Utils.removeClass(this.droppad, 'dragover');
            this.trigger('drop', e);
            var files = e.target.files || e.dataTransfer.files;
            //var file = files[0];

            this.showAsBackground(files);
            this.upload(files);
        }

        validate(_file) {
            let self = this;
            let errors = [];
            let tests = [
                function size(file) {
                    const maxFilesize = self.defaults.maxFilesize * 1024 * 1024;
                    if (file.size > maxFilesize) {
                        errors.push(`File is ${self.formatBytes(file.size).human}. Thats larger than the maximum file size ${self.formatBytes(maxFilesize).human}`)
                    }
                },
                function type(file) {
                    const baseMimeType = file.type.split('/')[0];
                    const mimeType = file.type.split('/')[1];
                    let acceptedFiles = self.defaults.acceptedFiles.replace(/ /g, '').split(',');
                    // Check if mimeType is allowed
                    if (acceptedFiles.indexOf(mimeType) < 0) {
                        errors.push(`File type ${mimeType} is not allowed`)
                    }
                }
            ];

            Utils.foreach(tests, (fn) => {
                fn(_file);
            });

            return errors;
        }

        uploadSingle(file, id) {

            let headers = {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': '*/*',
            };

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
                return;
            }
            formData.append('file', file, file.name); //file.name is not required Check server side implementation of this


            let xhr = new XMLHttpRequest();
            //add trailing slash if doesn't exists
            let url = this.defaults.url
            xhr.open('POST', url, true);
            for (var key in headers) {
                xhr.setRequestHeader(key, headers[key]);
            }

            xhr.onreadystatechange = (e) => {
                if (xhr.readyState !== 4)
                    return;
                var data = Utils.attemptJson(xhr.responseText);
                if (xhr.status === 200) {
                    this.uploadSuccess(data);
                } else {
                    this.uploadError(data);
                    //TODO show this to the user
                }
            }
            xhr.upload.addEventListener('progress', (e) => {
                this.chunkTotal.totals[id] = e.total;
                this.chunkTotal.loads[id] = e.loaded;
                this.uploadProgress();
            }, false);

            xhr.send(formData);
        }

        upload(files) {
            this.chunkTotal = {
                totals: Utils.range(files.length, 0, 0),
                loads: Utils.range(files.length, 0, 0), // returns e.q [0,0,0] for three files
            };

            for (let i = 0; i < files.length; i++) {
                let file = files[i];
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

        uploadSuccess(data) {
            this.trigger('success', data);

            this.el_progressbar.style.display = 'none';
            this.el_progressbar.style.width = 0;

            let elBefore = this.beforeElmQue.shift();
            let elAfter = this.afterElmQue.shift();
            elAfter.style.opacity = 1;
            elBefore.style.opacity = 0;
            this.currentImage = data;
            setTimeout(() => {
                this.el_progressbar.style.display = 'block';
            }, 400);

        }

        uploadError(data) {
            this.trigger('error', data);
            alert('danger', 'not successfull');
        }

        //add to Utils?
        formatBytes(bytes) {
            var kb = 1024;
            var ndx = Math.floor(Math.log(bytes) / Math.log(kb));
            var fileSizeTypes = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

            return {
                size: +(bytes / kb / kb).toFixed(2),
                type: fileSizeTypes[ndx],
                human: +(bytes / kb / kb).toFixed(2) + fileSizeTypes[ndx]
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
