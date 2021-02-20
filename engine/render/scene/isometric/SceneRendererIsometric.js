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
exports.SceneRendererIsometric = void 0;
var PIXI = require("pixi.js");
var SceneRenderer_1 = require("../SceneRenderer");
var TILE_WIDTH = 16;
var TILE_HEIGHT = 8;
var SceneRendererIsometric = (function (_super) {
    __extends(SceneRendererIsometric, _super);
    function SceneRendererIsometric(pixi) {
        var _this = _super.call(this, pixi) || this;
        _this.TILE_WIDTH = TILE_WIDTH;
        _this.TILE_HEIGHT = TILE_HEIGHT;
        _this.HALF_TILE_WIDTH = TILE_WIDTH / 2;
        _this.HALF_TILE_HEIGHT = TILE_HEIGHT / 2;
        _this.screenToTilePos = function (global) {
            var point = _this.m_container.toLocal(global);
            point.y -= 2;
            var game_x = Math.round(point.y / _this.TILE_HEIGHT + point.x / _this.TILE_WIDTH) - 1;
            var game_y = Math.round(point.y / _this.TILE_HEIGHT - point.x / _this.TILE_WIDTH);
            return {
                x: game_x,
                y: game_y
            };
        };
        _this.getScreenPosition = function (pos) {
            var point = new PIXI.Point((pos.x - pos.y) * _this.HALF_TILE_WIDTH, (pos.x + pos.y) * _this.HALF_TILE_HEIGHT);
            return point;
        };
        _this.positionElement = function (element, pos) {
            element.setPosition({
                x: (pos.x - pos.y) * _this.HALF_TILE_WIDTH,
                y: (pos.x + pos.y) * _this.HALF_TILE_HEIGHT,
            }, _this.getElementDepth(pos) + element.depth_offset);
            _this.m_renderables.remove(element);
            var index = _this.m_renderables.getFirstIndex(function (e) {
                return e.depth > element.depth;
            });
            _this.m_renderables.insertAt(element, index);
            _this.m_container.addChildAt(element.root, index);
        };
        _this.getProjection = function (pos) {
            return {
                x: (pos.x - pos.y),
                y: (pos.x + pos.y)
            };
        };
        _this.getElementDepth = function (pos) {
            return (pos.x + pos.y);
        };
        _this.m_container.position.set(500, 50);
        _this.m_container.scale.set(4);
        _this.m_screen_effects_container.position.set(500, 50);
        _this.m_screen_effects_container.scale.set(4);
        return _this;
    }
    return SceneRendererIsometric;
}(SceneRenderer_1.SceneRenderer));
exports.SceneRendererIsometric = SceneRendererIsometric;
