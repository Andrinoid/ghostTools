"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Original - @Gozola. This is a reimplemented version (with a few bug fixes).
// edited https://gist.github.com/Raynos/1638059
var emitter = window.WeakMap ? new WeakMap() : function () {
    var privates = Name();

    return {
        get: function get(key, fallback) {
            var store = privates(key);
            return store.hasOwnProperty("value") ? store.value : fallback;
        },
        set: function set(key, value) {
            privates(key).value = value;
        },
        has: function has(key) {
            return "value" in privates(key);
        },
        "delete": function _delete(key) {
            return delete privates(key).value;
        }
    };

    function namespace(obj, key) {
        var store = { identity: key },
            valueOf = obj.valueOf;

        Object.defineProperty(obj, "valueOf", {
            value: function value(_value) {
                return _value !== key ? valueOf.apply(this, arguments) : store;
            },
            writable: true
        });

        return store;
    }

    function Name() {
        var key = {};
        return function (obj) {
            var store = obj.valueOf(key);
            return store && store.identity === key ? store : namespace(obj, key);
        };
    }
}();

// https://github.com/JFusco/es6-event-emitter/blob/master/src/emitter.js

var Emitter = function () {
    function Emitter() {
        _classCallCheck(this, Emitter);

        emitter.set(this, {
            events: {}
        });

        this.eventLength = 0;
    }

    _createClass(Emitter, [{
        key: "on",
        value: function on(event, cb) {
            if (typeof cb === 'undefined') {
                throw new Error('You must provide a callback method.');
            }

            if (typeof cb !== 'function') {
                throw new TypeError('Listener must be a function');
            }

            this.events[event] = this.events[event] || [];
            this.events[event].push(cb);

            this.eventLength++;

            return this;
        }
    }, {
        key: "off",
        value: function off(event, cb) {
            if (typeof cb === 'undefined') {
                throw new Error('You must provide a callback method.');
            }

            if (typeof cb !== 'function') {
                throw new TypeError('Listener must be a function');
            }

            if (typeof this.events[event] === 'undefined') {
                throw new Error("Event not found - the event you provided is: " + event);
            }

            var listeners = this.events[event];

            listeners.forEach(function (v, i) {
                if (v === cb) {
                    listeners.splice(i, 1);
                }
            });

            if (listeners.length === 0) {
                delete this.events[event];

                this.eventLength--;
            }

            return this;
        }
    }, {
        key: "trigger",
        value: function trigger(event) {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            if (typeof event === 'undefined') {
                throw new Error('You must provide an event to trigger.');
            }

            var listeners = this.events[event];

            if (typeof listeners !== 'undefined') {
                listeners = listeners.slice(0);

                listeners.forEach(function (v) {
                    v.apply(_this, args);
                });
            }

            return this;
        }
    }, {
        key: "events",
        get: function get() {
            return emitter.get(this).events;
        }
    }]);

    return Emitter;
}();