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
var Unit = (function (_super) {
    __extends(Unit, _super);
    function Unit(x, y, data) {
        var _this = _super.call(this, x, y) || this;
        _this.hp = 1;
        _this.getAbilities = function () {
            return [
                {
                    name: "MOVE",
                    data: {
                        range: 4,
                    }
                },
                {
                    name: "STRIKE",
                    data: {
                        range: 1,
                        strength: 3,
                    }
                }
            ];
        };
        _this.getMoveLeft = function () {
            return 6;
        };
        _this.getCurrentAsset = function () {
            return {
                type: "ANIMATED_SPRITE",
                name: _this.m_unit_type + '_idle',
            };
        };
        _this.m_unit_type = data.asset;
        return _this;
    }
    Object.defineProperty(Unit.prototype, "depthOffset", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    return Unit;
}(Entity_1.Entity));
exports.Unit = Unit;
