"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseMenu = void 0;
var PIXI = require("pixi.js");
var Button_1 = require("../Button");
var BaseMenu = (function () {
    function BaseMenu() {
        var _this = this;
        this.m_offset_y = 0;
        this.MakeButton = function (label, callback) {
            var btn = new Button_1.Button(label, callback, 200, 40);
            btn.container.position.y = _this.m_offset_y;
            _this.m_offset_y += 60;
            _this.m_container.addChild(btn.container);
        };
        this.m_container = new PIXI.Container();
    }
    Object.defineProperty(BaseMenu.prototype, "container", {
        get: function () {
            return this.m_container;
        },
        enumerable: false,
        configurable: true
    });
    return BaseMenu;
}());
exports.BaseMenu = BaseMenu;
