"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameEffect = (function () {
    function GameEffect(m_renderer) {
        var _this = this;
        this.m_renderer = m_renderer;
        this.m_pos = {
            x: 0,
            y: 0,
        };
        this.setPosition = function (pos) {
            _this.m_pos.x = pos.x + 0.55;
            _this.m_pos.y = pos.y - 0.55;
            _this.m_renderer.positionElement(_this.m_renderable, _this.m_pos);
        };
        this.update = function (deltaTime) {
        };
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
    Object.defineProperty(GameEffect.prototype, "element_type", {
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
