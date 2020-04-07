"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var render_1 = require("../engine/render/render");
var FSM_1 = require("../engine/FSM");
var SceneRenderer_1 = require("../engine/render/scene/SceneRenderer");
var event_1 = require("../engine/listener/event");
var Loader_1 = require("./board/Loader");
var PlayerTurn_1 = require("./play/PlayerTurn");
var UnitQueue_1 = require("./play/UnitQueue");
var BoardController_1 = require("./board/BoardController");
var EnemyTurn_1 = require("./play/EnemyTurn");
var effects_1 = require("./effects");
var HealthBar_1 = require("./play/interface/HealthBar");
var GameState;
(function (GameState) {
    GameState[GameState["SETUP"] = 0] = "SETUP";
    GameState[GameState["PLAY"] = 1] = "PLAY";
})(GameState = exports.GameState || (exports.GameState = {}));
var GameController = (function () {
    function GameController(m_config) {
        var _this = this;
        this.m_config = m_config;
        this.m_event_manager = new event_1.EventManager();
        this.m_interface_container = new PIXI.Container();
        this.onSetupComplete = function () {
            _this.m_config.pixi_app.stage.addChild(_this.m_renderer.stage);
            _this.m_config.pixi_app.stage.addChild(_this.m_renderer.effects_container);
            _this.m_config.pixi_app.stage.addChild(_this.m_interface_container);
            effects_1.default.init(_this.m_renderer);
            _this.on("SET_PLUGIN", function (data) {
                _this.m_renderer.getRenderable(data.id).setPlugin(data.plugin);
            });
            _this.m_renderer.on("POINTER_DOWN", _this.tileClicked);
            _this.m_board_controller.executeActionStack().then(_this.startGame);
        };
        this.startGame = function () {
            new PlayerTurn_1.PlayerTurn(_this.m_unit_queue.getNextQueued(), _this, _this.m_board_controller, _this.onTurnComplete);
        };
        this.onTurnComplete = function () {
            var next_unit = _this.m_unit_queue.getNextQueued();
            if (!next_unit) {
                console.log('done');
                return;
            }
            if (!_this.m_board_controller.getUnit(next_unit)) {
                _this.onTurnComplete();
                return;
            }
            var player = new EnemyTurn_1.EnemyTurn(next_unit, _this, _this.m_board_controller, _this.onTurnComplete);
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
        this.tileClicked = function (data) {
            _this.m_event_manager.emit("TILE_CLICKED", _this.m_board_controller.getTile(data));
        };
        this.m_fsm = new FSM_1.FSM();
        m_config.pixi_app.ticker.add(this.m_fsm.update);
        this.m_board_controller = new BoardController_1.BoardController();
        this.m_unit_queue = new UnitQueue_1.UnitQueue();
        this.m_renderer = render_1.CreateRenderer(this.m_config);
        Loader_1.LoadMission('assets/data/missions/001.json').then(function (mission_data) {
            _this.m_board_controller.initBoard(mission_data);
            _this.m_board_controller.on("CREATE_UNIT", function (data) {
                _this.m_unit_queue.addUnit(data.unit);
                var renderable = _this.m_renderer.addEntity(data.unit);
                renderable.render(SceneRenderer_1.getAsset(data.unit));
            });
            _this.m_board_controller.on("UNIT_CREATED", function (data) {
                var health_bar = new HealthBar_1.HealthBar(data.unit.id, _this.m_board_controller, _this.m_renderer);
                _this.m_renderer.effects_container.addChild(health_bar.sprite);
            });
            _this.m_board_controller.sendToRenderer(_this.m_renderer);
            _this.onSetupComplete();
        });
    }
    GameController.prototype.addInterfaceElement = function (element) {
        this.m_interface_container.addChild(element);
    };
    return GameController;
}());
exports.GameController = GameController;
