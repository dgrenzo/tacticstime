"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ExecuteDamage(data, controller) {
    return new Promise(function (resolve) {
        var starting_hp = data.unit.hp;
        if (starting_hp === 0) {
            resolve();
            return;
        }
        data.unit.hp = Math.max(starting_hp - data.amount, 0);
        if (data.unit.hp != starting_hp) {
            controller.sendAction({
                type: "DAMAGE_DEALT",
                data: {
                    amount: starting_hp - data.unit.hp,
                    unit: data.unit,
                }
            });
        }
        if (data.unit.hp === 0) {
            controller.sendAction({
                type: "UNIT_KILLED",
                data: {
                    unit: data.unit
                }
            });
        }
        setTimeout(resolve, 100);
    });
}
exports.ExecuteDamage = ExecuteDamage;
