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
var MoveActionUI = (function (_super) {
    __extends(MoveActionUI, _super);
    function MoveActionUI(m_active_unit, m_controller) {
        var _this = _super.call(this, m_active_unit, m_controller) || this;
        _this.m_active_unit = m_active_unit;
        _this.m_controller = m_controller;
        _this.getAction = function (tile) {
            var option = _this.getOptionFromTile(tile);
            return option ? _this.toMoveAction(option) : null;
        };
        _this.m_options = _this.m_controller.getMoveOptions(_this.m_active_unit);
        return _this;
    }
    MoveActionUI.prototype.toMoveAction = function (path) {
        var action = [];
        while (path) {
            action.unshift({
                type: "MOVE",
                data: {
                    entity_id: this.m_active_unit.id,
                    move: {
                        to: {
                            x: path.tile.pos.x,
                            y: path.tile.pos.y,
                        }
                    }
                }
            });
            path = path.last;
        }
        return action;
    };
    MoveActionUI.prototype.getOptionFromTile = function (tile) {
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
    return MoveActionUI;
}(BoardActionUI_1.BoardActionUI));
exports.MoveActionUI = MoveActionUI;
