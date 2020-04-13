"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
function ExecuteAbility(action, elements, controller) {
    return controller.getActionCallback(action).then(function () {
        _.forEach(action.data.ability.effects, function (effect) {
            var tiles = controller.getTilesInRange(action.data.target.pos, effect.range);
            tiles.forEach(function (tile) {
                var data = _.cloneDeep(effect.data);
                data = _.defaults(data, { tile: tile });
                var unit = controller.getUnitAtPosition(tile.pos);
                if (unit) {
                    controller.sendAction({
                        type: effect.type,
                        data: _.defaults(data, { entity_id: unit.id })
                    });
                }
                else {
                    controller.sendAction({
                        type: effect.type,
                        data: data
                    });
                }
            });
        });
        return elements;
    });
}
exports.ExecuteAbility = ExecuteAbility;
