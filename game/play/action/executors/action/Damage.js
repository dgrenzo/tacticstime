"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameBoard_1 = require("../../../../board/GameBoard");
function ExecuteDamage(action, scene) {
    var unit = GameBoard_1.GameBoard.GetUnit(scene, action.data.entity_id);
    if (!unit) {
        return scene;
    }
    var starting_hp = unit.status.hp;
    if (starting_hp === 0) {
        return scene;
    }
    var new_hp = Math.max(starting_hp - action.data.amount, 0);
    var difference = starting_hp - new_hp;
    scene = GameBoard_1.GameBoard.SetHP(scene, unit.id, new_hp);
    if (difference != 0) {
        scene = GameBoard_1.GameBoard.AddActions(scene, {
            type: "DAMAGE_DEALT",
            data: {
                amount: difference,
                entity_id: unit.id,
            }
        });
    }
    if (new_hp === 0) {
        scene = GameBoard_1.GameBoard.AddActions(scene, {
            type: "UNIT_KILLED",
            data: {
                entity_id: unit.id
            }
        });
    }
    return scene;
}
exports.ExecuteDamage = ExecuteDamage;
