export var MODAL_CSS = `
        /* Modal styles */
         body.modal-mode {
             overflow: hidden
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

export var ALERT_CSS = `
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
        }

        `;
