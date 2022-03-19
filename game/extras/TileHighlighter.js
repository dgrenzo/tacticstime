"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameBoard_1 = require("../board/GameBoard");
var TileHighlighter = (function () {
    function TileHighlighter(m_renderer, m_board) {
        var _this = this;
        this.m_renderer = m_renderer;
        this.m_board = m_board;
        this.onPointerMove = function (data) {
            _this.m_current_pos = {
                x: data.x,
                y: data.y,
            };
        };
        this.update = function () {
            var targets = GameBoard_1.GameBoard.GetEntitiesAt(_this.m_board.scene, _this.m_last_pos);
            targets.forEach(function (entity) {
            });
            targets = GameBoard_1.GameBoard.GetEntitiesAt(_this.m_board.scene, _this.m_current_pos);
            targets.forEach(function (entity) {
            });
            _this.m_last_pos = _this.m_current_pos;
        };
        this.m_renderer.on('POINTER_MOVE', this.onPointerMove);
    }
    return TileHighlighter;
}());
exports.default = TileHighlighter;
