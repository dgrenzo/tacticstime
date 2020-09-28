"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var BoardController_1 = require("../board/BoardController");
var UnitQueue_1 = require("../play/UnitQueue");
var event_1 = require("../../engine/listener/event");
var Loader_1 = require("../board/Loader");
var render_1 = require("../../engine/render/render");
var HealthBar_1 = require("../play/interface/HealthBar");
var TileHighlighter_1 = require("../extras/TileHighlighter");
var effects_1 = require("../effects");
var EnemyTurn_1 = require("../play/EnemyTurn");
var BoardAnimator_1 = require("../animation/BoardAnimator");
var EncounterState;
(function (EncounterState) {
    EncounterState[EncounterState["INIT"] = 0] = "INIT";
    EncounterState[EncounterState["PLANNING"] = 1] = "PLANNING";
    EncounterState[EncounterState["BATTLE"] = 2] = "BATTLE";
    EncounterState[EncounterState["RESULT"] = 3] = "RESULT";
    EncounterState[EncounterState["CLEANUP"] = 4] = "CLEANUP";
})(EncounterState = exports.EncounterState || (exports.EncounterState = {}));
var EncounterController = (function () {
    function EncounterController(m_config) {
        var _this = this;
        this.m_config = m_config;
        this.m_event_manager = new event_1.EventManager();
        this.m_interface_container = new PIXI.Container();
        this.loadMap = function (path) {
            return Loader_1.LoadBoard(path).then(function (board_data) {
                _this.m_board_controller.initBoard(board_data);
                _this.setupListeners();
                _this.m_board_controller.sendToRenderer(_this.m_renderer);
                _this.m_board_controller.setAnimator(_this.m_animator);
                _this.onSetupComplete();
                return;
            });
        };
        this.addUnits = function (units) {
            units.forEach(_this.m_board_controller.addUnit);
        };
        this.setupListeners = function () {
            _this.m_board_controller.on("CREATE_UNIT", function (data) {
                _this.m_unit_queue.addUnit(data.unit);
            });
            _this.m_board_controller.on("UNIT_KILLED", function (data) {
                _this.m_unit_queue.removeUnit(data.entity_id);
            });
            _this.m_board_controller.on("UNIT_CREATED", function (data) {
                var health_bar = new HealthBar_1.HealthBar(data.unit.id, _this.m_board_controller, _this.m_renderer);
                _this.m_renderer.effects_container.addChild(health_bar.sprite);
            });
        };
        this.onSetupComplete = function () {
            _this.m_config.pixi_app.stage.addChild(_this.m_renderer.stage);
            _this.m_config.pixi_app.stage.addChild(_this.m_renderer.effects_container);
            _this.m_config.pixi_app.stage.addChild(_this.m_interface_container);
            var highlighter = new TileHighlighter_1.default(_this.m_renderer, _this.m_board_controller);
            _this.m_config.pixi_app.ticker.add(highlighter.update);
            effects_1.default.init(_this.m_renderer);
        };
        this.startGame = function () {
            _this.m_board_controller.executeActionStack().then(_this.startTurn);
        };
        this.startTurn = function () {
            if (_this.checkVictory()) {
                _this.emit("END");
                return;
            }
            var id = _this.m_unit_queue.getNextQueued();
            var unit = _this.m_board_controller.getUnit(id);
            if (!unit) {
                console.log('no units');
                return;
            }
            new EnemyTurn_1.EnemyTurn(id, _this.m_board_controller, _this.onTurnComplete);
        };
        this.checkVictory = function () {
            var units = _this.m_board_controller.getUnits();
            var remaining_teams = [];
            units.forEach(function (unit) {
                if (unit.data.faction && remaining_teams.indexOf(unit.data.faction) === -1) {
                    remaining_teams.push(unit.data.faction);
                }
            });
            if (remaining_teams.length < 2) {
                return true;
            }
            return false;
        };
        this.on = function (event_name, cb) {
            _this.m_event_manager.add(event_name, cb);
        };
        this.off = function (event_name, cb) {
            _this.m_event_manager.remove(event_name, cb);
        };
        this.emit = function (event_name) {
            _this.m_event_manager.emit(event_name, _this);
        };
        this.onTurnComplete = function () {
            _this.startTurn();
        };
        this.m_board_controller = new BoardController_1.BoardController();
        this.m_unit_queue = new UnitQueue_1.UnitQueue();
        this.m_renderer = render_1.CreateRenderer(this.m_config);
        this.m_animator = new BoardAnimator_1.BoardAnimator(this.m_renderer, this.m_board_controller);
    }
    EncounterController.prototype.addInterfaceElement = function (element) {
        this.m_interface_container.addChild(element);
    };
    return EncounterController;
}());
exports.EncounterController = EncounterController;
