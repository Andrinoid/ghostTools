'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Utils.asMinutes = function (time) {
    var timeList = (time + '').split('.');
    if (timeList.length === 1) {
        timeList.push('00');
        return timeList.toString('.');
    }
    timeList[1] = timeList[1] * 6;
    return timeList.toString('.');
};

var Timeline = function () {

    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var STYLES = '\n        .timeline-wrapper {\n            padding: 30px;\n            font-size: 11px;\n            font-family: arial;\n        }\n        .time-ruler {\n            display: flex;\n            border-top: solid 1px #000;\n        }\n        .time-ruler .time-marker {\n            flex-grow: 1;\n            padding-top: 10px;\n            position: relative;\n        }\n        .time-ruler .time-marker > div {\n            display: inline-block;\n            transform: translate(-50%);\n        }\n        .time-ruler .time-marker:before {\n            content: \'\';\n            border-left: solid 1px #000;\n            height: 5px;\n            position: absolute;\n            left: 0;\n            top: 0;\n        }\n        .time-ruler .last-marker {\n            position: absolute;\n            right: 0;\n            transform: translateX(50%) !important;\n        }\n    ';

    var Template = '\n        <div class="time-ruler">\n            <!-- generated time markers -->\n        </div>\n    ';

    var Default = {
        data: [[0, 1498652042000, { 'type': 'image', 'url': 'foobar.com' }], [692, 1498656842000, { 'type': 'video', 'url': 'foobar.com' }], [679, 1498661642000, { 'type': 'tweet', 'url': 'foobar.com' }], [692, 1498666442000, { 'type': 'image', 'url': 'foobar.com' }], [624, 1498671242000, { 'type': 'image', 'url': 'foobar.com' }], [755, 1498676042000, { 'type': 'image', 'url': 'foobar.com' }], [1253, 1498680842000, { 'type': 'image', 'url': 'foobar.com' }], [673, 1498685642000, { 'type': 'image', 'url': 'foobar.com' }], [556, 1498690442000, { 'type': 'image', 'url': 'foobar.com' }], [426, 1498695242000, { 'type': 'image', 'url': 'foobar.com' }], [381, 1498700042000, { 'type': 'image', 'url': 'foobar.com' }], [367, 1498704842000, { 'type': 'image', 'url': 'foobar.com' }], [349, 1498709642000, { 'type': 'image', 'url': 'foobar.com' }], [337, 1498714442000, { 'type': 'image', 'url': 'foobar.com' }], [331, 1498719242000, { 'type': 'image', 'url': 'foobar.com' }], [298, 1498724042000, { 'type': 'image', 'url': 'foobar.com' }], [286, 1498728842000, { 'type': 'image', 'url': 'foobar.com' }], [282, 1498733642000, { 'type': 'image', 'url': 'foobar.com' }], [325, 1498738442000, { 'type': 'image', 'url': 'foobar.com' }], [255, 1498743242000, { 'type': 'image', 'url': 'foobar.com' }], [251, 1498748042000, { 'type': 'image', 'url': 'foobar.com' }], [109, 1498752842000, { 'type': 'image', 'url': 'foobar.com' }], [98, 1498757642000, { 'type': 'image', 'url': 'foobar.com' }], [75, 1498762442000, { 'type': 'image', 'url': 'foobar.com' }]],
        timePoints: 7
    };

    var Timeline = function (_Emitter) {
        _inherits(Timeline, _Emitter);

        function Timeline(wrapper, options) {
            _classCallCheck(this, Timeline);

            var _this = _possibleConstructorReturn(this, (Timeline.__proto__ || Object.getPrototypeOf(Timeline)).call(this));

            var defaultOpt = JSON.parse(JSON.stringify(Default));
            _this.defaults = Utils.extend(defaultOpt, options);
            _this.wrapper = wrapper;
            Utils.setClass(_this.wrapper, 'timeline-wrapper');

            _this.data = null;

            _this.injectStyles();
            _this.createDOM();
            _this.setEvents();
            _this.getGeneratedElms();
            _this.setData();
            return _this;
        }
        // getters

        _createClass(Timeline, [{
            key: 'injectStyles',
            value: function injectStyles() {
                //if styles exists do nothing
                if (document.getElementById('timelineStyles')) return;
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
        }, {
            key: 'createDOM',
            value: function createDOM() {
                Utils.setClass(this.wrapper, 'timeline');
                var template = (' ' + Template).slice(1); //Force string copy for. Bug in some  chrome versions
                this.wrapper.innerHTML = template;
            }
        }, {
            key: 'setEvents',
            value: function setEvents() {}
        }, {
            key: 'getGeneratedElms',
            value: function getGeneratedElms() {
                this.el_timeRuler = this.wrapper.querySelector('.time-ruler');
            }
        }, {
            key: 'setData',
            value: function setData() {
                var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.defaults.data;

                this.data = data;
                this.drawTimeline();
            }
        }, {
            key: 'drawTimeline',
            value: function drawTimeline() {
                var _this2 = this;

                var deltaTime = new Date(this.data[0][1]);
                var deltahour = deltaTime.getHours();
                var hour = deltahour;
                var marker = null;

                var _loop = function _loop(i) {
                    var isLast = i === _this2.defaults.timePoints - 1;
                    var item = _this2.data[i];
                    !isLast && (marker = new Elm('div.time-marker', _this2.el_timeRuler));
                    new Elm('div', {
                        text: Utils.asMinutes(hour),
                        cls: function () {
                            return isLast ? 'last-marker' : '';
                        }()
                    }, marker);

                    hour += 0.5;
                };

                for (var i = 0; i < this.defaults.timePoints; i++) {
                    _loop(i);
                }
            }
        }, {
            key: 'STYLES',
            get: function get() {
                return STYLES;
            }
        }, {
            key: 'Template',
            get: function get() {
                return Template;
            }
        }], [{
            key: 'Default',
            get: function get() {
                return Default;
            }
        }]);

        return Timeline;
    }(Emitter);

    return Timeline;
}();