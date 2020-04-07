"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
function ExecuteAbility(action, elements, controller) {
    return controller.getActionCallback(action).then(function () {
        _.forEach(action.data.ability.effects, function (effect) {
            var tiles = controller.getTilesInRange(action.data.target.pos, effect.range);
            tiles.forEach(function (tile) {
                var unit = controller.getUnitAtPosition(tile.pos);
                if (unit) {
                    controller.sendAction({
                        type: effect.type,
                        data: {
                            entity_id: unit.id,
                            amount: effect.amount,
                        }
                    });
                }
            });
        });
        return elements;
    });
}
exports.ExecuteAbility = ExecuteAbility;
