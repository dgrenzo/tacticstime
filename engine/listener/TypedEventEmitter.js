"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var TypedEventEmitter = (function (_super) {
    __extends(TypedEventEmitter, _super);
    function TypedEventEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TypedEventEmitter.prototype.emit = function (signal_type, data) {
        return _super.prototype.emit.call(this, signal_type, data);
    };
    TypedEventEmitter.prototype.on = function (signal_name, cb, context) {
        return _super.prototype.on.call(this, signal_name, cb, context);
    };
    TypedEventEmitter.prototype.off = function (signal_name, cb, context) {
        return _super.prototype.off.call(this, signal_name, cb, context);
    };
    return TypedEventEmitter;
}(PIXI.utils.EventEmitter));
exports.TypedEventEmitter = TypedEventEmitter;
