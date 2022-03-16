"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var COLOR_FILL = 0xCCFFFF;
var COLOR_LINE = 0x333333;
var Button = (function () {
    function Button(label, callback, width, height) {
        var _this = this;
        this.destroy = function () {
            _this.m_container.removeChildren();
            _this.m_container.removeAllListeners();
        };
        this.m_container = new PIXI.Container();
        this.m_container.interactive = this.m_container.buttonMode = true;
        this.m_container.on('click', callback);
        var bg = new PIXI.Graphics()
            .beginFill(COLOR_FILL)
            .lineStyle(2, COLOR_LINE)
            .drawRect(0, 0, width, height)
            .endFill();
        this.m_container.addChild(bg);
    }
    Object.defineProperty(Button.prototype, "container", {
        get: function () {
            return this.m_container;
        },
        enumerable: true,
        configurable: true
    });
    return Button;
}());
exports.Button = Button;
