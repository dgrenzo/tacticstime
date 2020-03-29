"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FSM_1 = require("../../engine/FSM");
var MoveActionUI_1 = require("./action/MoveActionUI");
var UnitSelectedPanel_1 = require("./interface/UnitSelectedPanel");
var AbilityTargetUI_1 = require("./action/AbilityTargetUI");
var TURN_STATE;
(function (TURN_STATE) {
    TURN_STATE[TURN_STATE["BEFORE_MOVE"] = 0] = "BEFORE_MOVE";
    TURN_STATE[TURN_STATE["MOVING"] = 1] = "MOVING";
    TURN_STATE[TURN_STATE["BEFORE_ACTING"] = 2] = "BEFORE_ACTING";
    TURN_STATE[TURN_STATE["ACTING"] = 3] = "ACTING";
    TURN_STATE[TURN_STATE["AFTER_ACTING"] = 4] = "AFTER_ACTING";
})(TURN_STATE || (TURN_STATE = {}));
var PlayerTurn = (function () {
    function PlayerTurn(m_active_unit, m_controller, m_onComplete) {
        var _this = this;
        this.m_active_unit = m_active_unit;
        this.m_controller = m_controller;
        this.m_onComplete = m_onComplete;
        this.initFSM = function () {
            _this.m_fsm = new FSM_1.FSM();
            _this.m_fsm.registerState(TURN_STATE.BEFORE_MOVE, {
                enter: function () {
                    _this.selectTile(_this.m_controller.getTile(_this.m_active_unit));
                    _this.m_action_ui = new MoveActionUI_1.MoveActionUI(_this.m_active_unit, _this.m_controller);
                    _this.m_controller.on("TILE_CLICKED", _this.onTileClicked);
                },
                exit: function () {
                    _this.m_controller.off("TILE_CLICKED", _this.onTileClicked);
                    _this.selectTile(null);
                    _this.m_action_ui.hideOptions();
                    _this.m_action_ui = null;
                }
            });
            _this.m_fsm.registerState(TURN_STATE.MOVING, {});
            _this.m_fsm.registerState(TURN_STATE.BEFORE_ACTING, {
                enter: function () {
                    _this.m_selected_tile = _this.m_controller.getTile(_this.m_active_unit);
                    _this.m_selected_panel.showUnitPanel(_this.m_active_unit);
                    _this.m_controller.on("TILE_CLICKED", _this.onTileClicked);
                },
                exit: function () {
                    _this.m_controller.off("TILE_CLICKED", _this.onTileClicked);
                    _this.m_selected_panel.hide();
                    if (_this.m_action_ui) {
                        _this.selectTile(null);
                        _this.m_action_ui.hideOptions();
                        _this.m_action_ui = null;
                    }
                }
            });
            _this.m_fsm.registerState(TURN_STATE.ACTING, {});
            _this.m_fsm.registerState(TURN_STATE.AFTER_ACTING, {
                enter: function () {
                    _this.m_onComplete();
                }
            });
        };
        this.onAbilitySelected = function (ability) {
            if (_this.m_action_ui) {
                _this.m_action_ui.hideOptions();
            }
            switch (ability.name) {
                default:
                    _this.m_action_ui = new AbilityTargetUI_1.AbilityTargetUI(ability, _this.m_active_unit, _this.m_controller);
                    break;
            }
        };
        this.onTileClicked = function (tile) {
            var action = _this.m_action_ui.getAction(tile);
            if (!action) {
                return _this.selectTile(tile);
            }
            _this.startAction(action);
        };
        this.startAction = function (action) {
            switch (_this.m_fsm.state) {
                case TURN_STATE.BEFORE_MOVE:
                    _this.m_fsm.setState(TURN_STATE.MOVING);
                    break;
                case TURN_STATE.BEFORE_ACTING:
                    _this.m_fsm.setState(TURN_STATE.ACTING);
                    break;
            }
            _this.m_controller.sendAction(action);
            _this.m_controller.executeActionStack(_this.onActionComplete);
        };
        this.onActionComplete = function () {
            switch (_this.m_fsm.state) {
                case TURN_STATE.MOVING:
                    _this.m_fsm.setState(TURN_STATE.BEFORE_ACTING);
                    break;
                case TURN_STATE.ACTING:
                    _this.m_fsm.setState(TURN_STATE.AFTER_ACTING);
                    break;
            }
        };
        this.selectTile = function (tile) {
            if (_this.m_selected_tile) {
                _this.m_controller.emit("SET_PLUGIN", { id: _this.m_selected_tile.id, plugin: 'batch' });
            }
            if (!tile) {
                return;
            }
            _this.m_selected_tile = tile;
            _this.m_controller.emit("SET_PLUGIN", { id: _this.m_selected_tile.id, plugin: 'highlight_green' });
            _this.m_controller.emit("TILE_SELECTED", _this.m_selected_tile);
        };
        this.m_selected_panel = new UnitSelectedPanel_1.UnitSelectedPanel(this.m_controller);
        this.m_selected_panel.onAbilitySelected(this.onAbilitySelected);
        this.initFSM();
        this.m_fsm.setState(TURN_STATE.BEFORE_MOVE);
    }
    return PlayerTurn;
}());
exports.PlayerTurn = PlayerTurn;
