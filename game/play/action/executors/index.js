"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Movement_1 = require("./action/Movement");
var Strike_1 = require("./action/Strike");
var Damage_1 = require("./action/Damage");
var Killed_1 = require("./action/Killed");
function ExecuteGameEvent(action, controller) {
    console.log(action);
    switch (action.type) {
        case "MOVE":
            return Movement_1.ExecuteMove(action.data, controller);
        case "STRIKE":
            return Strike_1.ExecuteStrike(action.data, controller);
        case "DAMAGE":
            return Damage_1.ExecuteDamage(action.data, controller);
        case "UNIT_KILLED":
            return Killed_1.ExecuteKilled(action.data, controller);
        default:
            return Promise.resolve();
    }
}
exports.ExecuteGameEvent = ExecuteGameEvent;
