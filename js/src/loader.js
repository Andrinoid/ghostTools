import Utils from './utils';
/**
 * ------------------------------------------------------------------------
 * Loading creates a full sheet overlay with hypnotic balls
 * ------------------------------------------------------------------------
 */
const Loader = (() => {

    /**
     * ------------------------------------------------------------------------
     * Constants
     *
     * ------------------------------------------------------------------------
     */
    const Templates = [];
    Templates.push(`
      <div class="sl-container">
         <style scoped>
         .simpleLoader {
             position: fixed;
             top: 0;
             left: 0;
             right: 0;
             bottom: 0;
             background: rgba(0, 0, 0, 0.36);
             z-index: 9999;
         }
         .simpleLoader .sl-container {
             position: absolute;
             top: 50%;
             left: 50%;
             -webkit-transform: translate(-50%, -50%);
             transform: translate(-50%, -50%);
         }
         .simpleLoader .sl-dot {
             width: 20px;
             height: 20px;
             border: 2px solid white;
             border-radius: 50%;
             float: left;
             margin: 0 5px;
             -webkit-transform: scale(0);
             transform: scale(0);
             -webkit-animation: fx 1000ms ease infinite 0ms;
             animation: fx 1000ms ease infinite 0ms;
         }
         .simpleLoader .sl-dot:nth-child(2) {
             -webkit-animation: fx 1000ms ease infinite 300ms;
             animation: fx 1000ms ease infinite 300ms;
         }
         .simpleLoader .sl-dot:nth-child(3) {
             -webkit-animation: fx 1000ms ease infinite 600ms;
             animation: fx 1000ms ease infinite 600ms;
         }
         @-webkit-keyframes fx {
             50% {
                 -webkit-transform: scale(1);
                 transform: scale(1);
                 opacity: 1;
             }
             100% {
                 opacity: 0;
             }
         }
         @keyframes fx {
             50% {
                 -webkit-transform: scale(1);
                 transform: scale(1);
                 opacity: 1;
             }
             100% {
                 opacity: 0;
             }
         }
         </style>
         <div class="sl-dot"></div>
         <div class="sl-dot"></div>
         <div class="sl-dot"></div>
       </div>
     `);

    // Material design circular activity spinner
    // This is the built in chrome spinner and might fail in other browsers
    Templates.push(`
    <div class="loaderWrapper">
        <svg version="1" xmlns="http://www.w3.org/2000/svg"
                         xmlns:xlink="http://www.w3.org/1999/xlink"
             width="25px" height="25px" viewBox="0 0 16 16">
            <style scoped>
              .simpleLoader {
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                  z-index: 1000;
              }
              .qp-circular-loader {
                width:16px;  /* 2*RADIUS + STROKEWIDTH */
                height:16px; /* 2*RADIUS + STROKEWIDTH */
              }
              .qp-circular-loader-path {
                stroke-dasharray: 32.4;  /* 2*RADIUS*PI * ARCSIZE/360 */
                stroke-dashoffset: 32.4; /* 2*RADIUS*PI * ARCSIZE/360 */
                                         /* hides things initially */
              }
              /* SVG elements seem to have a different default origin */
              .qp-circular-loader, .qp-circular-loader * {
                -webkit-transform-origin: 50% 50%;
              }
              /* Rotating the whole thing */
              @-webkit-keyframes rotate {
                from {transform: rotate(0deg);}
                to {transform: rotate(360deg);}
              }
              .qp-circular-loader {
                -webkit-animation-name: rotate;
                -webkit-animation-duration: 1568.63ms; /* 360 * ARCTIME / (ARCSTARTROT + (360-ARCSIZE)) */
                -webkit-animation-iteration-count: infinite;
                -webkit-animation-timing-function: linear;
              }
              /* Filling and unfilling the arc */
              @-webkit-keyframes fillunfill {
                from {
                  stroke-dashoffset: 32.3 /* 2*RADIUS*PI * ARCSIZE/360 - 0.1 */
                                          /* 0.1 a bit of a magic constant here */
                }
                50% {
                  stroke-dashoffset: 0;
                }
                to {
                  stroke-dashoffset: -31.9 /* -(2*RADIUS*PI * ARCSIZE/360 - 0.5) */
                                           /* 0.5 a bit of a magic constant here */
                }
              }
              @-webkit-keyframes rot {
                from {
                  transform: rotate(0deg);
                }
                to {
                  transform: rotate(-360deg);
                }
              }
              @-webkit-keyframes colors {
                from {
                  stroke: #4285f4;
                }
                to {
                  stroke: #4285f4;
                }
              }
              .qp-circular-loader-path {
                -webkit-animation-name: fillunfill, rot, colors;
                -webkit-animation-duration: 1333ms, 5332ms, 5332ms; /* ARCTIME, 4*ARCTIME, 4*ARCTIME */
                -webkit-animation-iteration-count: infinite, infinite, infinite;
                -webkit-animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1), steps(4), linear;
                -webkit-animation-play-state: running, running, running;
                -webkit-animation-fill-mode: forwards;
              }
            </style>
            <!-- 2.25= STROKEWIDTH -->
            <!-- 8 = RADIUS + STROKEWIDTH/2 -->
            <!-- 6.875= RADIUS -->
            <!-- 1.125=  STROKEWIDTH/2 -->
            <g class="qp-circular-loader">
            <path class="qp-circular-loader-path" fill="none"
                  d="M 8,1.125 A 6.875,6.875 0 1 1 1.125,8" stroke-width="2.25"
                  stroke-linecap="round"></path>
            </g>
            </svg>
        </div>
    `);

    const Default = {
        template: '0', // 0 or 1
        parent: document.body,
        allowMany: false
    };

    class Loader {
        constructor(options) {
            this.id = 'loader-' + (++this.__proto__.counter);
            this.defaults = Utils.extend(Default, options);
            if(!this.defaults.allowMany) {
                this.__proto__.removeAll();
            }
            this.__proto__.instances[this.id] = this;
            this.createDOM();
        }

        createDOM() {
            let wrapper = document.createElement('div');
            wrapper.id = this.id;
            wrapper.className = 'simpleLoader';
            wrapper.innerHTML = Templates[this.defaults.template];
            this.defaults.parent.appendChild(wrapper);
        }

        remove() {
            var loader = document.querySelector('#' + this.id);
            loader.parentNode.removeChild(loader);
            delete this.__proto__.instances[this.id];
        }
    }
    return Loader;
})();
Loader.prototype.instances = {};
Loader.prototype.counter = 0;
Loader.prototype.removeAll = function() {
    Utils.foreach(this.instances, function(item) {
        try {
            item.remove();
        } catch(err) {
            //pass
        }
    });
    this.instances.length = 0;
};

export default Loader;
