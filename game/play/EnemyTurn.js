"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var GameBoard_1 = require("../board/GameBoard");
var pathfinding_1 = require("../pathfinding");
var abilities_1 = require("./action/abilities");
var TURN_STATE;
(function (TURN_STATE) {
    TURN_STATE[TURN_STATE["BEFORE_MOVE"] = 0] = "BEFORE_MOVE";
    TURN_STATE[TURN_STATE["MOVING"] = 1] = "MOVING";
    TURN_STATE[TURN_STATE["BEFORE_ACTING"] = 2] = "BEFORE_ACTING";
    TURN_STATE[TURN_STATE["ACTING"] = 3] = "ACTING";
    TURN_STATE[TURN_STATE["AFTER_ACTING"] = 4] = "AFTER_ACTING";
})(TURN_STATE || (TURN_STATE = {}));
var EnemyTurn = (function () {
    function EnemyTurn() {
    }
    EnemyTurn.FindBestMove = function (base_scene, unit_id) {
        var unit = GameBoard_1.GameBoard.GetUnit(base_scene, unit_id);
        var move_options = pathfinding_1.GetMoveOptions(unit, base_scene);
        var ai_options = [];
        _.forEach(move_options, function (option) {
            var move_action = ToMoveAction(option, unit.id);
            var move_scene = base_scene;
            move_scene = GameBoard_1.GameBoard.AddActions(move_scene, move_action);
            move_scene = GameBoard_1.GameBoard.ExecuteActionStack(move_scene);
            var active_unit = GameBoard_1.GameBoard.GetUnit(move_scene, unit_id);
            _.forEach(active_unit.abilities, function (ability_name) {
                var ability_def = abilities_1.GetAbilityDef(ability_name);
                if (active_unit.status.mana < ability_def.cost) {
                    return;
                }
                var ability_options = GetAbilityOptions(move_scene, active_unit, ability_def);
                _.forEach(ability_options, function (ability_option) {
                    var ability_action = ToAction(ability_option.tile, unit, ability_def);
                    var ability_scene = move_scene;
                    ability_scene = GameBoard_1.GameBoard.AddActions(ability_scene, ability_action);
                    ability_scene = GameBoard_1.GameBoard.ExecuteActionStack(ability_scene);
                    var opt = {
                        score: ScoreBoard(ability_scene, active_unit.id),
                        move_action: move_action,
                        ability_action: ability_action,
                    };
                    return ai_options.push(opt);
                });
            });
        });
        var best = null;
        _.forEach(ai_options, function (option) {
            if (best === null || option.score > best.score) {
                best = option;
            }
        });
        console.log('best');
        console.log(best.move_action);
        console.log(best.ability_action);
        var scene = base_scene;
        scene = GameBoard_1.GameBoard.AddActions(scene, best.move_action);
        scene = GameBoard_1.GameBoard.AddActions(scene, best.ability_action);
        return scene;
    };
    return EnemyTurn;
}());
exports.EnemyTurn = EnemyTurn;
function GetAbilityOptions(scene, active_unit, ability_def) {
    var target_def = ability_def.target;
    var start = active_unit.pos;
    var max_range = target_def.range.max;
    var min_range = target_def.range.min;
    var options = [];
    for (var offset_x = -max_range; offset_x <= max_range; offset_x++) {
        var max_y = max_range - Math.abs(offset_x);
        for (var offset_y = -max_y; offset_y <= max_y; offset_y++) {
            if (Math.abs(offset_x) + Math.abs(offset_y) < min_range) {
                continue;
            }
            var target_pos = {
                x: start.x + offset_x,
                y: start.y + offset_y
            };
            var tile = GameBoard_1.GameBoard.GetTileAtPosiiton(scene, target_pos);
            if (tile) {
                var target_unit = GameBoard_1.GameBoard.GetUnitAtPosition(scene, tile.pos);
                switch (ability_def.target.target_type) {
                    case "EMPTY":
                        if (target_unit) {
                            continue;
                        }
                        break;
                    case "ALLY":
                        if (!target_unit || active_unit.data.faction !== target_unit.data.faction) {
                            continue;
                        }
                        break;
                    case "ENEMY":
                        if (!target_unit || active_unit.data.faction === target_unit.data.faction) {
                            continue;
                        }
                        break;
                    case "ANY":
                        break;
                }
                options.push({ tile: tile });
            }
        }
    }
    return options;
}
function ScoreBoard(scene, unit_id) {
    var score = Math.random() / 4;
    var active_unit = GameBoard_1.GameBoard.GetUnit(scene, unit_id);
    if (!active_unit) {
        return score;
    }
    var faction = active_unit.data.faction;
    GameBoard_1.GameBoard.GetUnits(scene).forEach(function (unit) {
        if (unit.data.faction !== faction) {
            score -= unit.status.hp;
            score -= 5;
        }
        else {
            score += 50;
            score += unit.status.hp;
        }
    });
    if (active_unit) {
        var closest_1 = Infinity;
        GameBoard_1.GameBoard.GetUnits(scene).forEach(function (unit) {
            if (unit.data.faction !== faction) {
                var distance = Math.random() / 4 + Math.abs(active_unit.pos.x - unit.pos.x) + Math.abs(active_unit.pos.y - unit.pos.y);
                if (distance < closest_1) {
                    closest_1 = distance;
                }
            }
        });
        if (closest_1 != Infinity) {
            score -= closest_1;
        }
    }
    return score;
}
function ToMoveAction(path, unit_id) {
    var action = [];
    while (path) {
        action.unshift({
            type: "MOVE",
            data: {
                entity_id: unit_id,
                move: {
                    to: {
                        x: path.tile.pos.x,
                        y: path.tile.pos.y,
                    }
                }
            }
        });
        path = path.last;
    }
    return action;
}
function ToAction(tile, active_unit, ability_def) {
    return [
        {
            type: "ABILITY",
            data: {
                source: active_unit,
                target: tile,
                ability: ability_def,
            }
        }
    ];
}
