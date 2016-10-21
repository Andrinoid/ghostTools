import Utils from './utils';
import Elm from './elm';

/**
 * ------------------------------------------------------------------------
 * Modal
 * Creates Modal
 * ------------------------------------------------------------------------
 */
const Modalstyles = `
        /* Modal styles */
         body.modal-mode {
             overflow: hidden !important
         }
         .modal-body,
         .modal-title {
             font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
             line-height: 1.42857143;
             color: #333
         }
         .js_modal,
         .modal-backdrop {
             position: fixed;
             top: 0;
             right: 0;
             bottom: 0;
             left: 0
         }
         .modal-backdrop {
             z-index: 1040;
             background-color: #000;
             opacity: .5
         }

         .js_modal {
             z-index: 10000;
             overflow-y: scroll;
             -webkit-overflow-scrolling: touch;
             outline: 0
         }
         .js_dialog {
             position: relative;
             width: auto;
             margin: 10px
         }
         .modal-header .close {
             margin-top: -2px;
             position: static;
             height: 30px;
         }
         .modal-theme-blue .close {
             text-shadow: none;
             opacity: 1;
             font-size: 31px;
             font-weight: normal;
         }
         .modal-theme-blue .close span {
             color: white;
         }
         .modal-theme-blue .close span:hover {
             color: #fbc217;
         }
         .close.standalone {
             position: absolute;
             right: 15px;
             top: 13px;
             z-index: 1;
             height: 30px;
         }
         .modal-title {
             margin: 0;
             font-size: 18px;
             font-weight: 500
         }
         button.close {
             -webkit-appearance: none;
             padding: 0;
             cursor: pointer;
             background: 0 0;
             border: 0
         }
         .modal-content {
             position: relative;
             background-color: #fff;
             background-clip: padding-box;
             border: 1px solid #999;
             border: 1px solid rgba(0, 0, 0, .2);
             border-radius: 2px;
             outline: 0;
             box-shadow: 0 3px 9px rgba(0, 0, 0, .5)
         }
         .modal-theme-blue .modal-content {
            background-color: #4a6173;
         }
         .modal-header {
             min-height: 16.43px;
             padding: 15px;
             border-bottom: 1px solid #e5e5e5;
             min-height: 30px
         }
         .modal-theme-blue .modal-header {
            border-bottom: none;
         }
         .modal-body {
             position: relative;
             padding: 15px;
             font-size: 14px
         }
         .close {
             float: right;
             font-size: 21px;
             font-weight: 700;
             line-height: 1;
             color: #000;
             text-shadow: 0 1px 0 #fff;
             opacity: .2
         }
         .js_dialog.js_modal-full {
            margin: 0;
            height: 100%;
            width: 100%;
         }
         .js_dialog.js_modal-full .modal-content {
            border: none;
            box-shadow: none;
            border-radius: 0;
            height: 100%;
         }
         @media (min-width: 768px) {
             .js_dialog {
                 width: 600px;
                 margin: 30px auto
             }
             .modal-content {
                 box-shadow: 0 5px 15px rgba(0, 0, 0, .5)
             }
             .js_modal-sm {
                 width: 300px
             }
         }
         @media (min-width: 992px) {
             .js_modal-lg {
                 width: 900px
             }
         }

         .ghost-focus {
             background: transparent;
             z-index: 1000;
         }


         /*** Animations ***/
         @-webkit-keyframes fadeInDown {
             from {
                 opacity: 0;
                 -webkit-transform: translate3d(0, -10px, 0);
                 transform: translate3d(0, -10px, 0);
             }
             to {
                 opacity: 1;
                 -webkit-transform: none;
                 transform: none;
             }
         }
         @keyframes fadeInDown {
             from {
                 opacity: 0;
                 -webkit-transform: translate3d(0, -10px, 0);
                 transform: translate3d(0, -10px, 0);
             }
             to {
                 opacity: 1;
                 -webkit-transform: none;
                 transform: none;
             }
         }
         @-webkit-keyframes fadeInTop {
             from {
                 opacity: 0;
                 -webkit-transform: translate3d(0, 10px, 0);
                 transform: translate3d(0, 10px, 0);
             }
             to {
                 opacity: 1;
                 -webkit-transform: none;
                 transform: none;
             }
         }
         @keyframes fadeInTop {
             from {
                 opacity: 0;
                 -webkit-transform: translate3d(0, 10px, 0);
                 transform: translate3d(0, 10px, 0);
             }
             to {
                 opacity: 1;
                 -webkit-transform: none;
                 transform: none;
             }
         }
         @-webkit-keyframes fadeOutTop {
             0% {
                 opacity: 1;
                 -webkit-transform: none;
                 transform: none
             }
             100% {
                 opacity: 0;
                 -webkit-transform: translate3d(0, -10px, 0);
                 transform: translate3d(0, -10px, 0)
             }
         }
         @keyframes fadeOutTop {
             0% {
                 opacity: 1;
                 -webkit-transform: none;
                 transform: none
             }
             100% {
                 opacity: 0;
                 -webkit-transform: translate3d(0, -10px, 0);
                 transform: translate3d(0, -10px, 0)
             }
         }
         @-webkit-keyframes fadeInLeft {
             from {
                 opacity: 0;
                 -webkit-transform: translate3d(-10px, 0, 0);
                 transform: translate3d(-10px, 0, 0);
             }
             to {
                 opacity: 1;
                 -webkit-transform: none;
                 transform: none;
             }
         }
         @keyframes fadeInLeft {
             from {
                 opacity: 0;
                 -webkit-transform: translate3d(-10px, 0, 0);
                 transform: translate3d(-10px, 0, 0);
             }
             to {
                 opacity: 1;
                 -webkit-transform: none;
                 transform: none;
             }
         }
         @-webkit-keyframes fadeInRight {
             from {
                 opacity: 0;
                 -webkit-transform: translate3d(10px, 0, 0);
                 transform: translate3d(10px, 0, 0);
             }
             to {
                 opacity: 1;
                 -webkit-transform: none;
                 transform: none;
             }
         }
         @keyframes fadeInRight {
             from {
                 opacity: 0;
                 -webkit-transform: translate3d(10px, 0, 0);
                 transform: translate3d(10px, 0, 0);
             }
             to {
                 opacity: 1;
                 -webkit-transform: none;
                 transform: none;
             }
         }
         .fadeInDown,
         .fadeInLeft,
         .fadeInRight,
         .fadeInTop,
         .fadeOutTop{
             -webkit-animation-fill-mode: both;
             -webkit-animation-duration: .5s;
             animation-duration: .5s;
             animation-fill-mode: both;
         }
         .fadeInDown {
             -webkit-animation-name: fadeInDown;
             animation-name: fadeInDown;
         }
         .fadeInLeft {
             -webkit-animation-name: fadeInLeft;
             animation-name: fadeInLeft;
         }
         .fadeInRight {
             -webkit-animation-name: fadeInRight;
             animation-name: fadeInRight;
         }
         .fadeInTop {
             -webkit-animation-name: fadeInTop;
             animation-name: fadeInTop;
         }
         .fadeOutTop {
             -webkit-animation-name: fadeOutTop;
             animation-name: fadeOutTop;
         }`;


