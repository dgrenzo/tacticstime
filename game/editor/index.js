"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var tile_palette_1 = require("./interface/tile_palette");
var GameBoard_1 = require("../board/GameBoard");
var BoardEditor = (function () {
    function BoardEditor(m_board, m_renderer) {
        var _this = this;
        this.m_board = m_board;
        this.m_renderer = m_renderer;
        this.m_container = new PIXI.Container;
        var m_palette = new tile_palette_1.TilePalette();
        var painting = false;
        var paintTile = function (pos, type) {
            var tile = GameBoard_1.GameBoard.GetTileAtPosiiton(_this.m_board.scene, pos);
            if (!tile) {
                return;
            }
            if (tile.data.tile_type !== type) {
            }
        };
        this.m_renderer.on("POINTER_DOWN", function (data) {
            painting = true;
            paintTile(data, m_palette.brush);
        });
        this.m_renderer.on("POINTER_MOVE", function (data) {
            if (painting) {
                paintTile(data, m_palette.brush);
            }
        });
        this.m_renderer.on("POINTER_UP", function (data) {
            painting = false;
        });
        this.m_container.addChild(m_palette.container);
    }
    return BoardEditor;
}());
exports.BoardEditor = BoardEditor;
