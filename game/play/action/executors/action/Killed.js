"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteKilled = void 0;
var UpdateElements_1 = require("../../../UpdateElements");
function ExecuteKilled(action, elements, controller) {
    return controller.animateGameAction(action).then(function () {
        controller.removeEntity(action.data.entity_id);
        return UpdateElements_1.UpdateElements.RemoveEntity(elements, action.data.entity_id);
    });
}
exports.ExecuteKilled = ExecuteKilled;
