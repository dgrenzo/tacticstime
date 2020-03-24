"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var RenderEntity_1 = require("./RenderEntity");
var event_1 = require("../../listener/event");
var SceneRenderer = (function () {
    function SceneRenderer(m_pixi) {
        var _this = this;
        this.m_pixi = m_pixi;
        this.m_event_manager = new event_1.EventManager();
        this.initializeScene = function (scene) {
            _this.m_renderables = new Map();
            _this.m_container.removeChildren();
            scene.getElements().forEach(function (element) {
                var renderable = _this.addEntity(element);
                renderable.render(element.getCurrentAsset());
                renderable.sprite.on('pointerdown', function () {
                    _this.m_event_manager.emit("ENTITY_CLICKED", { id: renderable.id });
                });
            });
            _this.renderScene(scene);
        };
        this.on = function (event_name, cb) {
            _this.m_event_manager.add(event_name, cb);
        };
        this.off = function (event_name, cb) {
            _this.m_event_manager.remove(event_name, cb);
        };
        this.renderScene = function (scene) {
            scene.getElements().forEach(function (element) {
                _this.positionElement(_this.m_renderables.get(element.id), element.x, element.y);
            });
            _this.sortElements(scene.getElements());
            _this.m_container.render(_this.m_pixi.renderer);
        };
        this.removeEntity = function (entity) {
            var renderable = _this.m_renderables.get(entity.id);
            if (renderable) {
                _this.m_container.removeChild(renderable.sprite);
                _this.m_renderables.delete(entity.id);
            }
            return renderable;
        };
        this.addEntity = function (entity) {
            var renderable = CreateRenderable(entity);
            _this.m_renderables.set(entity.id, renderable);
            return renderable;
        };
        this.getRenderable = function (id) {
            return _this.m_renderables.get(id);
        };
        this.m_container = new PIXI.Container();
    }
    Object.defineProperty(SceneRenderer.prototype, "stage", {
        get: function () {
            return this.m_container;
        },
        enumerable: true,
        configurable: true
    });
    return SceneRenderer;
}());
exports.SceneRenderer = SceneRenderer;
function CreateRenderable(entity) {
    return new RenderEntity_1.RenderEntity(entity.id);
}
