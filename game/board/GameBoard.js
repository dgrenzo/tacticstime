"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Tile_1 = require("./Tile");
var Scene_1 = require("../../engine/scene/Scene");
var Entity_1 = require("../../engine/scene/Entity");
var Unit_1 = require("./Unit");
var Movement_1 = require("../play/action/executors/action/Movement");
var Ability_1 = require("../play/action/executors/action/Ability");
var Damage_1 = require("../play/action/executors/action/Damage");
var Killed_1 = require("../play/action/executors/action/Killed");
var CreateUnit_1 = require("../play/action/executors/action/CreateUnit");
var SummonUnit_1 = require("../play/action/executors/action/SummonUnit");
var TypedEventEmitter_1 = require("../../engine/listener/TypedEventEmitter");
var GameAura_1 = require("../play/action/auras/GameAura");
var GameBoard = (function (_super) {
    __extends(GameBoard, _super);
    function GameBoard() {
        var _this = _super.call(this) || this;
        _this.m_events = new TypedEventEmitter_1.TypedEventEmitter();
        return _this;
    }
    Object.defineProperty(GameBoard.prototype, "events", {
        get: function () {
            return this.m_events;
        },
        enumerable: true,
        configurable: true
    });
    GameBoard.prototype.init = function (board_config) {
        var _this = this;
        _.forEach(board_config.layout.tiles, function (tile, index) {
            var pos = {
                x: index % board_config.layout.width,
                y: Math.floor(index / board_config.layout.width)
            };
            _this.scene = GameBoard.AddElement(_this.scene, CreateTile(pos, tile));
        });
    };
    GameBoard.ExecuteActionStack = function (scene, event_watcher) {
        do {
            var action = GameBoard.GetNextAction(scene);
            if (!action) {
                return scene;
            }
            scene = GameBoard.ExecuteNextAction(scene);
            if (event_watcher) {
                console.log(action.type, action.data);
                event_watcher.emit(action.type, { action: action, scene: scene });
            }
        } while (true);
    };
    GameBoard.ExecuteActionListeners = function (scene) {
        var sent_ids = [];
        var finished = false;
        do {
            var action = GameBoard.GetNextAction(scene);
            var action_listeners = GameBoard.GetListeners(scene).get(action.type);
            if (!action_listeners) {
                break;
            }
            var index = 0;
            var next = void 0;
            var sent = false;
            do {
                next = action_listeners.get(index, null);
                var listener_id = next.id;
                if (sent_ids.indexOf(listener_id) > -1) {
                    index++;
                }
                else {
                    scene = GameAura_1.GameAura.ExecuteAuraListener(scene, next.config);
                    sent = true;
                    sent_ids.push(listener_id);
                }
                if (index >= action_listeners.count() - 1) {
                    finished = true;
                }
            } while (!finished && !sent);
        } while (!finished);
        return scene;
    };
    GameBoard.ExecuteNextAction = function (scene) {
        if (!GameBoard.GetNextAction(scene)) {
            return scene;
        }
        scene = GameBoard.ExecuteActionListeners(scene);
        var action = GameBoard.GetNextAction(scene);
        switch (action.type) {
            case "MOVE":
                scene = Movement_1.ExecuteMove(action, scene);
                break;
            case "ABILITY":
                scene = Ability_1.ExecuteAbility(action, scene);
                break;
            case "DAMAGE":
                scene = Damage_1.ExecuteDamage(action, scene);
                break;
            case "UNIT_KILLED":
                scene = Killed_1.ExecuteKilled(action, scene);
                break;
            case "CREATE_UNIT":
                scene = CreateUnit_1.ExecuteCreateUnit(action, scene);
                break;
            case "SUMMON_UNIT":
                scene = SummonUnit_1.ExecuteSummonUnit(action, scene);
                break;
        }
        scene = GameBoard.ShiftFirstAction(scene);
        return scene;
    };
    GameBoard.GetTilesInRange = function (scene, pos, range) {
        var tiles = GameBoard.GetTiles(scene);
        return tiles.filter(function (tile) {
            var distance = Math.abs(tile.pos.x - pos.x) + Math.abs(tile.pos.y - pos.y);
            return range.max >= distance && range.min <= distance;
        });
    };
    GameBoard.GetTiles = function (scene) {
        return Scene_1.Scene.GetElements(scene).filter(function (element) {
            return Tile_1.isTile(element);
        }).toList();
    };
    GameBoard.GetNextAction = function (scene) {
        var actions = Scene_1.Scene.GetActions(scene);
        return actions.first();
    };
    GameBoard.ShiftFirstAction = function (scene) {
        var actions = Scene_1.Scene.GetActions(scene);
        return Scene_1.Scene.SetActions(scene, actions.shift());
    };
    GameBoard.SetEntityPosition = function (scene, entity_id, pos) {
        var elements = Scene_1.Scene.GetElements(scene);
        var result = elements.setIn([entity_id, 'pos'], pos);
        return Scene_1.Scene.SetElements(scene, result);
    };
    GameBoard.GetEntitiesAt = function (scene, pos) {
        var elements = Scene_1.Scene.GetElements(scene);
        var entities = elements.filter(Entity_1.isEntity);
        return entities.filter(function (entity) {
            return pos && entity.pos.x === pos.x && entity.pos.y === pos.y;
        }).toList();
    };
    GameBoard.SetHP = function (scene, entity_id, hp) {
        var elements = Scene_1.Scene.GetElements(scene);
        var result = elements.setIn([entity_id, 'status', 'hp'], hp);
        return Scene_1.Scene.SetElements(scene, result);
    };
    GameBoard.SetMP = function (scene, entity_id, mana) {
        var elements = Scene_1.Scene.GetElements(scene);
        var result = elements.setIn([entity_id, 'status', 'mana'], mana);
        return Scene_1.Scene.SetElements(scene, result);
    };
    GameBoard.UpdateAction = function (scene, index, action) {
        var actions = Scene_1.Scene.GetActions(scene);
        actions = actions.remove(index);
        actions = actions.insert(index, action);
        return GameBoard.SetActions(scene, actions);
    };
    GameBoard.AddActions = function (scene, game_actions) {
        game_actions = _.concat(game_actions);
        var actions = Scene_1.Scene.GetActions(scene);
        var result = actions.concat(game_actions);
        return Scene_1.Scene.SetActions(scene, result);
    };
    GameBoard.GetUnitAtPosition = function (scene, pos) {
        var unit = null;
        GameBoard.GetEntitiesAt(scene, pos).forEach(function (element) {
            if (Unit_1.isUnit(element)) {
                unit = element;
                return false;
            }
            return true;
        });
        return unit;
    };
    GameBoard.GetTileAtPosiiton = function (scene, pos) {
        var tile = null;
        GameBoard.GetEntitiesAt(scene, pos).forEach(function (element) {
            if (Tile_1.isTile(element)) {
                tile = element;
                return false;
            }
            return true;
        });
        return tile;
    };
    GameBoard.GetUnit = function (scene, id) {
        var elements = Scene_1.Scene.GetElements(scene);
        return elements.get(id);
    };
    GameBoard.GetUnits = function (scene) {
        var elements = Scene_1.Scene.GetElements(scene);
        return elements.filter(function (element) {
            return Unit_1.isUnit(element);
        }).toList();
    };
    return GameBoard;
}(Scene_1.Scene));
exports.GameBoard = GameBoard;
var _ID = 0;
function CreateEntity() {
    return {
        id: _ID++,
        element_type: "ENTITY",
        pos: {
            x: 0,
            y: 0,
        }
    };
}
exports.CreateEntity = CreateEntity;
function CreateEffect() {
    return {
        id: _ID++,
        element_type: "EFFECT",
        pos: {
            x: 0,
            y: 0,
        }
    };
}
exports.CreateEffect = CreateEffect;
function CreateAura(config) {
    var aura = {
        element_type: "AURA",
        id: _ID++,
        config: _.cloneDeep(config)
    };
    aura.config.config = {};
    return aura;
}
exports.CreateAura = CreateAura;
function CreateUnit(def, faction) {
    var entity = CreateEntity();
    entity.element_type = "UNIT";
    entity.data = {
        unit_level: 1,
        unit_type: def.display.sprite,
        faction: faction,
    };
    entity.base_stats = _.cloneDeep(def.stats);
    entity.stats = _.cloneDeep(def.stats);
    entity.status = {
        mana: 0,
        hp: def.stats.hp,
    };
    entity.auras = _.cloneDeep(def.auras);
    entity.abilities = _.concat(_.cloneDeep(def.abilities), "wait");
    return entity;
}
exports.CreateUnit = CreateUnit;
function CreateTile(pos, type) {
    return {
        id: _ID++,
        element_type: "TILE",
        pos: pos,
        data: {
            tile_type: type,
        }
    };
}
