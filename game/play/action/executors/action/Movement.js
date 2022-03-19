"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameBoard_1 = require("../../../../board/GameBoard");
function ExecuteMove(action, scene) {
    scene = GameBoard_1.GameBoard.SetEntityPosition(scene, action.data.entity_id, action.data.move.to);
    return scene;
}
exports.ExecuteMove = ExecuteMove;
