import * as utils from './utils';
import Elm from './element';
import {ALERT_CSS, MODAL_CSS} from './styles';
const STYLES = MODAL_CSS + ALERT_CSS;

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

        this.defaults = utils.extend(this.defaults, options);
        this.parent = document.body;

        if (this.defaults.closeOthers) this.__proto__.closeAll();
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
            utils.setClass(document.body, 'modal-mode');
        }

    }

    _injectTemplate() {
        this.parent = document.querySelector('.js_alerts') || new Elm('div.js_alerts', document.body);
        this.parent.appendChild(this.modal);
    }

    _injectStyles() {
        if (!document.querySelector('.styleFallback')) {
            new Elm('style.styleFallback', {
                html: STYLES
            }, document.body);
        }
    }

    _close(cb = ()=> {
    }) {
        if (this.defaults.withBackdrop) {
            utils.fadeOutRemove(this.backdrop);
        }
        utils.setClass(this.chainDialog, 'fadeOutTop');
        setTimeout(()=> {
            this.modal.remove();
            utils.removeClass(document.body, 'modal-mode');
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
