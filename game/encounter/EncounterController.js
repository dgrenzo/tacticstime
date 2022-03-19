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
var PIXI = require("pixi.js");
var UnitQueue_1 = require("../play/UnitQueue");
var Loader_1 = require("../board/Loader");
var render_1 = require("../../engine/render/render");
var EffectsManager_1 = require("../effects/EffectsManager");
var EnemyTurn_1 = require("../play/EnemyTurn");
var BoardAnimator_1 = require("../animation/BoardAnimator");
var HealthBar_1 = require("../play/interface/HealthBar");
var GameBoard_1 = require("../board/GameBoard");
var TypedEventEmitter_1 = require("../../engine/listener/TypedEventEmitter");
var EncounterState;
(function (EncounterState) {
    EncounterState[EncounterState["INIT"] = 0] = "INIT";
    EncounterState[EncounterState["PLANNING"] = 1] = "PLANNING";
    EncounterState[EncounterState["BATTLE"] = 2] = "BATTLE";
    EncounterState[EncounterState["RESULT"] = 3] = "RESULT";
    EncounterState[EncounterState["CLEANUP"] = 4] = "CLEANUP";
})(EncounterState = exports.EncounterState || (exports.EncounterState = {}));
;
var EncounterController = (function () {
    function EncounterController(m_config) {
        var _this = this;
        this.m_config = m_config;
        this.m_events = new TypedEventEmitter_1.TypedEventEmitter();
        this.m_interface_container = new PIXI.Container();
        this.loadMap = function (path) {
            return Loader_1.LoadBoard(path).then(function (board_data) {
                _this.m_board.init(board_data);
                _this.setupListeners();
                _this.m_renderer.initializeScene(_this.m_board);
                _this.onSetupComplete();
                return;
            });
        };
        this.loadGameRules = function (path) {
            return Promise.resolve();
        };
        this.addUnit = function (unit) {
            var create_action = {
                type: "CREATE_UNIT",
                data: {
                    unit: unit
                }
            };
            _this.m_board.scene = GameBoard_1.GameBoard.AddActions(_this.m_board.scene, create_action);
        };
        this.addUnits = function (units) {
            units.forEach(_this.addUnit);
        };
        this.setupListeners = function () {
            var events = _this.m_board.events;
            events.on("CREATE_UNIT", function (result) {
                var data = result.action.data;
                _this.m_unit_queue.addUnit(data.unit);
            });
            events.on("UNIT_KILLED", function (result) {
                var data = result.action.data;
                _this.m_unit_queue.removeUnit(data.entity_id);
            });
            events.on("UNIT_CREATED", function (result) {
                var data = result.action.data;
                var health_bar = new HealthBar_1.HealthBar(data.unit.id, _this.m_animator, _this.m_renderer);
                _this.m_renderer.effects_container.addChild(health_bar.sprite);
            });
        };
        this.onSetupComplete = function () {
            _this.m_container = new PIXI.Container();
            _this.m_container.position.set(-100, -100);
            _this.m_container.addChild(_this.m_renderer.stage);
            _this.m_container.addChild(_this.m_renderer.effects_container);
            _this.m_container.addChild(_this.m_interface_container);
            _this.m_config.pixi_app.stage.addChild(_this.m_container);
            EffectsManager_1.default.init(_this.m_renderer);
        };
        this.startGame = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.events.emit("START", this);
                        return [4, this.executeTurn()];
                    case 1:
                        _a.sent();
                        return [4, this.startTurn()];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        }); };
        this.startTurn = function () { return __awaiter(_this, void 0, void 0, function () {
            var id, scene, unit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.checkVictory()) {
                            this.events.emit("END", this);
                            return [2];
                        }
                        id = this.m_unit_queue.getNextQueued();
                        scene = this.m_board.scene;
                        unit = GameBoard_1.GameBoard.GetUnit(scene, id);
                        if (!unit) {
                            console.log('no units');
                            return [2];
                        }
                        return [4, EnemyTurn_1.EnemyTurn.FindBestMove(scene, unit.id).then(function (scene) { return scene; })];
                    case 1:
                        scene = _a.sent();
                        return [4, this.executeTurn(scene)];
                    case 2:
                        _a.sent();
                        this.onTurnComplete();
                        return [2];
                }
            });
        }); };
        this.checkVictory = function () {
            var units = GameBoard_1.GameBoard.GetUnits(_this.m_board.scene);
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
        this.destroy = function () {
            _this.m_config.pixi_app.stage.removeChild(_this.m_container);
            _this.m_renderer.reset();
        };
        this.onTurnComplete = function () {
            _this.startTurn();
        };
        this.m_board = new GameBoard_1.GameBoard();
        this.m_renderer = render_1.CreateRenderer(this.m_config);
        this.m_animator = new BoardAnimator_1.BoardAnimator(this.m_renderer, this.m_board);
        this.m_unit_queue = new UnitQueue_1.UnitQueue();
    }
    EncounterController.prototype.executeTurn = function (scene) {
        if (scene === void 0) { scene = this.m_board.scene; }
        return __awaiter(this, void 0, void 0, function () {
            var events;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        events = this.m_board.events;
                        scene = GameBoard_1.GameBoard.ExecuteActionStack(scene, events);
                        this.m_board.scene = scene;
                        if (!this.m_animator.hasQueuedAnimations()) {
                            console.log('no animations');
                            return [2];
                        }
                        return [4, this.m_animator.start()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    EncounterController.prototype.addInterfaceElement = function (element) {
        this.m_interface_container.addChild(element);
    };
    Object.defineProperty(EncounterController.prototype, "events", {
        get: function () {
            return this.m_events;
        },
        enumerable: true,
        configurable: true
    });
    return EncounterController;
}());
exports.EncounterController = EncounterController;
