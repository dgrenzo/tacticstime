"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ExecuteKilled(action, elements, controller) {
    return controller.animateGameAction(action).then(function () {
        controller.removeEntity(action.data.entity_id);
        return elements.remove(action.data.entity_id);
    });
}
exports.ExecuteKilled = ExecuteKilled;
