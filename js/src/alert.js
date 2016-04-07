import Utils from './utils';
import Elm from './element';

const Alertsyles = `
         .js_alerts .modal-body,
         .js_alerts .modal-title {
             font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
             line-height: 1.42857143;
             color: #333
         }
         .js_alerts .js_modal,
         .js_alerts .modal-backdrop {
             position: fixed;
             top: 0;
             right: 0;
             bottom: 0;
             left: 0
         }
         .js_alerts .modal-backdrop {
             z-index: 1040;
             background-color: #000;
             opacity: .5
         }

         .js_alerts .js_modal {
             z-index: 10000;
             overflow-y: scroll;
             -webkit-overflow-scrolling: touch;
             outline: 0
         }
         .js_alerts .js_dialog {
             position: relative;
             width: auto;
             margin: 10px
         }
         .js_alerts .modal-header .close {
             margin-top: -2px;
             position: static;
             height: 30px;
         }
         .js_alerts .modal-theme-blue .close {
             text-shadow: none;
             opacity: 1;
             font-size: 31px;
             font-weight: normal;
         }
         .js_alerts .modal-theme-blue .close span {
             color: white;
         }
         .js_alerts .modal-theme-blue .close span:hover {
             color: #fbc217;
         }
         .js_alerts .close.standalone {
             position: absolute;
             right: 15px;
             top: 13px;
             z-index: 1;
             height: 30px;
         }
         .js_alerts .modal-title {
             margin: 0;
             font-size: 18px;
             font-weight: 500
         }
         .js_alerts button.close {
             -webkit-appearance: none;
             padding: 0;
             cursor: pointer;
             background: 0 0;
             border: 0
         }
         .js_alerts .modal-content {
             position: relative;
             background-color: #fff;
             background-clip: padding-box;
             border: 1px solid #999;
             border: 1px solid rgba(0, 0, 0, .2);
             border-radius: 2px;
             outline: 0;
             box-shadow: 0 3px 9px rgba(0, 0, 0, .5)
         }
         .js_alerts .modal-theme-blue .modal-content {
            background-color: #4a6173;
         }
         .js_alerts .modal-header {
             min-height: 16.43px;
             padding: 15px;
             border-bottom: 1px solid #e5e5e5;
             min-height: 30px
         }
         .js_alerts .modal-theme-blue .modal-header {
            border-bottom: none;
         }
         .js_alerts .modal-body {
             position: relative;
             padding: 15px;
             font-size: 14px
         }
         .js_alerts .close {
             float: right;
             font-size: 21px;
             font-weight: 700;
             line-height: 1;
             color: #000;
             text-shadow: 0 1px 0 #fff;
             opacity: .2
         }
         @media (min-width: 768px) {
             .js_alerts .js_dialog {
                 width: 600px;
                 margin: 30px auto
             }
             .js_alerts .modal-content {
                 box-shadow: 0 5px 15px rgba(0, 0, 0, .5)
             }
             .js_alerts .js_modal-sm {
                 width: 300px
             }
         }
         @media (min-width: 992px) {
             .js_alerts .js_modal-lg {
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
         }

        /* Alert styles */
        .js_alerts {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            pointer-events: none;
        }
        .js_alerts .js_dialog {
            pointer-events: all;
        }
        .js_alerts .js_alert .js_modal {
            overflow-y: auto;
            position: static;
        }
        .js_alerts .js_alert .modal-content {
            padding: 20px;
            margin: 20px 0;
            border: 1px solid #eeeeee;
            border-left-width: 5px;
            border-radius: 3px;
            font: inherit;
        }
        .js_alerts .js_success .modal-content{
            border-left-color: #5bc0de;
        }
        .js_alerts .js_danger .modal-content{
            border-left-color: #d9534f;
        }
        .js_alerts .js_info .modal-content{
            border-left-color: #f0ad4e;
        }`;

const STYLES = Alertsyles;

/**
 * ------------------------------------------------------------------------
 * Modal
 * Creates Modal
 * ------------------------------------------------------------------------
 */

class Alert {

    constructor(type, options) {

        let args = arguments;
        if (args[0] !== 'success' && args[0] !== 'info' && args[0] !== 'danger') {
            type = 'success';
            options = {
                message: args[0]
            };
        }
        else if (typeof(args[0]) === 'string' && typeof(args[1]) === 'string') {
            options = {
                message: args[1]
            };
        }
        this.type = type;
        this.defaults = {
            message: '',
            theme: 'classic',
            customClass: 'js_alert',
            withBackdrop: false,
            size: 'large',//large small
            closeOthers: false,
            timer: 3000,

            title: '',
            onClose: function () {
            },
            onOpen: function () {
            }
        };

        this.defaults = Utils.extend(this.defaults, options);
        this.parent = document.body;
        this.__proto__.instances.push(this);
        this.buildTemplate();
        this._injectTemplate();
        if (this.defaults.timer) this.autoClose();

        this._injectStyles();

    }

    autoClose() {
        setTimeout(() => {
            this.close();
        }, this.defaults.timer);
    }

    buildTemplate() {
        let sizeMap = {
            'small': 'js_modal-sm',
            'normal': '',
            'large': 'js_modal-lg'
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
            html: main, 'class': `modal-theme-${this.defaults.theme} js_${this.type}`,
            cls: this.defaults.customClass
        });

        let btn = this.modal.querySelector('.close');
        this.chainDialog = this.modal.querySelector('.js_dialog');
        btn.onclick = ()=> {
            this.close();
        };
        if (this.defaults.type === 'modal') {
            Utils.setClass(document.body, 'modal-mode');
        }

    }

    _injectTemplate() {
        this._closeIfCondition();
        this.parent = document.querySelector('.js_alerts') || new Elm('div.js_alerts', document.body);
        this.parent.insertBefore(this.modal, this.parent.firstChild);
    }

    _injectStyles() {
        if (!document.querySelector('.js-alert-styles')) {
            new Elm('style.js-alert-styles', {
                html: STYLES
            }, document.body);
        }
    }

    _closeIfCondition() {
        if (this.defaults.closeOthers && typeof(this.defaults.closeOthers) === 'number') {
            let max = this.defaults.closeOthers;
            console.log(max);
            if(this.__proto__.instances.length > max) {
                this.__proto__.instances[this.__proto__.instances.length - 1]._close();
            }
        } else if (this.defaults.closeOthers && typeof(this.defaults.closeOthers) === 'boolean') {
            this.__proto__.closeAll();
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
        this._close(this.defaults.onClose);
    }

}
Alert.prototype.instances = [];
Alert.prototype.closeAll = function () {
    this.instances.forEach(function (item) {
        item._close();
    });
    this.instances.length = 0;
};

export default Alert;