class Modal {

    constructor(options) {

        this.defaults = {
            title: '',
            message: '',
            theme: 'classic',
            withBackdrop: true,
            size: 'normal',//large small full
            customClass: '',
            onClose: function () {
            },
            onOpen: function () {
            },
            closeOthers: true,
            autoClose: false,
            autoCloseTime: 2000,
            type: 'modal',
            parent: document.body

        };
        this.defaults = Utils.extend(this.defaults, options);
        this.parent = this.defaults.parent; //TODO resolve jquery, array like objects or proper error message
        this.STYLES = Modalstyles;

        if (this.defaults.closeOthers) this.__proto__.closeAll();
        this.__proto__.instances.push(this);
        this.buildTemplate();
        this._injectTemplate();
        if (this.defaults.autoClose) this.autoClose();

        this._injectStyles();

    }

    autoClose() {
        setTimeout(() => {
            this.close();
        }, this.defaults.autoCloseTime);
    }

    buildTemplate() {
        let sizeMap = {
            'small': 'js_modal-sm',
            'normal': '',
            'large': 'js_modal-lg',
            'full': 'js_modal-full'
        };
        let sizeClass = sizeMap[this.defaults.size];

        if (this.defaults.withBackdrop) {
            this.backdrop = new Elm('div.modal-backdrop', document.body);
        }

        let header = this.defaults.title ?
            `<div class="modal-header">
                    <button type="button" class="close"><span>×</span></button>
                    <h4 class="modal-title" id="myModalLabel">${this.defaults.title}</h4>
                </div>` : '<button type="button" class="close standalone"><span>×</span></button>';


        let main = `
                <div class="js_modal fadeInDown">
                    <div class="js_dialog ${sizeClass}">
                        <div class="modal-content">
                            ${header}
                            <div class="modal-body">
                                <div>${this.defaults.message}</div>
                            </div>
                        </div>
                    </div>
                </div>`;

        this.modal = new Elm('div', {
            html: main, 'class': `modal-theme-${this.defaults.theme}`,
            cls: this.defaults.customClass
        });

        let btn = this.modal.querySelectorAll('.close, .close-trigger');
        this.chainDialog = this.modal.querySelector('.js_dialog');

        for (var i=0; i<btn.length; i++) {
            btn[i].addEventListener('click', ()=> { this.close() }, false);
        }

        if (this.defaults.type === 'modal') {
            Utils.setClass(document.body, 'modal-mode');
        }

    }

    _injectTemplate() {
        this.parent.appendChild(this.modal);
        this.defaults.onOpen();
    }

    _injectStyles() {
        if (!document.querySelector('.styleFallback')) {
            new Elm('style.styleFallback', {
                html: this.STYLES
            }, document.querySelector('head'));
        }
    }

    _close(cb = ()=> {
    }) {
        if (this.defaults.withBackdrop) {
            Utils.fadeOutRemove(this.backdrop);
        }
        Utils.setClass(this.chainDialog, 'fadeOutTop');
        setTimeout(()=> {
            this.modal.remove();
            Utils.removeClass(document.body, 'modal-mode');
            cb();
        }, 500);
    }

    close() {
        this._close(this.defaults.onClose); //TODO emmitter
    }

    // Remove modal without animation
    _remove() {
        this.backdrop.remove();
        this.modal.remove();
        Utils.removeClass(document.body, 'modal-mode');
    }

}
Modal.prototype.instances = [];
Modal.prototype.closeAll = function () {
    this.instances.forEach(function (item) {
        item._remove();
    });
    this.instances.length = 0;
};

export default Modal;
