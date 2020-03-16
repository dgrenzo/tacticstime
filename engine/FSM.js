"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var FSM = (function () {
    function FSM() {
        var _this = this;
        this.stateObjects = new Map();
        this.registerState = function (key, stateObject) {
            _this.stateObjects.set(key, _.defaults({
                fsm: _this,
            }, stateObject));
        };
        this.update = function (deltaTime) {
            if (_this.stateObjects.get(_this._state) && _this.stateObjects.get(_this._state).update) {
                _this.stateObjects.get(_this._state).update(deltaTime);
            }
        };
        this.setState = function (val) {
            if (_this.stateObjects.get(_this._state) && _this.stateObjects.get(_this._state).exit) {
                _this.stateObjects.get(_this._state).exit();
            }
            _this._state = val;
            if (_this.stateObjects.get(_this._state).enter) {
                _this.stateObjects.get(_this._state).enter();
            }
        };
    }
    Object.defineProperty(FSM.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: true,
        configurable: true
    });
    return FSM;
}());
exports.FSM = FSM;
