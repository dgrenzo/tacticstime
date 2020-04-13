"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameBoard_1 = require("./board/GameBoard");
var FSM_1 = require("../engine/FSM");
var UnitLoader_1 = require("./assets/UnitLoader");
var EncounterController_1 = require("./encounter/EncounterController");
var tavern_1 = require("./tavern");
var party_1 = require("./party");
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
        this.startNextEncounter = function () {
            var encounter = new EncounterController_1.EncounterController(_this.m_config);
            encounter.loadMap('assets/data/boards/coast.json').then(function () {
                var units = [];
                _this.m_player_party.units.forEach(function (recruit, index) {
                    var unit_def = UnitLoader_1.UnitLoader.GetUnitDefinition(recruit.type);
                    var unit = GameBoard_1.CreateUnit({
                        unit: unit_def,
                        pos: {
                            x: 4 + index,
                            y: 12
                        }
                    }, "PLAYER");
                    units.push(unit);
                });
                encounter.addUnits(units);
                units = [];
                var types = ["lizard", "mooseman", "rhino"];
                var amount = Math.round(Math.random() * 5) + 3;
                for (var i = 0; i < amount; i++) {
                    units.push(GameBoard_1.CreateUnit({
                        unit: UnitLoader_1.UnitLoader.GetUnitDefinition(types[Math.floor(Math.random() * 3)]),
                        pos: {
                            x: 7 + i,
                            y: 7,
                        }
                    }, "ENEMY"));
                }
                encounter.addUnits(units);
                encounter.startGame();
            });
        };
        this.m_fsm = new FSM_1.FSM();
        m_config.pixi_app.ticker.add(this.m_fsm.update);
        UnitLoader_1.UnitLoader.LoadUnitDefinitions().then(function () {
            var tavern = new tavern_1.Tavern();
            _this.m_player_party = new party_1.PlayerParty();
            tavern.setPlayer(_this.m_player_party);
            _this.m_config.pixi_app.stage.addChild(tavern.sprite);
            tavern.on("LEAVE_TAVERN", function () {
                _this.m_config.pixi_app.stage.removeChild(tavern.sprite);
                _this.startNextEncounter();
            });
        });
    }
    return GameController;
}());
exports.GameController = GameController;
