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
        _this.getScreenPosition = function (x, y) {
            var point = new PIXI.Point((x - y) * _this.HALF_TILE_WIDTH, (x + y) * _this.HALF_TILE_HEIGHT);
            return point;
        };
        _this.positionElement = function (id, pos) {
            var element = _this.getRenderable(id);
            element.setPosition((pos.x - pos.y) * _this.HALF_TILE_WIDTH, (pos.x + pos.y) * _this.HALF_TILE_HEIGHT);
            _this._dirty = true;
        };
        _this.getProjection = function (pos) {
            return {
                x: (pos.x - pos.y),
                y: (pos.x + pos.y),
            };
        };
        _this.sortElements = function (elements) {
            elements
                .sort(function (a, b) {
                return _this.getElementDepth(a) - _this.getElementDepth(b);
            })
                .forEach(function (e) {
                _this.m_container.addChild(_this.m_renderables.get(e.id).root);
            });
        };
        _this.getElementDepth = function (element) {
            return (element.pos.x + element.pos.y) + element.depth_offset;
        };
        _this.m_container.position.set(500, 50);
        _this.m_container.scale.set(4);
        _this.m_screen_effects_container.position.set(500, 50);
        _this.m_screen_effects_container.scale.set(4);
        pixi.renderer.plugins.interaction.on('pointermove', function (evt) {
            _this.m_event_manager.emit("POINTER_MOVE", _this.screenToTilePos(evt.data.global));
        });
        pixi.renderer.plugins.interaction.on('pointerdown', function (evt) {
            if (evt.stopped) {
                return;
            }
            _this.m_event_manager.emit("POINTER_DOWN", _this.screenToTilePos(evt.data.global));
        });
        pixi.renderer.plugins.interaction.on('pointerup', function (evt) {
            _this.m_event_manager.emit("POINTER_UP", _this.screenToTilePos(evt.data.global));
        });
        return _this;
    }
    return SceneRendererIsometric;
}(SceneRenderer_1.SceneRenderer));
exports.SceneRendererIsometric = SceneRendererIsometric;