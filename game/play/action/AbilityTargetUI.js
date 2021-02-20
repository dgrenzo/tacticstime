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
exports.AbilityTargetUI = void 0;
var _ = require("lodash");
var BoardActionUI_1 = require("./BoardActionUI");
var AbilityTargetUI = (function (_super) {
    __extends(AbilityTargetUI, _super);
    function AbilityTargetUI(m_ability_def, m_active_unit, m_controller) {
        var _this = _super.call(this, m_active_unit, m_controller) || this;
        _this.m_ability_def = m_ability_def;
        _this.m_active_unit = m_active_unit;
        _this.m_controller = m_controller;
        _this.getTileOptionsInRange = function (start, target_def) {
            var max_range = target_def.range.max;
            var min_range = target_def.range.min;
            var options = [];
            for (var offset_x = -max_range; offset_x <= max_range; offset_x++) {
                var max_y = max_range - Math.abs(offset_x);
                for (var offset_y = -max_y; offset_y <= max_y; offset_y++) {
                    if (Math.abs(offset_x) + Math.abs(offset_y) < min_range) {
                        continue;
                    }
                    var tile = _this.m_controller.getTile({ x: start.x + offset_x, y: start.y + offset_y });
                    if (tile) {
                        var unit = _this.m_controller.getUnitAtPosition(tile.pos);
                        switch (_this.m_ability_def.target.target_type) {
                            case "EMPTY":
                                if (unit) {
                                    continue;
                                }
                                break;
                            case "ALLY":
                                if (!unit || _this.m_active_unit.data.faction !== unit.data.faction) {
                                    continue;
                                }
                                break;
                            case "ENEMY":
                                if (!unit || _this.m_active_unit.data.faction === unit.data.faction) {
                                    continue;
                                }
                                break;
                            case "ANY":
                                break;
                        }
                        options.push({ tile: tile });
                    }
                }
            }
            return options;
        };
        _this.getAction = function (tile) {
            var option = _this.getOptionFromTile(tile);
            return _this.toAction(option);
        };
        _this.m_options = _this.getTileOptionsInRange(_this.m_active_unit.pos, _this.m_ability_def.target);
        return _this;
    }
    AbilityTargetUI.prototype.toAction = function (option) {
        return [
            {
                type: "ABILITY",
                data: {
                    source: this.m_active_unit,
                    target: option.tile,
                    ability: this.m_ability_def,
                }
            }
        ];
    };
    AbilityTargetUI.prototype.getOptionFromTile = function (tile) {
        var path = null;
        _.forEach(this.m_options, function (option) {
            if (option.tile === tile) {
                path = option;
                return false;
            }
            return true;
        });
        return path;
    };
    return AbilityTargetUI;
}(BoardActionUI_1.BoardActionUI));
exports.AbilityTargetUI = AbilityTargetUI;
