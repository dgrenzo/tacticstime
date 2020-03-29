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
var Entity_1 = require("../../engine/scene/Entity");
var Effect = (function (_super) {
    __extends(Effect, _super);
    function Effect(m_ability) {
        var _this = _super.call(this, m_ability.target.x, m_ability.target.y) || this;
        _this.m_ability = m_ability;
        _this.getCurrentAsset = function () {
            return {
                type: "EFFECT",
                name: _this.m_ability.ability.name,
            };
        };
        return _this;
    }
    Object.defineProperty(Effect.prototype, "depthOffset", {
        get: function () {
            return 10;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Effect.prototype, "ability_def", {
        get: function () {
            return this.m_ability;
        },
        enumerable: true,
        configurable: true
    });
    return Effect;
}(Entity_1.Entity));
exports.Effect = Effect;
