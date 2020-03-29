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
var EffectsManager = (function () {
    function EffectsManager() {
    }
    EffectsManager.RenderEffect = function (elements, onComplete) {
        var container = new PIXI.Container();
        var meteor = new PIXI.Graphics().beginFill(0x333399).drawRect(-4, -4, 8, 8).endFill();
        meteor.y = -40;
        container.addChild(meteor);
        container.position.set(8, 6);
        elements.renderer.sprite.addChild(container);
        var start_time = Date.now();
        var time = start_time;
        var end_time = start_time + 90;
        var update = function (deltaTime) {
            time += deltaTime;
            var k = 1.0 - (end_time - time) / 90;
            k = Math.max(0, k * k);
            meteor.y = Math.round(-10 * (1.0 - k)) * 4;
            if (time >= end_time) {
                PIXI.Ticker.shared.remove(update);
                meteor.scale.set(2);
                setTimeout(onComplete, 25);
            }
        };
        PIXI.Ticker.shared.add(update);
    };
    return EffectsManager;
}());
exports.default = EffectsManager;
var EffectContainer = (function (_super) {
    __extends(EffectContainer, _super);
    function EffectContainer() {
        var _this = _super.call(this) || this;
        _this.m_block = new PIXI.Graphics();
        _this.update = function (deltaTime) {
        };
        _this.m_block.beginFill(0x333399).drawRect(-2, -2, 4, 4).endFill();
        _this.addChild(_this.m_block);
        _this.m_block.position.y = -100;
        return _this;
    }
    return EffectContainer;
}(PIXI.Container));
exports.EffectContainer = EffectContainer;
