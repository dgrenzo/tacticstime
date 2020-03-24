"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FSM_1 = require("../../engine/FSM");
var MoveActionUI_1 = require("./action/MoveActionUI");
var UnitSelectedPanel_1 = require("./interface/UnitSelectedPanel");
var AttackActionUI_1 = require("./action/AttackActionUI");
var PLAY_STATE;
(function (PLAY_STATE) {
    PLAY_STATE[PLAY_STATE["NO_SELECTION"] = 0] = "NO_SELECTION";
    PLAY_STATE[PLAY_STATE["SELECTED"] = 1] = "SELECTED";
    PLAY_STATE[PLAY_STATE["ACTING"] = 2] = "ACTING";
})(PLAY_STATE || (PLAY_STATE = {}));
var PlayerTurn = (function () {
    function PlayerTurn(m_controller) {
        var _this = this;
        this.m_controller = m_controller;
        this.setupFSM = function () {
            if (_this.m_fsm) {
                return;
            }
            _this.m_fsm = new FSM_1.FSM();
            _this.m_fsm.registerState(PLAY_STATE.NO_SELECTION, {
                enter: function () {
                    _this.m_active_tile = null;
                },
            });
            _this.m_fsm.registerState(PLAY_STATE.SELECTED, {
                enter: function () {
                    _this.m_controller.emit("TILE_SELECTED", _this.m_active_tile);
                    _this.m_controller.emit("SET_PLUGIN", { id: _this.m_active_tile.id, plugin: 'highlight_green' });
                    _this.m_active_unit = _this.m_controller.getUnit(_this.m_active_tile);
                    _this.m_selected_panel.showUnitPanel(_this.m_active_unit);
                },
                exit: function () {
                    _this.m_controller.emit("SET_PLUGIN", { id: _this.m_active_tile.id, plugin: 'batch' });
                    _this.m_selected_panel.hide();
                    if (_this.m_action_ui) {
                        _this.m_action_ui.hideOptions();
                        _this.m_action_ui = null;
                    }
                }
            });
            _this.m_fsm.registerState(PLAY_STATE.ACTING, {});
        };
        this.onAbilitySelected = function (ability) {
            switch (ability.name) {
                case "MOVE":
                    _this.m_action_ui = new MoveActionUI_1.MoveActionUI(_this.m_active_tile, _this.m_controller);
                    break;
                case "STRIKE":
                    _this.m_action_ui = new AttackActionUI_1.AttackActionUI(_this.m_active_tile, _this.m_controller);
                    break;
            }
        };
        this.onTileClicked = function (tile) {
            switch (_this.m_fsm.state) {
                case PLAY_STATE.NO_SELECTION:
                    _this.selectTile(tile);
                    break;
                case PLAY_STATE.SELECTED:
                    var action = [];
                    if (_this.m_action_ui) {
                        action = _this.m_action_ui.getAction(tile);
                    }
                    if (action.length > 0) {
                        _this.m_controller.sendAction(action);
                        _this.m_controller.executeActionStack();
                        _this.m_fsm.setState(PLAY_STATE.ACTING);
                    }
                    else {
                        _this.m_fsm.setState(PLAY_STATE.NO_SELECTION);
                        _this.selectTile(tile);
                    }
                    break;
                default:
                    return;
            }
        };
        this.selectTile = function (tile) {
            if (!tile) {
                return;
            }
            _this.m_active_tile = tile;
            _this.m_fsm.setState(PLAY_STATE.SELECTED);
        };
        this.m_selected_panel = new UnitSelectedPanel_1.UnitSelectedPanel(this.m_controller);
        this.m_selected_panel.onAbilitySelected(this.onAbilitySelected);
        this.m_controller.on("TILE_CLICKED", this.onTileClicked);
        this.setupFSM();
        this.m_fsm.setState(PLAY_STATE.NO_SELECTION);
    }
    return PlayerTurn;
}());
exports.PlayerTurn = PlayerTurn;
