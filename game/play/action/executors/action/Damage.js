"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ExecuteDamage(action, elements, controller) {
    return new Promise(function (resolve) {
        var unit = controller.getUnit(action.data.entity_id);
        if (!unit) {
            return resolve(elements);
        }
        var starting_hp = unit.status.hp;
        if (starting_hp === 0) {
            return resolve(elements);
        }
        var new_hp = Math.max(starting_hp - action.data.amount, 0);
        if (new_hp != starting_hp) {
            controller.sendAction({
                type: "DAMAGE_DEALT",
                data: {
                    amount: starting_hp - new_hp,
                    entity_id: unit.id,
                }
            });
        }
        if (new_hp === 0) {
            controller.sendAction({
                type: "UNIT_KILLED",
                data: {
                    entity_id: unit.id
                }
            });
        }
        var result = elements.setIn([action.data.entity_id, 'status', 'hp'], new_hp);
        resolve(result);
    });
}
exports.ExecuteDamage = ExecuteDamage;
