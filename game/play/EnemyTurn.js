"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var GameBoard_1 = require("../board/GameBoard");
var Pathfinding_1 = require("../pathfinding/Pathfinding");
var abilities_1 = require("./action/abilities");
var AuraLoader_1 = require("../assets/AuraLoader");
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
        return __awaiter(this, void 0, void 0, function () {
            var LAG_TIME, lag_timeout, unit, move_options, ai_options, i, option, move_action, move_scene, active_unit, n, ability_name, ability_def, ability_options, p, ability_action, ability_scene, opt, best, scene;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        LAG_TIME = 20;
                        lag_timeout = Date.now() + LAG_TIME;
                        unit = GameBoard_1.GameBoard.GetUnit(base_scene, unit_id);
                        move_options = Pathfinding_1.GetMoveOptions(unit, base_scene);
                        ai_options = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < move_options.length)) return [3, 9];
                        option = move_options[i];
                        move_action = ToMoveAction(option, unit.id);
                        move_scene = base_scene;
                        move_scene = GameBoard_1.GameBoard.AddActions(move_scene, move_action);
                        move_scene = GameBoard_1.GameBoard.ExecuteActionStack(move_scene);
                        active_unit = GameBoard_1.GameBoard.GetUnit(move_scene, unit_id);
                        n = 0;
                        _a.label = 2;
                    case 2:
                        if (!(n < active_unit.abilities.length)) return [3, 8];
                        ability_name = active_unit.abilities[n];
                        ability_def = abilities_1.GetAbilityDef(ability_name);
                        if (active_unit.status.mana < ability_def.cost) {
                            return [3, 7];
                        }
                        ability_options = GetAbilityOptions(move_scene, active_unit, ability_def);
                        p = 0;
                        _a.label = 3;
                    case 3:
                        if (!(p < ability_options.length)) return [3, 7];
                        ability_action = ToAction(ability_options[p].tile, unit, ability_def);
                        ability_scene = move_scene;
                        ability_scene = GameBoard_1.GameBoard.AddActions(ability_scene, ability_action);
                        ability_scene = GameBoard_1.GameBoard.ExecuteActionStack(ability_scene);
                        opt = {
                            score: ScoreBoard(ability_scene, active_unit.id),
                            move_action: move_action,
                            ability_action: ability_action,
                        };
                        if (!(Date.now() > lag_timeout)) return [3, 5];
                        console.log('waiting because of lag ' + lag_timeout);
                        return [4, new Promise(function (resolve) { requestAnimationFrame(resolve); })];
                    case 4:
                        _a.sent();
                        lag_timeout = Date.now() + LAG_TIME;
                        _a.label = 5;
                    case 5:
                        ai_options.push(opt);
                        _a.label = 6;
                    case 6:
                        p++;
                        return [3, 3];
                    case 7:
                        n++;
                        return [3, 2];
                    case 8:
                        i++;
                        return [3, 1];
                    case 9:
                        best = null;
                        _.forEach(ai_options, function (option) {
                            if (best === null || option.score > best.score) {
                                best = option;
                            }
                        });
                        scene = base_scene;
                        scene = GameBoard_1.GameBoard.AddActions(scene, best.move_action);
                        scene = GameBoard_1.GameBoard.AddActions(scene, best.ability_action);
                        return [2, scene];
                }
            });
        });
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
function ScoreUnit(unit) {
    var score = 0;
    score += 5;
    score += unit.status.hp;
    if (unit.auras) {
        for (var i = 0; i < unit.auras.length; i++) {
            var aura_name = unit.auras[i];
            score += AuraLoader_1.AuraLoader.GetAuraDefinition(aura_name).value;
        }
    }
    return score;
}
function ScoreBoard(scene, unit_id) {
    var score = Math.random() / 4;
    var active_unit = GameBoard_1.GameBoard.GetUnit(scene, unit_id);
    if (!active_unit) {
        return score;
    }
    var faction = active_unit.data.faction;
    GameBoard_1.GameBoard.GetUnits(scene).forEach(function (unit) {
        var unit_score = ScoreUnit(unit);
        score += unit_score * (unit.data.faction === active_unit.data.faction ? 1 : -1);
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
