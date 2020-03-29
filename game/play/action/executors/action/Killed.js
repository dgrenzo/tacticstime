"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ExecuteKilled(data, controller) {
    return new Promise(function (resolve) {
        controller.removeEntity(data.unit);
        resolve();
    });
}
exports.ExecuteKilled = ExecuteKilled;
