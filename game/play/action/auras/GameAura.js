"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameBoard_1 = require("../../../board/GameBoard");
var ActionEffect_1 = require("../ActionEffect");
var GameAura = (function () {
    function GameAura() {
    }
    GameAura.RegisterAura = function (scene, aura) {
        var aura_entity = GameBoard_1.CreateAura(aura);
        GameBoard_1.GameBoard.AddElement(scene, null);
        return scene;
    };
    GameAura.UnregisterAura = function (scene, aura) {
        return scene;
    };
    GameAura.ExecuteAuraListener = function (scene, aura) {
        var action = GameBoard_1.GameBoard.GetNextAction(scene);
        var context = {
            action: action,
            aura: aura
        };
        if (action.type !== aura.trigger.action) {
            return scene;
        }
        var conditions = aura.trigger.where;
        for (var i = 0; i < conditions.length; i++) {
            var where = conditions[i];
            var from = where[0];
            var comparison = where[1];
            var to = where[2];
            switch (comparison) {
                case "EQUALS":
                    var from_value = ActionEffect_1.ActionEffect.GetFromPath(scene, context, from);
                    var to_value = ActionEffect_1.ActionEffect.GetFromPath(scene, context, to);
                    var satisfied = from_value === to_value;
                    if (!satisfied) {
                        return scene;
                    }
                    break;
            }
        }
        var effects = aura.effects;
        for (var i = 0; i < effects.length; i++) {
            var effect = effects[i];
            scene = ActionEffect_1.ActionEffect.ExecuteEffect(scene, effect, context);
        }
        return scene;
    };
    GameAura.ParsePathAndSet = function (scene, action, aura, path, value) {
        return scene;
    };
    return GameAura;
}());
exports.GameAura = GameAura;
