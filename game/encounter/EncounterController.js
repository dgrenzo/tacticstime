"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var PIXI = require("pixi.js");
var BoardController_1 = require("../board/BoardController");
var SceneRenderer_1 = require("../../engine/render/scene/SceneRenderer");
var UnitQueue_1 = require("../play/UnitQueue");
var event_1 = require("../../engine/listener/event");
var Loader_1 = require("../board/Loader");
var render_1 = require("../../engine/render/render");
var HealthBar_1 = require("../play/interface/HealthBar");
var TileHighlighter_1 = require("../extras/TileHighlighter");
var effects_1 = require("../effects");
var EnemyTurn_1 = require("../play/EnemyTurn");
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
                _this.onSetupComplete();
                return;
            });
        };
        this.addUnits = function (units) {
            _.forEach(units, _this.m_board_controller.addUnit);
        };
        this.setupListeners = function () {
            _this.m_board_controller.on("CREATE_UNIT", function (data) {
                _this.m_unit_queue.addUnit(data.unit);
                var renderable = _this.m_renderer.addEntity(data.unit);
                renderable.render(SceneRenderer_1.getAsset(data.unit));
            });
            _this.m_board_controller.on("UNIT_KILLED", function (data) {
                _this.m_unit_queue.removeUnit(data.entity_id);
            });
            _this.m_board_controller.on("UNIT_CREATED", function (data) {
                var health_bar = new HealthBar_1.HealthBar(data.unit.id, _this.m_board_controller, _this.m_renderer);
                _this.m_renderer.effects_container.addChild(health_bar.sprite);
            });
            _this.on("SET_PLUGIN", function (data) {
                _this.m_renderer.getRenderable(data.id).setPlugin(data.plugin);
            });
        };
        this.loadNextMisison = function () {
            Loader_1.LoadMission('assets/data/missions/001.json').then(function (mission_data) {
                _this.m_board_controller.sendToRenderer(_this.m_renderer);
                _this.onSetupComplete();
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
            var id = _this.m_unit_queue.getNextQueued();
            var unit = _this.m_board_controller.getUnit(id);
            if (!unit) {
                console.log('no units');
                return;
            }
            new EnemyTurn_1.EnemyTurn(id, _this.m_board_controller, _this.onTurnComplete);
        };
        this.on = function (event_name, cb) {
            _this.m_event_manager.add(event_name, cb);
        };
        this.off = function (event_name, cb) {
            _this.m_event_manager.remove(event_name, cb);
        };
        this.emit = function (event_name, data) {
            _this.m_event_manager.emit(event_name, data);
        };
        this.onTurnComplete = function () {
            _this.startTurn();
        };
        this.m_board_controller = new BoardController_1.BoardController();
        this.m_unit_queue = new UnitQueue_1.UnitQueue();
        this.m_renderer = render_1.CreateRenderer(this.m_config);
    }
    EncounterController.prototype.addInterfaceElement = function (element) {
        this.m_interface_container.addChild(element);
    };
    return EncounterController;
}());
exports.EncounterController = EncounterController;
