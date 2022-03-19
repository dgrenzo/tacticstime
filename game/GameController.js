"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var GameBoard_1 = require("./board/GameBoard");
var UnitLoader_1 = require("./assets/UnitLoader");
var EncounterController_1 = require("./encounter/EncounterController");
var Tavern_1 = require("./tavern/Tavern");
var party_1 = require("./party");
var GoldDisplay_1 = require("./play/interface/GoldDisplay");
var ReplayMenu_1 = require("./interface/menus/ReplayMenu");
var AuraLoader_1 = require("./assets/AuraLoader");
var TypedEventEmitter_1 = require("../engine/listener/TypedEventEmitter");
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
        this.m_events = new TypedEventEmitter_1.TypedEventEmitter();
        this.update = function (deltaTime) {
            _this.m_events.emit("UPDATE", deltaTime);
        };
        this.onResize = function () {
            _this.m_events.emit("RESIZE", {
                width: _this.m_config.pixi_app.renderer.width,
                height: _this.m_config.pixi_app.renderer.height,
            });
        };
        this.startNextTavern = function () {
            _this.m_encounter = new EncounterController_1.EncounterController(_this.m_config);
            _this.m_encounter.loadMap('assets/data/boards/coast.json').then(function () {
                var tavern = new Tavern_1.Tavern(_this.m_config.pixi_app.stage, _this.m_events);
                tavern.setPlayer(_this.m_player_party);
                tavern.positionContainer({
                    width: _this.m_config.pixi_app.renderer.width,
                    height: _this.m_config.pixi_app.renderer.height,
                });
                _this.m_encounter.addUnits(_this.m_player_party.units);
                _this.m_encounter.executeTurn();
            });
        };
        this.startNextEncounter = function () {
            var types = ["lizard", "mooseman", "rhino"];
            var amount = Math.round(Math.random() * 5) + 3;
            for (var i = 0; i < amount; i++) {
                var enemy = GameBoard_1.CreateUnit(UnitLoader_1.UnitLoader.GetUnitDefinition(types[Math.floor(Math.random() * 3)]), "ENEMY");
                enemy.pos.x = 7 + i;
                enemy.pos.y = 7;
                _this.m_encounter.addUnit(enemy);
            }
            _this.m_encounter.startGame();
            _this.m_encounter.events.on('END', function (encounter) {
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
        this.init();
    }
    GameController.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, AuraLoader_1.AuraLoader.LoadAuraDefinitions()];
                    case 1:
                        _a.sent();
                        return [4, UnitLoader_1.UnitLoader.LoadUnitDefinitions()];
                    case 2:
                        _a.sent();
                        new GoldDisplay_1.GoldDisplay(this.m_config.pixi_app.stage, this.m_events);
                        this.m_events.on('LEAVE_TAVERN', function () {
                            _this.startNextEncounter();
                        });
                        this.m_events.on('UNIT_HIRED', function (data) {
                            var unit = data.unit;
                            _this.m_encounter.addUnit(unit);
                            _this.m_encounter.executeTurn();
                        });
                        this.m_player_party = new party_1.PlayerParty(this.m_events);
                        this.startNextTavern();
                        return [2];
                }
            });
        });
    };
    return GameController;
}());
exports.GameController = GameController;
