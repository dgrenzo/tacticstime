"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Signal = (function () {
    function Signal() {
        this.listener_root = null;
    }
    Signal.prototype.emit = function (data) {
        var listener = this.listener_root;
        while (listener) {
            listener.fn(data);
            listener = listener.next;
        }
    };
    Signal.prototype.add = function (cb) {
        var current_root = this.listener_root;
        this.listener_root = {
            fn: cb,
            next: current_root,
        };
    };
    Signal.prototype.remove = function (cb) {
        if (cb === this.listener_root.fn) {
            this.listener_root = this.listener_root.next;
            return;
        }
        var current = this.listener_root;
        var prev = null;
        while (current) {
            if (current.fn === cb) {
                if (prev) {
                    prev.next = current.next;
                }
                return;
            }
            prev = current;
            current = current.next;
        }
    };
    return Signal;
}());
exports.Signal = Signal;
var EventManager = (function () {
    function EventManager() {
        this.m_signalMap = new Map();
    }
    EventManager.prototype.emit = function (signal_type, data) {
        if (!this.m_signalMap.has(signal_type)) {
            return;
        }
        else {
            this.m_signalMap.get(signal_type).emit(data);
        }
    };
    EventManager.prototype.createSignal = function (signal_name) {
        this.m_signalMap.set(signal_name, new Signal());
    };
    EventManager.prototype.add = function (signal_name, cb) {
        if (!this.m_signalMap.get(signal_name)) {
            this.createSignal(signal_name);
        }
        this.m_signalMap.get(signal_name).add(cb);
    };
    EventManager.prototype.remove = function (signal_name, cb) {
        if (!this.m_signalMap.get(signal_name)) {
            return;
        }
        else {
            this.m_signalMap.get(signal_name).remove(cb);
        }
    };
    return EventManager;
}());
exports.EventManager = EventManager;
