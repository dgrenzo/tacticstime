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
var TWEEN = require("@tweenjs/tween.js");
var GameEffect = (function () {
    function GameEffect(m_renderer) {
        var _this = this;
        this.m_renderer = m_renderer;
        this.m_pos = {
            x: 0,
            y: 0,
        };
        this.setPosition = function (pos) {
            _this.m_pos.x = pos.x + 0.5;
            _this.m_pos.y = pos.y - 0.5;
            _this.m_renderer.positionElement(_this.m_renderable, _this.m_pos);
        };
        this.update = function (deltaTime) {
        };
        this.m_pos;
        this.m_renderable = m_renderer.addEntity(this);
    }
    Object.defineProperty(GameEffect.prototype, "pos", {
        get: function () {
            return {
                x: this.m_pos.x,
                y: this.m_pos.y,
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameEffect.prototype, "entity_type", {
        get: function () {
            return "EFFECT";
        },
        enumerable: true,
        configurable: true
    });
    GameEffect.prototype.destroy = function () {
    };
    return GameEffect;
}());
exports.GameEffect = GameEffect;
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
}(GameEffect));
exports.DamageNumberEffect = DamageNumberEffect;
