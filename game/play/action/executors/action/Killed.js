"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ExecuteKilled(data, controller) {
    return new Promise(function (resolve) {
        controller.removeUnit(data.unit);
        setTimeout(resolve, 100);
    });
}
exports.ExecuteKilled = ExecuteKilled;
