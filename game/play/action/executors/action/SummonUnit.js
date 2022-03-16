"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameBoard_1 = require("../../../../board/GameBoard");
var UnitLoader_1 = require("../../../../assets/UnitLoader");
function ExecuteSummonUnit(action, scene) {
    var unit_data = UnitLoader_1.UnitLoader.GetUnitDefinition(action.data.unit_type);
    var unit = GameBoard_1.CreateUnit(unit_data, action.data.source.data.faction);
    unit.pos = {
        x: action.data.tile.pos.x,
        y: action.data.tile.pos.y,
    };
    scene = GameBoard_1.GameBoard.AddActions(scene, {
        type: "CREATE_UNIT",
        data: {
            unit: unit,
        }
    });
    return scene;
}
exports.ExecuteSummonUnit = ExecuteSummonUnit;
