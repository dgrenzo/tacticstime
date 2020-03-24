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
var _ = require("lodash");
var BoardActionUI_1 = require("./BoardActionUI");
var UNIT_COLLISION;
(function (UNIT_COLLISION) {
    UNIT_COLLISION[UNIT_COLLISION["NONE"] = 0] = "NONE";
    UNIT_COLLISION[UNIT_COLLISION["ALL"] = 1] = "ALL";
    UNIT_COLLISION[UNIT_COLLISION["ENEMY"] = 2] = "ENEMY";
    UNIT_COLLISION[UNIT_COLLISION["ALLY"] = 3] = "ALLY";
})(UNIT_COLLISION || (UNIT_COLLISION = {}));
var AttackActionUI = (function (_super) {
    __extends(AttackActionUI, _super);
    function AttackActionUI(m_tile, m_controller) {
        var _this = _super.call(this, m_tile, m_controller) || this;
        _this.m_tile = m_tile;
        _this.m_controller = m_controller;
        _this.getTileOptionsInRange = function (start, max_range, min_range) {
            if (min_range === void 0) { min_range = 1; }
            var options = [];
            for (var offset_x = -max_range; offset_x <= max_range; offset_x++) {
                var max_y = max_range - Math.abs(offset_x);
                for (var offset_y = -max_y; offset_y <= max_y; offset_y++) {
                    if (Math.abs(offset_x) + Math.abs(offset_y) < min_range) {
                        continue;
                    }
                    var tile = _this.m_controller.getTile({ x: start.x + offset_x, y: start.y + offset_y });
                    if (tile) {
                        options.push({ tile: tile });
                    }
                }
            }
            return options;
        };
        _this.showOptions = function () {
            _.forEach(_this.m_options, function (path) {
                _this.m_controller.emit("SET_PLUGIN", { id: path.tile.id, plugin: 'highlight_red' });
            });
        };
        _this.hideOptions = function () {
            _.forEach(_this.m_options, function (path) {
                _this.m_controller.emit("SET_PLUGIN", { id: path.tile.id, plugin: 'batch' });
            });
        };
        _this.getAction = function (tile) {
            var option = _this.getOptionFromTile(tile);
            return _this.toAttackAction(option);
        };
        _this.getExecuteFunction = function () {
            return function (data) {
                return new Promise(function (resolve) {
                    setTimeout(resolve, 100);
                });
            };
        };
        _this.m_active_unit = _this.m_controller.getUnit(_this.m_active_tile);
        _this.m_options = _this.getTileOptionsInRange(_this.m_active_unit, 2, 1);
        _this.showOptions();
        return _this;
    }
    AttackActionUI.prototype.toAttackAction = function (option) {
        var target = this.m_controller.getUnit(option.tile);
        if (!target) {
            return [];
        }
        return [
            {
                type: "STRIKE",
                data: {
                    unit: this.m_active_unit,
                    target: this.m_controller.getUnit(option.tile),
                    damage: 1,
                    tile: option.tile,
                }
            }
        ];
    };
    AttackActionUI.prototype.getOptionFromTile = function (tile) {
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
    return AttackActionUI;
}(BoardActionUI_1.BoardActionUI));
exports.AttackActionUI = AttackActionUI;
