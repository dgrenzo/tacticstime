"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameBoard_1 = require("../../../../board/GameBoard");
var ActionEffect_1 = require("../../ActionEffect");
function ExecuteAbility(action, scene) {
    var effects = action.data.ability.effects;
    var context = {
        action: action
    };
    for (var i = 0; i < effects.length; i++) {
        var effect = effects[i];
        scene = ActionEffect_1.ActionEffect.ExecuteEffect(scene, effect, context);
    }
    var unit_id = action.data.source.id;
    var mana = action.data.source.status.mana;
    if (action.data.ability.cost > 0) {
        mana -= action.data.ability.cost;
    }
    else {
        mana += 2;
    }
    scene = GameBoard_1.GameBoard.SetMP(scene, unit_id, mana);
    return scene;
}
exports.ExecuteAbility = ExecuteAbility;
