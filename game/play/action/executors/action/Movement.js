"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ExecuteMove(data, controller) {
    return new Promise(function (resolve) {
        data.unit.x = data.tile.x;
        data.unit.y = data.tile.y;
        setTimeout(resolve, 100);
    });
}
exports.ExecuteMove = ExecuteMove;
