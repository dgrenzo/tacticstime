"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var PIXI = require("pixi.js");
var GameBoard_1 = require("./board/GameBoard");
var render_1 = require("../engine/render/render");
var FSM_1 = require("../engine/FSM");
var event_1 = require("../engine/listener/event");
var TileHighlighter_1 = require("./extras/TileHighlighter");
var Tile_1 = require("./board/Tile");
var assets_1 = require("./assets");
var tile_palette_1 = require("./interface/tile_palette");
var GameState;
(function (GameState) {
    GameState[GameState["SETUP"] = 0] = "SETUP";
    GameState[GameState["PLAY"] = 1] = "PLAY";
})(GameState = exports.GameState || (exports.GameState = {}));
var GameController = (function () {
    function GameController(m_config) {
        var _this = this;
        this.m_config = m_config;
        this.m_eventManager = new event_1.EventManager();
        this.loadBoard = function () {
            var default_path = 'assets/data/boards/default.json';
            var board_json = default_path;
            new PIXI.Loader()
                .add(board_json)
                .load(function (loader, resources) {
                var url_data = location.search.split("board=")[1];
                var url_cfg = null;
                if (url_data && url_data.length > -1) {
                    try {
                        var strings = (url_data).match(/.{2}/g);
                        url_cfg = [];
                        _.forEach(strings, function (str) {
                            url_cfg.push(parseInt(str));
                        });
                    }
                    catch (e) {
                    }
                }
                var board_config = url_cfg ? url_cfg : resources[board_json].data;
                var parsed_def = {
                    layout: {
                        width: board_config.shift(),
                        height: board_config.shift(),
                        tiles: board_config
                    },
                    entities: [],
                };
                _this.m_board.init(parsed_def);
                _this.m_renderer.initializeScene(_this.m_board);
                _this.onSetupComplete();
            });
        };
        this.onSetupComplete = function () {
            _this.m_config.pixi_app.stage.addChild(_this.m_renderer.stage);
            var highligher = new TileHighlighter_1.default(_this.m_renderer, _this.m_board);
            _this.m_config.pixi_app.ticker.add(highligher.update);
            _this.m_config.pixi_app.ticker.add(function () {
                _this.m_renderer.renderScene(_this.m_board);
            });
            _this.m_renderer.on("POINTER_DOWN", _this.tileClicked);
            var p = new tile_palette_1.TilePalette();
            var brush = Tile_1.TILE_DEF.GRASS_EMPTY;
            var painting = false;
            p.on("TILE_SELECTED", function (data) {
                brush = data.def;
            });
            var paintTile = function (pos, type) {
                var tile = _this.m_board.getTileAt(pos);
                if (!tile) {
                    return;
                }
                if (tile.type !== type) {
                    tile.setTileType(type);
                    _this.m_renderer.getRenderable(tile.id).setSprite(assets_1.default.getTile(tile.getAssetInfo().name));
                    var cfg = _this.m_board.getConfig();
                    var url = location.origin + location.pathname;
                    history.replaceState({}, "board", url + "?board=" + cfg);
                }
            };
            _this.m_renderer.on("POINTER_DOWN", function (data) {
                painting = true;
                paintTile(data, brush);
            });
            _this.m_renderer.on("POINTER_MOVE", function (data) {
                if (painting) {
                    paintTile(data, brush);
                }
            });
            _this.m_renderer.on("POINTER_UP", function (data) {
                painting = false;
            });
            _this.m_config.pixi_app.stage.addChild(p.container);
        };
        this.getTileAt = function (pos) {
            return _this.m_board.getTileAt(pos);
        };
        this.highlightTile = function (pos, highlight) {
            var tile = _this.getTileAt(pos);
            if (!tile) {
                return;
            }
            _this.m_renderer.getRenderable(tile.id).setFilter({ highlight: highlight });
        };
        this.highlightTiles = function (coords, highlight) {
            _.forEach(coords, function (pos) {
                _this.highlightTile(pos, highlight);
            });
        };
        this.on = function (event_name, cb) {
            _this.m_eventManager.add(event_name, cb);
        };
        this.off = function (event_name, cb) {
            _this.m_eventManager.remove(event_name, cb);
        };
        this.tileClicked = function (data) {
            _this.m_eventManager.emit("TILE_CLICKED", data);
        };
        this.m_fsm = new FSM_1.FSM();
        m_config.pixi_app.ticker.add(this.m_fsm.update);
        this.m_board = new GameBoard_1.ChessBoard();
        this.m_renderer = render_1.CreateRenderer(this.m_config);
        this.loadBoard();
    }
    return GameController;
}());
exports.GameController = GameController;
