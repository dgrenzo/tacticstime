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
var BaseMenu_1 = require("./BaseMenu");
var ReplayMenu = (function (_super) {
    __extends(ReplayMenu, _super);
    function ReplayMenu(m_callback) {
        var _this = _super.call(this) || this;
        _this.m_callback = m_callback;
        _this.OnCompletePressed = function () {
            _this.m_callback();
        };
        _this.MakeButton('Complete', _this.OnCompletePressed);
        return _this;
    }
    return ReplayMenu;
}(BaseMenu_1.BaseMenu));
exports.ReplayMenu = ReplayMenu;
