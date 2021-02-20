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
exports.DamageNumberEffect = void 0;
var TWEEN = require("@tweenjs/tween.js");
var GameEffect_1 = require("./GameEffect");
var DamageNumberEffect = (function (_super) {
    __extends(DamageNumberEffect, _super);
    function DamageNumberEffect(renderer, data, onComplete) {
        var _this = _super.call(this, renderer) || this;
        _this.m_renderable.renderAsset({
            type: "EFFECT",
            name: "DAMAGE_DEALT",
            data: data,
            depth_offset: 100,
        });
        TWEEN.add(new TWEEN.Tween(_this.m_renderable.sprite.scale)
            .to({ x: 0.65, y: 0.55 }, 150)
            .easing(TWEEN.Easing.Back.Out)
            .onComplete(function () {
            _this.m_renderable.sprite.scale.set(0.4);
            onComplete();
        })
            .start());
        TWEEN.add(new TWEEN.Tween(_this.m_renderable.sprite)
            .to({ alpha: 0, y: -6 }, 400)
            .delay(100)
            .onComplete(function () {
            _this.m_renderer.removeEntity(_this.m_renderable.id);
        })
            .start());
        return _this;
    }
    return DamageNumberEffect;
}(GameEffect_1.GameEffect));
exports.DamageNumberEffect = DamageNumberEffect;
