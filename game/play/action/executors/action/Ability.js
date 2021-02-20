"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteAbility = void 0;
var _ = require("lodash");
var UpdateElements_1 = require("../../../UpdateElements");
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
        var unit_id = action.data.source.id;
        var mana = action.data.source.status.mana;
        if (action.data.ability.cost > 0) {
            mana -= action.data.ability.cost;
            return UpdateElements_1.UpdateElements.SetMP(elements, unit_id, mana);
        }
        else {
            mana += 2;
            return UpdateElements_1.UpdateElements.SetMP(elements, unit_id, mana);
        }
    });
}
exports.ExecuteAbility = ExecuteAbility;
