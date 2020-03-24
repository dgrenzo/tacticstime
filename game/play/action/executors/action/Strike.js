"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ExecuteStrike(data, controller) {
    return new Promise(function (resolve) {
        controller.sendAction({
            type: "DAMAGE",
            data: {
                amount: 1,
                unit: data.target,
            }
        });
        setTimeout(resolve, 100);
    });
}
exports.ExecuteStrike = ExecuteStrike;
