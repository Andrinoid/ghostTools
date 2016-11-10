// Original - @Gozola. This is a reimplemented version (with a few bug fixes).
// edited https://gist.github.com/Raynos/1638059
const emitter = window.WeakMap ? new WeakMap() : (function () {
    var privates = Name()

    return {
        get: function (key, fallback) {
            var store = privates(key)
            return store.hasOwnProperty("value") ?
                store.value : fallback
        },
        set: function (key, value) {
            privates(key).value = value
        },
        has: function(key) {
            return "value" in privates(key)
        },
        "delete": function (key) {
            return delete privates(key).value
        }
    }

    function namespace(obj, key) {
        var store = { identity: key },
            valueOf = obj.valueOf

        Object.defineProperty(obj, "valueOf", {
            value: function (value) {
                return value !== key ?
                    valueOf.apply(this, arguments) : store
            },
            writable: true
        })

        return store
    }

    function Name() {
        var key = {}
        return function (obj) {
            var store = obj.valueOf(key)
            return store && store.identity === key ?
                store : namespace(obj, key)
        }
    }
}());

// https://github.com/JFusco/es6-event-emitter/blob/master/src/emitter.js
class Emitter {
    constructor() {
        emitter.set(this, {
            events: {}
        });

        this.eventLength = 0;
    }

    on(event, cb) {
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

    off(event, cb) {
        if (typeof cb === 'undefined') {
            throw new Error('You must provide a callback method.');
        }

        if (typeof cb !== 'function') {
            throw new TypeError('Listener must be a function');
        }

        if (typeof this.events[event] === 'undefined') {
            throw new Error(`Event not found - the event you provided is: ${event}`);
        }

        const listeners = this.events[event];

        listeners.forEach((v, i) => {
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

    trigger(event, ...args) {
        if (typeof event === 'undefined') {
            throw new Error('You must provide an event to trigger.');
        }

        let listeners = this.events[event];

        if (typeof listeners !== 'undefined') {
            listeners = listeners.slice(0);

            listeners.forEach((v) => {
                v.apply(this, args);
            });
        }

        return this;
    }

    get events() {
        return emitter.get(this).events;
    }
}

export default Emitter;
