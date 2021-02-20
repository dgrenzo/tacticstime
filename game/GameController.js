"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = exports.GameState = void 0;
var PIXI = require("pixi.js");
var GameBoard_1 = require("./board/GameBoard");
var UnitLoader_1 = require("./assets/UnitLoader");
var EncounterController_1 = require("./encounter/EncounterController");
var tavern_1 = require("./tavern");
var party_1 = require("./party");
var GoldDisplay_1 = require("./play/interface/GoldDisplay");
var ReplayMenu_1 = require("./interface/menus/ReplayMenu");
var GameState;
(function (GameState) {
    GameState[GameState["SETUP"] = 0] = "SETUP";
    GameState[GameState["BATTLE"] = 1] = "BATTLE";
    GameState[GameState["POST"] = 2] = "POST";
})(GameState = exports.GameState || (exports.GameState = {}));
var GameController = (function () {
    function GameController(m_config) {
        var _this = this;
        this.m_config = m_config;
        this.m_events = new PIXI.utils.EventEmitter();
        this.update = function (deltaTime) {
            _this.m_events.emit("UPDATE", { deltaTime: deltaTime });
        };
        this.onResize = function () {
            _this.m_events.emit("RESIZE", {
                width: _this.m_config.pixi_app.renderer.width,
                height: _this.m_config.pixi_app.renderer.height,
            });
        };
        this.startNextTavern = function () {
            var tavern = new tavern_1.Tavern(_this.m_config.pixi_app.stage, _this.m_events);
            tavern.setPlayer(_this.m_player_party);
            tavern.positionContainer({
                width: _this.m_config.pixi_app.renderer.width,
                height: _this.m_config.pixi_app.renderer.height,
            });
        };
        this.startNextEncounter = function () {
            var encounter = new EncounterController_1.EncounterController(_this.m_config);
            encounter.loadMap('assets/data/boards/coast.json').then(function () {
                var units = _this.m_player_party.units;
                units.forEach(function (unit, index) {
                    unit.pos.x = 5 + index;
                    unit.pos.y = 12;
                });
                var types = ["lizard", "mooseman", "rhino"];
                var amount = Math.round(Math.random() * 5) + 3;
                for (var i = 0; i < amount; i++) {
                    var enemy = GameBoard_1.CreateUnit(UnitLoader_1.UnitLoader.GetUnitDefinition(types[Math.floor(Math.random() * 3)]), "ENEMY");
                    enemy.pos.x = 7 + i;
                    enemy.pos.y = 7;
                    units = units.push(enemy);
                }
                encounter.addUnits(units);
                encounter.startGame();
            });
            encounter.on('END', function (encounter) {
                _this.m_player_party.addGold(6);
                var replay;
                var onEnd = function () {
                    _this.m_config.pixi_app.stage.removeChild(replay.container);
                    encounter.destroy();
                    _this.startNextTavern();
                };
                replay = new ReplayMenu_1.ReplayMenu(onEnd);
                _this.m_config.pixi_app.stage.addChild(replay.container);
            });
        };
        m_config.pixi_app.ticker.add(this.update);
        this.m_config.pixi_app.renderer.on('resize', this.onResize);
        new GoldDisplay_1.GoldDisplay(this.m_config.pixi_app.stage, this.m_events);
        UnitLoader_1.UnitLoader.LoadUnitDefinitions().then(function () {
            _this.m_player_party = new party_1.PlayerParty(_this.m_events);
            _this.startNextTavern();
        });
        this.m_events.on("LEAVE_TAVERN", function () {
            _this.startNextEncounter();
        });
    }
    return GameController;
}());
exports.GameController = GameController;
