import Utils from './utils';
import Elm from './elm';
import Emitter from './emitter';
import Alert from './alert';

Utils.asMinutes = (time) => {
    let timeList = (time + '').split('.');
    if(timeList.length === 1) {
        timeList.push('00')
        return timeList.toString('.');
    }
    timeList[1] = timeList[1] * 6;
    return timeList.toString('.');
};

const Timeline = (() => {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const STYLES = `
        .timeline-wrapper {
            padding: 30px;
            font-size: 11px;
            font-family: arial;
        }
        .time-ruler {
            display: flex;
            border-top: solid 1px #000;
        }
        .time-ruler .time-marker {
            flex-grow: 1;
            padding-top: 10px;
            position: relative;
        }
        .time-ruler .time-marker > div {
            display: inline-block;
            transform: translate(-50%);
        }
        .time-ruler .time-marker:before {
            content: '';
            border-left: solid 1px #000;
            height: 5px;
            position: absolute;
            left: 0;
            top: 0;
        }
        .time-ruler .last-marker {
            position: absolute;
            right: 0;
            transform: translateX(50%) !important;
        }
    `;

    let Template = `
        <div class="time-ruler">
            <!-- generated time markers -->
        </div>
    `;


    const Default = {
        data: [
            [
                0, 1498652042000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                692, 1498656842000, {'type': 'video', 'url': 'foobar.com'}
            ],
            [
                679, 1498661642000 ,{'type': 'tweet', 'url': 'foobar.com'}
            ],
            [
                692, 1498666442000 ,{'type': 'image', 'url': 'foobar.com'}
            ],
            [
                624, 1498671242000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                755, 1498676042000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                1253, 1498680842000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                673, 1498685642000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                556, 1498690442000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                426, 1498695242000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                381, 1498700042000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                367, 1498704842000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                349, 1498709642000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                337, 1498714442000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                331, 1498719242000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                298, 1498724042000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                286, 1498728842000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                282, 1498733642000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                325, 1498738442000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                255, 1498743242000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                251, 1498748042000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                109, 1498752842000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                98, 1498757642000, {'type': 'image', 'url': 'foobar.com'}
            ],
            [
                75, 1498762442000, {'type': 'image', 'url': 'foobar.com'}
            ],
        ],
        timePoints: 7
    };

    class Timeline extends Emitter {

        constructor(wrapper, options) {
            super();
            let defaultOpt = JSON.parse(JSON.stringify(Default))
            this.defaults = Utils.extend(defaultOpt, options);
            this.wrapper = wrapper;
            Utils.setClass(this.wrapper, 'timeline-wrapper')

            this.data = null;

            this.injectStyles();
            this.createDOM();
            this.setEvents();
            this.getGeneratedElms();
            this.setData();
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
            if (document.getElementById('timelineStyles'))
                return;
            var tag = document.createElement('style');
            tag.type = 'text/css';
            tag.id = 'timelineStyles';
            if (tag.styleSheet) {
                tag.styleSheet.cssText = STYLES;
            } else {
                tag.appendChild(document.createTextNode(STYLES));
            }
            document.getElementsByTagName('head')[0].appendChild(tag);
        }

        createDOM() {
            Utils.setClass(this.wrapper, 'timeline');
            let template = (' ' + Template).slice(1); //Force string copy for. Bug in some  chrome versions
            this.wrapper.innerHTML = template;
        }

        setEvents() {}

        getGeneratedElms() {
            this.el_timeRuler = this.wrapper.querySelector('.time-ruler');
        }

        setData(data = this.defaults.data) {
            this.data = data;
            this.drawTimeline();
        }

        drawTimeline() {
            let deltaTime = new Date(this.data[0][1]);
            let deltahour = deltaTime.getHours();
            let hour = deltahour;
            let marker = null;
            for (let i = 0; i < this.defaults.timePoints; i++) {
                let isLast = i === this.defaults.timePoints -1;
                let item = this.data[i];
                !isLast && (marker = new Elm('div.time-marker', this.el_timeRuler));
                new Elm('div', {
                    text: Utils.asMinutes(hour),
                    cls: (()=> {return isLast ? 'last-marker' : ''})()
                }, marker);

                hour += 0.5;
            }
        }
    }

    return Timeline;
})();

export default Timeline;
