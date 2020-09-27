"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
function ExecuteAbility(action, elements, controller) {
    return controller.animateGameAction(action).then(function () {
        _.forEach(action.data.ability.effects, function (effect) {
            var tiles = controller.getTilesInRange(action.data.target.pos, effect.range);
            tiles.forEach(function (tile) {
                var data = _.cloneDeep(effect.data);
                data = _.defaults(data, { tile: tile, source: action.data.source });
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
        if (action.data.ability.cost > 0) {
            var result = elements.setIn([action.data.source.id, 'status', 'mana'], action.data.source.status.mana - action.data.ability.cost);
            return result;
        }
        else {
            var result = elements.setIn([action.data.source.id, 'status', 'mana'], action.data.source.status.mana + 2);
            return result;
        }
    });
}
exports.ExecuteAbility = ExecuteAbility;
