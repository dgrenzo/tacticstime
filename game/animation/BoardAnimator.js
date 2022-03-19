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
var linkedlist_1 = require("../../engine/list/linkedlist");
var TypedEventEmitter_1 = require("../../engine/listener/TypedEventEmitter");
var SceneRenderer_1 = require("../../engine/render/scene/SceneRenderer");
var GameBoard_1 = require("../board/GameBoard");
var EffectsManager_1 = require("../effects/EffectsManager");
var ANIMATABLE_ACTIONS = [
    "ABILITY",
    "DAMAGE_DEALT",
    "CREATE_UNIT",
    "MOVE",
    "UNIT_KILLED"
];
var BoardAnimator = (function () {
    function BoardAnimator(m_renderer, m_board) {
        var _this = this;
        this.m_renderer = m_renderer;
        this.m_board = m_board;
        this.m_events = new TypedEventEmitter_1.TypedEventEmitter();
        this.m_render_elements = new Map();
        this.m_action_list = new linkedlist_1.LinkedList();
        this.m_busy_promise = null;
        this.m_busy_promise_resolver = null;
        this.setRenderElement = function (id, renderable) {
            _this.m_render_elements.set(id, renderable);
        };
        this.getRenderElement = function (entity_id) {
            return _this.m_render_elements.get(entity_id);
        };
        this.onAnimatableAction = function (action_result) {
            _this.m_action_list.push(action_result);
        };
        this.start = function () {
            if (!_this.m_busy_promise) {
                _this.m_busy_promise = new Promise(function (resolve) {
                    _this.m_busy_promise_resolver = resolve;
                });
                _this.execute();
            }
            return _this.m_busy_promise;
        };
        this.execute = function () { return __awaiter(_this, void 0, void 0, function () {
            var next_action;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        next_action = this.m_action_list.shift();
                        _a.label = 1;
                    case 1:
                        if (!next_action) return [3, 3];
                        this.events.emit(next_action.action.type, next_action);
                        return [4, this.animateGameAction(next_action.action, next_action.scene)];
                    case 2:
                        _a.sent();
                        next_action = this.m_action_list.shift();
                        return [3, 1];
                    case 3:
                        this.m_busy_promise_resolver();
                        this.m_busy_promise = null;
                        return [2];
                }
            });
        }); };
        this.createEffect = function (ability, cb) {
            return EffectsManager_1.default.RenderEffect(ability, cb);
        };
        ANIMATABLE_ACTIONS.forEach(function (event) {
            _this.m_board.events.on(event, _this.onAnimatableAction);
        });
    }
    Object.defineProperty(BoardAnimator.prototype, "events", {
        get: function () {
            return this.m_events;
        },
        enumerable: true,
        configurable: true
    });
    BoardAnimator.prototype.hasQueuedAnimations = function () {
        return !this.m_action_list.isEmpty();
    };
    BoardAnimator.prototype.animateGameAction = function (action, scene) {
        return __awaiter(this, void 0, void 0, function () {
            var elements, data, renderable, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        elements = GameBoard_1.GameBoard.GetElements(scene);
                        data = action.data;
                        _a = action.type;
                        switch (_a) {
                            case "CREATE_UNIT": return [3, 1];
                            case "UNIT_KILLED": return [3, 2];
                            case "MOVE": return [3, 3];
                            case "ABILITY": return [3, 5];
                        }
                        return [3, 6];
                    case 1:
                        renderable = this.m_renderer.addEntity(data.unit);
                        renderable.renderAsset(SceneRenderer_1.getAsset(data.unit));
                        this.setRenderElement(data.unit.id, renderable);
                        return [3, 7];
                    case 2:
                        renderable = this.m_render_elements.get(data.entity_id);
                        this.m_renderer.removeEntity(renderable.id);
                        return [3, 7];
                    case 3: return [4, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 4:
                        _b.sent();
                        renderable = this.getRenderElement(data.entity_id);
                        this.m_renderer.positionElement(renderable, data.move.to);
                        return [3, 7];
                    case 5: return [2, this.animateAbility(action, scene)];
                    case 6: return [2, new Promise(function (resolve) {
                            var _a;
                            var effect = _this.createEffect(action, resolve);
                            if (effect) {
                                var action_target = (_a = action.data.target) !== null && _a !== void 0 ? _a : elements.get(action.data.entity_id);
                                effect.setPosition(action_target.pos);
                            }
                            resolve();
                        })];
                    case 7: return [2];
                }
            });
        });
    };
    BoardAnimator.prototype.animateAbility = function (action, scene) {
        var _this = this;
        if (action.data.ability.name === 'Wait' || !GameBoard_1.GameBoard.GetUnitAtPosition(scene, action.data.target.pos)) {
            return Promise.resolve();
        }
        if (action.data.ability.name === "Shoot") {
            return this.unitBumpAnimation(action.data)
                .then(function () {
                return new Promise(function (resolve) {
                    _this.createEffect(action, resolve);
                });
            });
        }
        return this.unitBumpAnimation(action.data);
    };
    BoardAnimator.prototype.unitBumpAnimation = function (data) {
        var _this = this;
        return new Promise(function (resolve) {
            var renderable = _this.getRenderElement(data.source.id);
            var sprite = renderable.sprite;
            var dir = {
                x: data.target.pos.x - data.source.pos.x,
                y: data.target.pos.y - data.source.pos.y,
            };
            var anim_dir = _this.m_renderer.getProjection(dir);
            anim_dir.x = Math.min(Math.max(-1, anim_dir.x), 1);
            anim_dir.y = Math.min(Math.max(-1, anim_dir.y), 1);
            sprite.position.x = -anim_dir.x;
            sprite.position.y = -anim_dir.y;
            setTimeout(function () {
                sprite.position.x = anim_dir.x * 3;
                sprite.position.y = anim_dir.y * 3;
                setTimeout(function () {
                    sprite.position.set(0, 0);
                }, 150);
                resolve();
            }, 250);
        });
    };
    return BoardAnimator;
}());
exports.BoardAnimator = BoardAnimator;
