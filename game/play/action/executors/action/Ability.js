"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var GameBoard_1 = require("../../../../board/GameBoard");
function ExecuteAbility(action, scene) {
    var effects = action.data.ability.effects;
    _.forEach(effects, function (effect) {
        var tiles = GameBoard_1.GameBoard.GetTilesInRange(scene, action.data.target.pos, effect.range);
        tiles.forEach(function (tile) {
            var data = _.cloneDeep(effect.data);
            data = _.defaults(data, { tile: tile, source: action.data.source });
            var unit = GameBoard_1.GameBoard.GetUnitAtPosition(scene, tile.pos);
            if (unit) {
                scene = GameBoard_1.GameBoard.AddActions(scene, {
                    type: effect.type,
                    data: _.defaults(data, { entity_id: unit.id })
                });
            }
            else {
                scene = GameBoard_1.GameBoard.AddActions(scene, {
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
    }
    else {
        mana += 2;
    }
    scene = GameBoard_1.GameBoard.SetMP(scene, unit_id, mana);
    return scene;
}
exports.ExecuteAbility = ExecuteAbility;
