"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var FSM = (function () {
    function FSM() {
        var _this = this;
        this.m_state_objects = new Map();
        this.registerState = function (key, state_object) {
            _this.m_state_objects.set(key, _.defaults({
                fsm: _this,
            }, state_object));
        };
        this.update = function (deltaTime) {
            if (_this.active_state && _this.active_state.update) {
                _this.active_state.update(deltaTime);
            }
        };
        this.setState = function (val) {
            if (_this.active_state && _this.active_state.exit) {
                _this.active_state.exit();
            }
            _this.m_state = val;
            if (_this.active_state.enter) {
                _this.active_state.enter();
            }
        };
    }
    Object.defineProperty(FSM.prototype, "active_state", {
        get: function () {
            return this.m_state_objects.get(this.m_state);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSM.prototype, "state", {
        get: function () {
            return this.m_state;
        },
        enumerable: true,
        configurable: true
    });
    return FSM;
}());
exports.FSM = FSM;
