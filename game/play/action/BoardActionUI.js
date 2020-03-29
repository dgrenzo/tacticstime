"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UNIT_COLLISION;
(function (UNIT_COLLISION) {
    UNIT_COLLISION[UNIT_COLLISION["NONE"] = 0] = "NONE";
    UNIT_COLLISION[UNIT_COLLISION["ALL"] = 1] = "ALL";
    UNIT_COLLISION[UNIT_COLLISION["ENEMY"] = 2] = "ENEMY";
    UNIT_COLLISION[UNIT_COLLISION["ALLY"] = 3] = "ALLY";
})(UNIT_COLLISION || (UNIT_COLLISION = {}));
var BoardActionUI = (function () {
    function BoardActionUI(m_active_unit, m_controller) {
        this.m_active_unit = m_active_unit;
        this.m_controller = m_controller;
    }
    BoardActionUI.prototype.showOptions = function () {
    };
    BoardActionUI.prototype.hideOptions = function () {
    };
    BoardActionUI.prototype.getAction = function (tile) {
        return [];
    };
    return BoardActionUI;
}());
exports.BoardActionUI = BoardActionUI;
