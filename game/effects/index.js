"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TWEEN = require("@tweenjs/tween.js");
var damage_1 = require("./damage");
var EffectsManager = (function () {
    function EffectsManager() {
    }
    EffectsManager.init = function (renderer) {
        EffectsManager.s_renderer = renderer;
        renderer.pixi.ticker.add(function () {
            TWEEN.update();
        });
    };
    EffectsManager.RenderEffect = function (action, onComplete) {
        var effect = null;
        switch (action.type) {
            case "DAMAGE_DEALT":
                effect = new damage_1.DamageNumberEffect(EffectsManager.s_renderer, action.data, onComplete);
        }
        if (effect) {
        }
        return effect;
    };
    return EffectsManager;
}());
exports.default = EffectsManager;
