import Utils from './utils';
import Emitter from './emitter';

var inline = new Inline();
class Droppad extends Emitter {

    constructor(elm, options) {
        super();
        this.droppad = elm;
        this.defaults = {
            url: 'http://kotturinn.com/icloud/upload/body/test',
            //method: "post",
            maxFilesize: 256, //in MB
            paramName: "file",
        };
        this.defaults = Utils.extend(this.defaults, options);
        this.createDOM();
        this.setEvents();
    }

    createDOM() {

    }

    setEvents() {
        function noPropagation(e) {
            if (e.stopPropagation) {
                e.stopPropagation()
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
        }
    }

    showAsBackground(file) {
        var reader = new FileReader();
        reader.onload = (event) => {
            console.log(event.target.result);
            let display = this.droppad.querySelector('.loadedImage');
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

    sendFile(file) {
        console.log('sending file');
        function progress(value) {
            console.log(value);
        }
        function callback(data) {
          console.log(data);
        }
        inline.upload(this.defaults.url, file, null, progress).run(callback);
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
        this.trigger('dragenter', e);
    }

    drop(e) {
        Utils.removeClass(this.droppad, 'dragover');
        this.trigger('dragenter', e);
        var files = e.target.files || e.dataTransfer.files;
        var file = files[0];
        console.log(file);
        this.showAsBackground(file);
        this.sendFile(file);
    }

}
//TODO
//build dom and styles
//add regular input for clickable area
//show progress on upload
//Image service should return full path as webkit-overflow-scrolling
//Check browser support
//do built in xhr requests
export default Droppad;
