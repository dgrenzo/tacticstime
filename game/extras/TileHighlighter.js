"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            var targets = _this.m_board.getElementsAt(_this.m_last_pos);
            if (targets.length > 0) {
                targets.forEach(function (entity) {
                    _this.m_renderer.getRenderable(entity.id).offsetY = 0;
                });
            }
            targets = _this.m_board.getElementsAt(_this.m_current_pos);
            if (targets.length > 0) {
                targets.forEach(function (entity) {
                    _this.m_renderer.getRenderable(entity.id).offsetY = -2;
                });
            }
            _this.m_last_pos = _this.m_current_pos;
        };
        this.m_renderer.on('POINTER_MOVE', this.onPointerMove);
    }
    return TileHighlighter;
}());
exports.default = TileHighlighter;
