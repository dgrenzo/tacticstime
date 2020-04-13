"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameBoard_1 = require("../../../../board/GameBoard");
var UnitLoader_1 = require("../../../../assets/UnitLoader");
function ExecuteSummonUnit(action, elements, controller) {
    return new Promise(function (resolve) {
        var unit_data = UnitLoader_1.UnitLoader.GetUnitDefinition(action.data.unit_type);
        var unit = GameBoard_1.CreateUnit({
            pos: action.data.tile.pos,
            unit: unit_data,
        });
        controller.sendAction({
            type: "CREATE_UNIT",
            data: {
                unit: unit,
            }
        });
        resolve(elements);
    });
}
exports.ExecuteSummonUnit = ExecuteSummonUnit;
