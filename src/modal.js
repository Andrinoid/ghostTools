import * as utils from './utils';
import Elm from './element';
import {MODAL_CSS} from './styles';

/**
 * ------------------------------------------------------------------------
 * Modal
 * Creates Modal
 * ------------------------------------------------------------------------
 */

class Modal {

    constructor(options) {

        this.defaults = {
            title: '',
            message: '',
            theme: 'classic',
            withBackdrop: true,
            size: 'normal',//large small
            customClass: '',
            onClose: function () {
            },
            onOpen: function () {
            },
            closeOthers: true,
            autoClose: false,
            autoCloseTime: 2000,
            type: 'modal'
        };
        this.defaults = utils.extend(this.defaults, options);
        this.parent = document.body;
        this.STYLES = MODAL_CSS;

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
            html: main, 'class': `modal-theme-${this.defaults.theme}`,
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
        this.parent.appendChild(this.modal);
    }

    _injectStyles() {
        if (!document.querySelector('.styleFallback')) {
            new Elm('style.styleFallback', {
                html: this.STYLES
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
Modal.prototype.instances = [];
Modal.prototype.closeAll = function () {
    this.instances.forEach(function (item) {
        item._close();
    });
    this.instances.length = 0;
};

export default Modal;


