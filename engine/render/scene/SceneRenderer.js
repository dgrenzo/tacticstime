"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var RenderEntity_1 = require("./RenderEntity");
var event_1 = require("../../listener/event");
var Tile_1 = require("../../../game/board/Tile");
var Unit_1 = require("../../../game/board/Unit");
var SceneRenderer = (function () {
    function SceneRenderer(m_pixi) {
        var _this = this;
        this.m_pixi = m_pixi;
        this._dirty = true;
        this.m_event_manager = new event_1.EventManager();
        this.initializeScene = function (scene) {
            _this.m_renderables = new Map();
            _this.m_container.removeChildren();
            scene.elements.forEach(function (element) {
                var renderable = _this.addEntity(element);
                renderable.render(getAsset(element));
            });
            _this.m_pixi.ticker.add(function () {
                _this.renderScene(scene);
            });
        };
        this.on = function (event_name, cb) {
            _this.m_event_manager.add(event_name, cb);
        };
        this.off = function (event_name, cb) {
            _this.m_event_manager.remove(event_name, cb);
        };
        this.renderScene = function (scene) {
            if (_this._dirty) {
                _this.sortElements(scene.elements);
                _this._dirty = false;
            }
            _this.m_container.render(_this.m_pixi.renderer);
        };
        this.removeEntity = function (id) {
            var renderable = _this.m_renderables.get(id);
            if (renderable) {
                _this.m_container.removeChild(renderable.root);
                _this.m_renderables.delete(id);
            }
            return renderable;
        };
        this.addEntity = function (entity) {
            var renderable = CreateRenderable(entity);
            _this.m_renderables.set(entity.id, renderable);
            _this.positionElement(entity.id, entity.pos);
            _this._dirty = true;
            return renderable;
        };
        this.setPlugin = function (id, plugin) {
            _this.getRenderable(id).setPlugin(plugin);
        };
        this.getSprite = function (id) {
            return _this.getRenderable(id).sprite;
        };
        this.getRenderable = function (id) {
            return _this.m_renderables.get(id);
        };
        this.m_container = new PIXI.Container();
        this.m_screen_effects_container = new PIXI.Container();
    }
    Object.defineProperty(SceneRenderer.prototype, "pixi", {
        get: function () {
            return this.m_pixi;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneRenderer.prototype, "stage", {
        get: function () {
            return this.m_container;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneRenderer.prototype, "effects_container", {
        get: function () {
            return this.m_screen_effects_container;
        },
        enumerable: true,
        configurable: true
    });
    return SceneRenderer;
}());
exports.SceneRenderer = SceneRenderer;
function getAsset(entity) {
    if (Tile_1.isTile(entity)) {
        return {
            type: "SPRITE",
            name: Tile_1.GetTileName(entity.data.tile_type),
        };
    }
    else if (Unit_1.isUnit(entity)) {
        return {
            type: "ANIMATED_SPRITE",
            name: entity.data.unit_type + '_idle',
        };
    }
}
exports.getAsset = getAsset;
function CreateRenderable(entity) {
    return new RenderEntity_1.RenderEntity(entity.id);
}
