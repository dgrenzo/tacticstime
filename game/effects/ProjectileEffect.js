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
var GameEffect_1 = require("./GameEffect");
var TWEEN = require("@tweenjs/tween.js");
var ProjectileEffect = (function (_super) {
    __extends(ProjectileEffect, _super);
    function ProjectileEffect(renderer, m_data, onComplete) {
        var _this = _super.call(this, renderer) || this;
        _this.m_data = m_data;
        _this.m_renderable.renderAsset({
            type: "EFFECT",
            name: "PROJECTILE_ARROW",
            data: m_data,
            depth_offset: 0,
        });
        var _from = {
            x: m_data.source.pos.x,
            y: m_data.source.pos.y,
        };
        var _to = {
            x: m_data.target.pos.x,
            y: m_data.target.pos.y,
        };
        var _screen_from = _this.m_renderer.getScreenPosition(_from);
        var _screen_to = _this.m_renderer.getScreenPosition(_to);
        _this.m_renderable.sprite.rotation = Math.atan2(_screen_to.y - _screen_from.y, _screen_to.x - _screen_from.x);
        var distance = Math.sqrt(Math.pow(_to.x - _from.x, 2) + Math.pow(_to.y - _from.y, 2));
        var time = distance * 50;
        var _tween_obj = {
            x: _from.x,
            y: _from.y,
        };
        renderer.positionElement(_this.m_renderable, _from);
        TWEEN.add(new TWEEN.Tween(_tween_obj)
            .to(_to, time)
            .onUpdate(function () {
            _this.setPosition(_tween_obj);
        })
            .onComplete(function () {
            _this.m_renderer.removeEntity(_this.m_renderable.id);
            onComplete();
        })
            .start());
        return _this;
    }
    return ProjectileEffect;
}(GameEffect_1.GameEffect));
exports.ProjectileEffect = ProjectileEffect;
