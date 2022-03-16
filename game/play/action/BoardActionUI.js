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
    function BoardActionUI(m_active_unit, m_board) {
        this.m_active_unit = m_active_unit;
        this.m_board = m_board;
    }
    Object.defineProperty(BoardActionUI.prototype, "options", {
        get: function () {
            return this.m_options;
        },
        enumerable: true,
        configurable: true
    });
    return BoardActionUI;
}());
exports.BoardActionUI = BoardActionUI;
