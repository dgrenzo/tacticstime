"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameBoard_1 = require("../../../../board/GameBoard");
var AuraLoader_1 = require("../../../../assets/AuraLoader");
function ExecuteCreateUnit(action, scene) {
    var unit = action.data.unit;
    if (unit.auras) {
        for (var i = 0; i < unit.auras.length; i++) {
            var aura_id = unit.auras[i];
            var aura = GameBoard_1.CreateAura(AuraLoader_1.AuraLoader.GetAuraDefinition(aura_id));
            aura.config.config.target_id = unit.id;
            scene = GameBoard_1.GameBoard.AddListener(scene, aura.config.trigger.action, aura);
            scene = GameBoard_1.GameBoard.AddElement(scene, aura);
        }
    }
    scene = GameBoard_1.GameBoard.AddElement(scene, unit);
    scene = GameBoard_1.GameBoard.AddActions(scene, {
        type: "UNIT_CREATED",
        data: {
            unit: unit
        }
    });
    return scene;
}
exports.ExecuteCreateUnit = ExecuteCreateUnit;
