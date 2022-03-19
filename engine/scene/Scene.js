"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var KEY_ENTITIES = "ENTITIES";
var KEY_LISTENERS = "LISTENERS";
var KEY_ACTIONS = "ACTIONS";
var Scene = (function () {
    function Scene() {
        var _this = this;
        this.getElement = function (id) {
            return _this.elements.get(id);
        };
        this.m_immutable_scene = immutable_1.Map();
        this.listeners = immutable_1.Map();
        this.elements = immutable_1.Map();
        this.actions = immutable_1.List();
    }
    Scene.GetElements = function (scene) {
        return scene.get(KEY_ENTITIES);
    };
    Scene.SetElements = function (scene, elements) {
        return scene.set(KEY_ENTITIES, elements);
    };
    Scene.GetListeners = function (scene) {
        return scene.get(KEY_LISTENERS);
    };
    Scene.SetListeners = function (scene, listeners) {
        return scene.set(KEY_LISTENERS, listeners);
    };
    Scene.AddListener = function (scene, event_name, aura) {
        var listeners = Scene.GetListeners(scene);
        var event_listeners = listeners.get(event_name, immutable_1.List());
        event_listeners = event_listeners.push(aura);
        listeners = listeners.set(event_name, event_listeners);
        return Scene.SetListeners(scene, listeners);
    };
    Scene.GetActions = function (scene) {
        return scene.get(KEY_ACTIONS);
    };
    Scene.SetActions = function (scene, actions) {
        return scene.set(KEY_ACTIONS, actions);
    };
    Scene.AddElement = function (scene, element) {
        var elements = Scene.GetElements(scene);
        return Scene.SetElements(scene, elements.set(element.id, element));
    };
    Scene.RemoveElement = function (scene, element) {
        var elements = Scene.GetElements(scene);
        return Scene.SetElements(scene, elements.remove(element.id));
    };
    Scene.RemoveElementById = function (scene, element_id) {
        var elements = Scene.GetElements(scene);
        return Scene.SetElements(scene, elements.remove(element_id));
    };
    Object.defineProperty(Scene.prototype, "scene", {
        get: function () {
            return this.m_immutable_scene;
        },
        set: function (val) {
            this.m_immutable_scene = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "actions", {
        get: function () {
            return this.m_immutable_scene.get(KEY_ACTIONS);
        },
        set: function (val) {
            this.m_immutable_scene = this.m_immutable_scene.set(KEY_ACTIONS, val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "listeners", {
        get: function () {
            return this.m_immutable_scene.get(KEY_LISTENERS);
        },
        set: function (val) {
            this.m_immutable_scene = this.m_immutable_scene.set(KEY_LISTENERS, val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "elements", {
        get: function () {
            return this.m_immutable_scene.get(KEY_ENTITIES);
        },
        set: function (val) {
            this.m_immutable_scene = this.m_immutable_scene.set(KEY_ENTITIES, val);
        },
        enumerable: true,
        configurable: true
    });
    return Scene;
}());
exports.Scene = Scene;
