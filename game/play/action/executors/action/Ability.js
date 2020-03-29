"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
function ExecuteAbility(data, controller) {
    return new Promise(function (resolve) {
        _.forEach(data.ability.effects, function (effect) {
            var tiles = controller.getTilesInRange(data.target, effect.range);
            _.forEach(tiles, function (tile) {
                var unit = controller.getUnit(tile);
                if (unit) {
                    controller.sendAction({
                        type: effect.type,
                        data: {
                            unit: unit,
                            amount: effect.amount,
                        }
                    });
                }
            });
        });
        controller.createEffect(data, resolve);
    });
}
exports.ExecuteAbility = ExecuteAbility;
