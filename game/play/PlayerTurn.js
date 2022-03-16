"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FSM_1 = require("../../engine/FSM");
var TURN_STATE;
(function (TURN_STATE) {
    TURN_STATE[TURN_STATE["BEFORE_MOVE"] = 0] = "BEFORE_MOVE";
    TURN_STATE[TURN_STATE["MOVING"] = 1] = "MOVING";
    TURN_STATE[TURN_STATE["BEFORE_ACTING"] = 2] = "BEFORE_ACTING";
    TURN_STATE[TURN_STATE["ACTING"] = 3] = "ACTING";
    TURN_STATE[TURN_STATE["AFTER_ACTING"] = 4] = "AFTER_ACTING";
})(TURN_STATE || (TURN_STATE = {}));
var PlayerTurn = (function () {
    function PlayerTurn(m_selected_id, m_controller, m_onComplete) {
        var _this = this;
        this.m_selected_id = m_selected_id;
        this.m_controller = m_controller;
        this.m_onComplete = m_onComplete;
        this.initFSM = function () {
            _this.m_fsm = new FSM_1.FSM();
        };
        this.onAbilitySelected = function (ability) {
        };
        this.onTileClicked = function (tile) {
        };
        this.startAction = function (action) {
        };
        this.onActionComplete = function () {
        };
        this.selectTile = function (tile) {
        };
        this.markTile = function (tile, plugin) {
        };
        this.markTiles = function (options, plugin) {
        };
    }
    return PlayerTurn;
}());
exports.PlayerTurn = PlayerTurn;
