"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyTurn = void 0;
var _ = require("lodash");
var pathfinding_1 = require("../pathfinding");
var abilities_1 = require("./action/abilities");
var AbilityTargetUI_1 = require("./action/AbilityTargetUI");
var TURN_STATE;
(function (TURN_STATE) {
    TURN_STATE[TURN_STATE["BEFORE_MOVE"] = 0] = "BEFORE_MOVE";
    TURN_STATE[TURN_STATE["MOVING"] = 1] = "MOVING";
    TURN_STATE[TURN_STATE["BEFORE_ACTING"] = 2] = "BEFORE_ACTING";
    TURN_STATE[TURN_STATE["ACTING"] = 3] = "ACTING";
    TURN_STATE[TURN_STATE["AFTER_ACTING"] = 4] = "AFTER_ACTING";
})(TURN_STATE || (TURN_STATE = {}));
var EnemyTurn = (function () {
    function EnemyTurn(m_unit_id, m_board_controller, m_onComplete) {
        var _this = this;
        this.m_unit_id = m_unit_id;
        this.m_board_controller = m_board_controller;
        this.m_onComplete = m_onComplete;
        this.m_faction = null;
        this.scoreBoard = function (board) {
            var score = Math.random() / 4;
            board.getUnits().forEach(function (unit) {
                if (unit.data.faction !== _this.m_faction) {
                    score -= unit.status.hp;
                    score -= 5;
                }
                else {
                    score += 50;
                    score += unit.status.hp;
                }
            });
            var active_unit = board.getUnit(_this.m_unit_id);
            if (active_unit) {
                var closest_1 = Infinity;
                board.getUnits().forEach(function (unit) {
                    if (unit.data.faction !== _this.m_faction) {
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
        };
        var move_promises = [];
        var action_promises = [];
        this.m_faction = this.m_board_controller.getUnit(this.m_unit_id).data.faction;
        var ai_ctrl = this.m_board_controller.createClone();
        var move_options = pathfinding_1.GetMoveOptions(ai_ctrl.getUnit(m_unit_id), ai_ctrl.board);
        var ai_options = [];
        _.forEach(move_options, function (option) {
            var move_ctrl = ai_ctrl.createClone();
            var move_action = _this.toMoveAction(option);
            move_ctrl.sendAction(move_action);
            move_promises.push(move_ctrl.executeActionStack().then(function () {
                var active_unit = move_ctrl.getUnit(_this.m_unit_id);
                _.forEach(active_unit.abilities, function (ability_name) {
                    var ability_def = abilities_1.GetAbilityDef(ability_name);
                    if (active_unit.status.mana < ability_def.cost) {
                        return;
                    }
                    var ability_ui = new AbilityTargetUI_1.AbilityTargetUI(ability_def, active_unit, move_ctrl);
                    _.forEach(ability_ui.options, function (ability_option) {
                        var ability_action = ability_ui.getAction(ability_option.tile);
                        var ability_ctrl = move_ctrl.createClone();
                        ability_ctrl.sendAction(ability_action);
                        action_promises.push(ability_ctrl.executeActionStack().then(function () {
                            var opt = {
                                score: _this.scoreBoard(ability_ctrl.board),
                                move_action: move_action,
                                ability_action: ability_action,
                            };
                            return ai_options.push(opt);
                        }));
                    });
                });
            }));
        });
        Promise.all(move_promises)
            .then(function () {
            return Promise.all(action_promises);
        })
            .then(function () {
            var best = null;
            _.forEach(ai_options, function (option) {
                if (best === null || option.score > best.score) {
                    best = option;
                }
            });
            _this.m_board_controller.sendAction(best.move_action);
            _this.m_board_controller.executeActionStack().then(function () {
                _this.m_board_controller.sendAction(best.ability_action);
                _this.m_board_controller.executeActionStack().then(_this.m_onComplete);
            });
        });
    }
    EnemyTurn.prototype.toMoveAction = function (path) {
        var action = [];
        while (path) {
            action.unshift({
                type: "MOVE",
                data: {
                    entity_id: this.m_unit_id,
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
    };
    return EnemyTurn;
}());
exports.EnemyTurn = EnemyTurn;
