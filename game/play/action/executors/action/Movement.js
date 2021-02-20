"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteMove = void 0;
var UpdateElements_1 = require("../../../UpdateElements");
function ExecuteMove(action, elements, controller) {
    return controller.animateGameAction(action).then(function () {
        return UpdateElements_1.UpdateElements.SetPosition(elements, action.data.entity_id, action.data.move.to);
    });
}
exports.ExecuteMove = ExecuteMove;
