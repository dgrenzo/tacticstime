"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteCreateUnit = void 0;
var UpdateElements_1 = require("../../../UpdateElements");
function ExecuteCreateUnit(action, elements, controller) {
    var unit = action.data.unit;
    var id = unit.id;
    elements = UpdateElements_1.UpdateElements.AddEntity(elements, id, unit);
    return new Promise(function (resolve) {
        controller.sendAction({
            type: "UNIT_CREATED",
            data: {
                unit: unit
            }
        });
        resolve(elements);
    });
}
exports.ExecuteCreateUnit = ExecuteCreateUnit;
