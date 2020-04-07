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
var TWEEN = require("@tweenjs/tween.js");
var GameEffect = (function () {
    function GameEffect() {
        this.m_container = new PIXI.Container();
        this.update = function (deltaTime) {
        };
    }
    return GameEffect;
}());
exports.GameEffect = GameEffect;
var DamageNumberEffect = (function (_super) {
    __extends(DamageNumberEffect, _super);
    function DamageNumberEffect(data, onComplete) {
        var _this = _super.call(this) || this;
        var effect = new PIXI.Container();
        effect.position.set(9, 2);
        var text = new PIXI.Text(data.amount + '', {
            fill: 0xFFFFCC,
            size: 24,
            stroke: 0x000000,
            strokeThickness: 4,
            fontWeight: 'bolder',
        });
        text.scale.set(0.05);
        text.anchor.set(0.5);
        _this.m_container.addChild(effect);
        effect.addChild(text);
        TWEEN.add(new TWEEN.Tween(text.scale).to({ x: 0.55, y: 0.55 }, 145).easing(TWEEN.Easing.Back.Out).onComplete(onComplete).start());
        TWEEN.add(new TWEEN.Tween(text).to({ alpha: 0, y: -6 }, 400).delay(100).start());
        return _this;
    }
    return DamageNumberEffect;
}(GameEffect));
exports.DamageNumberEffect = DamageNumberEffect;
