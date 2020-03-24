"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var GameBoard_1 = require("./board/GameBoard");
var render_1 = require("../engine/render/render");
var FSM_1 = require("../engine/FSM");
var event_1 = require("../engine/listener/event");
var TileHighlighter_1 = require("./extras/TileHighlighter");
var Loader_1 = require("./board/Loader");
var PlayerTurn_1 = require("./play/PlayerTurn");
var ActionStack_1 = require("./play/action/ActionStack");
var pathfinding_1 = require("./pathfinding");
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
            _this.m_config.pixi_app.stage.addChild(_this.m_interface_container);
            var highligher = new TileHighlighter_1.default(_this.m_renderer, _this.m_board);
            _this.m_config.pixi_app.ticker.add(highligher.update);
            _this.m_config.pixi_app.ticker.add(function () {
                _this.m_renderer.renderScene(_this.m_board);
            });
            var player = new PlayerTurn_1.PlayerTurn(_this);
            _this.m_renderer.on("POINTER_DOWN", _this.tileClicked);
            _this.on("SET_PLUGIN", function (data) {
                _this.m_renderer.getRenderable(data.id).setPlugin(data.plugin);
            });
        };
        this.sendAction = function (action) {
            _this.m_action_stack.push(action);
        };
        this.executeActionStack = function () {
            return _this.m_action_stack.execute().then(function () {
                var player = new PlayerTurn_1.PlayerTurn(_this);
            });
            ;
        };
        this.getMoveOptions = function (unit) {
            return pathfinding_1.GetMoveOptions(unit, _this.m_board);
        };
        this.getTile = function (pos) {
            return _this.m_board.getTile(pos);
        };
        this.getUnit = function (pos) {
            return _this.m_board.getUnit(pos);
        };
        this.removeUnit = function (unit) {
            _this.m_board.removeElement(unit.id);
            _this.m_renderer.removeEntity(unit);
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
            _this.m_event_manager.emit("TILE_CLICKED", _this.m_board.getTile(data));
        };
        this.m_fsm = new FSM_1.FSM();
        m_config.pixi_app.ticker.add(this.m_fsm.update);
        this.m_board = new GameBoard_1.GameBoard();
        this.m_renderer = render_1.CreateRenderer(this.m_config);
        this.m_action_stack = new ActionStack_1.ActionStack(this);
        Loader_1.LoadBoard('assets/data/boards/coast.json').then(function (board_data) {
            _this.m_board.init(board_data);
            _this.m_renderer.initializeScene(_this.m_board);
            _this.onSetupComplete();
        });
    }
    GameController.prototype.addInterfaceElement = function (element) {
        this.m_interface_container.addChild(element);
    };
    return GameController;
}());
exports.GameController = GameController;
