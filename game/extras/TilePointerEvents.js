"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameBoard_1 = require("../board/GameBoard");
var TilePointerEvents = (function () {
    function TilePointerEvents(m_renderer, m_board, m_events) {
        var _this = this;
        this.m_renderer = m_renderer;
        this.m_board = m_board;
        this.m_events = m_events;
        this.onPointerMove = function (pos) {
            var tile = GameBoard_1.GameBoard.GetTileAtPosiiton(_this.m_board.scene, pos);
            _this.m_events.emit("TILE_HOVER", { pos: pos, tile: tile });
        };
        this.onPointerDown = function (pos) {
            var tile = GameBoard_1.GameBoard.GetTileAtPosiiton(_this.m_board.scene, pos);
            _this.m_events.emit("TILE_DOWN", { pos: pos, tile: tile });
        };
        this.onPointerUp = function (pos) {
            var tile = GameBoard_1.GameBoard.GetTileAtPosiiton(_this.m_board.scene, pos);
            _this.m_events.emit("TILE_UP", { pos: pos, tile: tile });
        };
        this.m_renderer.on('POINTER_MOVE', this.onPointerMove);
        this.m_renderer.on('POINTER_DOWN', this.onPointerDown);
        this.m_renderer.on('POINTER_UP', this.onPointerUp);
    }
    TilePointerEvents.prototype.destroy = function () {
        this.m_renderer.off('POINTER_MOVE', this.onPointerMove);
        this.m_renderer.off('POINTER_DOWN', this.onPointerDown);
        this.m_renderer.off('POINTER_UP', this.onPointerUp);
    };
    return TilePointerEvents;
}());
exports.default = TilePointerEvents;
