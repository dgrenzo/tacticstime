"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ExecuteMove(action, elements, controller) {
    return controller.animateGameAction(action).then(function () {
        var new_pos = {
            x: action.data.move.to.x,
            y: action.data.move.to.y
        };
        return elements.setIn([action.data.entity_id, 'pos'], new_pos);
    });
}
exports.ExecuteMove = ExecuteMove;
