"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var GameBoard_1 = require("../../board/GameBoard");
var ActionEffect = (function () {
    function ActionEffect() {
    }
    ActionEffect.GetFromPath = function (scene, context, path) {
        var unit = context.unit, action = context.action, aura = context.aura;
        var data = null;
        switch (path[0]) {
            case "CONST": return path[1];
            case "ACTION":
                data = action.data;
                break;
            case "AURA_CONFIG":
                data = aura.config;
                break;
        }
        for (var i = 1; i < path.length; i++) {
            data = data[path[i]];
        }
        return data;
    };
    ActionEffect.UpdateActionValue = function (scene, action, path, value) {
        var data = action.data;
        for (var i = 0; i < path.length - 1; i++) {
            data = data[path[i]];
        }
        data[path[path.length - 1]] = value;
        return action;
    };
    ActionEffect.ExecuteEffect = function (scene, effect, context) {
        var _a;
        var unit = context.unit, action = context.action, aura = context.aura;
        var range = (_a = effect.range) !== null && _a !== void 0 ? _a : { max: 0, min: 0 };
        if (effect.type === "UPDATE_ACTION_VALUE") {
            var value = ActionEffect.GetFromPath(scene, context, effect.data.value);
            action = ActionEffect.UpdateActionValue(scene, action, effect.data.value_src, value);
            return GameBoard_1.GameBoard.UpdateAction(scene, 0, action);
            ;
        }
        var target_tile = (action.data.target ? action.data.target : action.data.source).pos;
        var tiles = GameBoard_1.GameBoard.GetTilesInRange(scene, target_tile, effect.range);
        var count = tiles.count();
        for (var i = 0; i < count; i++) {
            var tile = tiles.get(i);
            var data = _.cloneDeep(effect.data);
            var keys = Object.keys(data);
            for (var n = 0; n < keys.length; n++) {
                var key = keys[n];
                data[key] = ActionEffect.GetFromPath(scene, context, data[key]);
            }
            data = _.defaults(data, { tile: tile, source: action.data.source });
            var unit_1 = GameBoard_1.GameBoard.GetUnitAtPosition(scene, tile.pos);
            if (unit_1) {
                scene = GameBoard_1.GameBoard.AddActions(scene, {
                    type: effect.type,
                    data: _.defaults(data, { entity_id: unit_1.id })
                });
            }
            else {
                scene = GameBoard_1.GameBoard.AddActions(scene, {
                    type: effect.type,
                    data: data
                });
            }
        }
        return scene;
    };
    return ActionEffect;
}());
exports.ActionEffect = ActionEffect;
