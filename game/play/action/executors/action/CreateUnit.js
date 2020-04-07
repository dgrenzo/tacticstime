"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ExecuteCreateUnit(action, elements, controller) {
    elements = elements.set(action.data.unit.id, action.data.unit);
    return new Promise(function (resolve) {
        controller.sendAction({
            type: "UNIT_CREATED",
            data: {
                unit: action.data.unit,
            }
        });
        resolve(elements);
    });
}
exports.ExecuteCreateUnit = ExecuteCreateUnit;
