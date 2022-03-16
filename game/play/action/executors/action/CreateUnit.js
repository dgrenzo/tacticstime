"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameBoard_1 = require("../../../../board/GameBoard");
function ExecuteCreateUnit(action, scene) {
    var unit = action.data.unit;
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
