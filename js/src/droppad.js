import Utils from './utils';
import Elm from './elm';
import Emitter from './emitter';



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
        }

        .imageCloud .dropSheet > div p {
            font-size: 18px;
        }

        .imageCloud .fallBack {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            pointer-events: none;
            background-color: gray;
            background-size: cover;
            background-position: center;
        }

        .imageCloud .loadedImage {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
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
            height: 6px;
            width: 0%;
            background: #66ce66;
            z-index: 1;
            transition: ease all 0.4s
        }
        .droppad-input {
            position: absolute;
            top: 0;
            left: 0;
            height: 0;
            width: 0;
            visibility: hidden;
        }
    `;

    const Default = {
        url: '',
        backgroundImage: '',
        maxFilesize: 8, //in MB TODO
        paramName: "file",
        includeStyles: true,
        acceptedFiles: 'jpeg, jpg, png, gif',
    };

    const Template = `
        <div class="progressbar"></div>
        <div class="fallBack" style="opacity: 1;"></div>
        <div class="loadedImage"></div>
        <div class="dropSheet shown">
            <div>
                <div class="dropLabel"><p>Drop Image here.</p>
                    <p>
                        <small>or click here</small>
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
            this.injectStyles();
            this.createDOM();
            this.setEvents();
            this.droppadElements();
            this.setBackground();
        }

        // getters

        static get Default() {
            return Default
        }

        get STYLES() {
            return STYLES
        }

        get Template() {
            return Template
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
            Utils.setClass(this.droppad, 'droppad-clickable');

            this.droppad.innerHTML = Template;
            this.el_clickableInput = new Elm('input.droppad-input', {
                type: 'file',
                change: (e) => {
                    let file = e.target.files[0];
                    this.showAsBackground(file);
                    //this.sendFile(file);
                    this.upload(e.target.files);
                }
            }, document.body);
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
            // add event to document and listen for droppad-clickable elements
            document.addEventListener('click', (e) => {
                var clsList = Array.prototype.slice.call(e.target.classList);
                if (clsList.indexOf('droppad-clickable') > -1) {
                    this.el_clickableInput.click();
                }
            });
        }

        droppadElements() {
            this.el_fallback = this.droppad.querySelector('.fallBack');
            this.el_loadedImage = this.droppad.querySelector('.loadedImage');
            this.el_progressbar = this.droppad.querySelector('.progressbar');
        }

        setBackground() {
            this.el_fallback.style.backgroundImage = `url(${this.defaults.backgroundImage})`;
        }

        showAsBackground(file) {
            /**
             * let the image fade in 500ms
             * then add it to the layer behind so we can repeat the effect on next drop
             */
            var reader = new FileReader();
            reader.onload = (event) => {
                this.el_loadedImage.style.backgroundImage = 'url(' + event.target.result + ')';
                this.el_loadedImage.style.opacity = 1;
                setTimeout(() => {
                    this.el_fallback.style.backgroundImage = 'url(' + event.target.result + ')';
                }, 500);
            };
            reader.readAsDataURL(file);
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
            var file = files[0];

            this.showAsBackground(file);
            this.upload(files);
        }

        validate(file) {
            let rtn = {};
            let errors = [];
            let mimeType = file.type;
            let baseMimeType = file.type.split('/')[0];
            let maxFilesize = this.defaults.maxFilesize * 1024 * 1024;
            console.log(file);
            let tests = [
                function size(file) {
                    if(file.size > maxFilesize) {
                        errors.push({isValid: false, reason: 'file is too big.'})
                    }
                },
            ];

            Utils.foreach(tests, (fn)=> {
                fn(file);
            });

            console.log(errors);

            return true;
        }

        upload(files) {
            let headers = {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': '*/*',
            };

            let formData = new FormData();
            for (var i = 0; i < files.length; i++) {
                let file = files[i];

                let validation = this.validate(file);
                if (validation.isValid) {
                    console.log('not valid', file);

                }
                formData.append('file', file, file.name); //file.name is not required Check server side implementation of this
            }
            let xhr = new XMLHttpRequest();
            xhr.open('POST', this.defaults.url, true);
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
                }
            }
            xhr.upload.addEventListener('progress', (e) => {
                let loadedPercent = (e.loaded / e.total * 100).toFixed();
                this.uploadProgress(loadedPercent);
            }, false);

            xhr.send(formData);
        }

        uploadProgress(percentage) {
            this.trigger('progress', percentage);
            this.el_progressbar.style.width = percentage + '%';
        }

        uploadSuccess(data) {
            this.trigger('success', data);
            this.el_progressbar.style.display = 'none';
            this.el_progressbar.style.width = 0;

            this.el_fallback.style.opacity = 1;
            this.el_loadedImage.style.opacity = 0;

            setTimeout(() => {
                this.el_progressbar.style.display = 'block';
            }, 400);

        }

        uploadError(data) {
            this.trigger('error', data);
        }

        //currently not used add to Utils?
        formatBytes(bytes) {
            var kb = 1024;
            var ndx = Math.floor(Math.log(bytes) / Math.log(kb));
            var fileSizeTypes = ["bytes", "kb", "mb", "gb", "tb", "pb", "eb", "zb", "yb"];

            return {
                size: +(bytes / kb / kb).toFixed(2),
                type: fileSizeTypes[ndx]
            };
        }
    }

    return Droppad;
})();

//TODO

//change imagecloud to droppad or somthing unique
//check filesize
//Image service should return full path as webkit-overflow-scrolling
//Check browser support
//change fallBack to more appropriate name
//deal with multiple files q

export default Droppad;
