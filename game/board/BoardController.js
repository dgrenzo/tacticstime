"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIBoardController = exports.BoardController = void 0;
var GameBoard_1 = require("./GameBoard");
var ActionStack_1 = require("../play/action/ActionStack");
var pathfinding_1 = require("../pathfinding");
var event_1 = require("../../engine/listener/event");
var BoardController = (function () {
    function BoardController() {
        var _this = this;
        this.m_event_manager = new event_1.EventManager();
        this.createClone = function () {
            var ctrl = new AIBoardController(_this.m_board.elements);
            return ctrl;
        };
        this.initBoard = function (data) {
            _this.m_board = new GameBoard_1.GameBoard();
            _this.m_board.init(data);
        };
        this.sendToRenderer = function (renderer) {
            renderer.initializeScene(_this.m_board);
        };
        this.setAnimator = function (animator) {
            _this.m_animator = animator;
        };
        this.sendAction = function (action) {
            _this.m_action_stack.push(action);
        };
        this.executeActionStack = function () {
            return _this.m_action_stack.execute(_this.m_board.elements).then(function (updated_board) {
                if (!updated_board) {
                    return null;
                }
                else {
                    _this.m_board.elements = updated_board;
                    return _this.executeActionStack();
                }
            });
        };
        this.addUnit = function (unit) {
            var create_action = {
                type: "CREATE_UNIT",
                data: {
                    unit: unit
                }
            };
            _this.sendAction(create_action);
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
        this.getMoveOptions = function (unit) {
            return pathfinding_1.GetMoveOptions(unit, _this.m_board);
        };
        this.removeEntity = function (id) {
            _this.m_board.removeElement(id);
        };
        this.getTile = function (pos) {
            return _this.m_board.getTileAtPos(pos);
        };
        this.getUnit = function (id) {
            if (id === undefined) {
                return null;
            }
            return _this.m_board.getUnit(id);
        };
        this.getUnits = function () {
            return _this.m_board.getUnits();
        };
        this.getUnitAtPosition = function (pos) {
            return _this.m_board.getUnitAtPosition(pos);
        };
        this.getTilesInRange = function (pos, range) {
            if (!range) {
                range = {
                    max: 0,
                    min: 0,
                };
            }
            return _this.m_board.getTilesInRange(pos, range);
        };
        this.getElementsAt = function (pos) {
            return _this.m_board.getElementsAt(pos);
        };
        this.m_action_stack = new ActionStack_1.ActionStack(this);
    }
    BoardController.prototype.animateGameAction = function (action) {
        return this.m_animator.animateGameAction(action, this.m_board);
    };
    return BoardController;
}());
exports.BoardController = BoardController;
var AIBoardController = (function (_super) {
    __extends(AIBoardController, _super);
    function AIBoardController(elements) {
        var _this = _super.call(this) || this;
        _this.m_board = new GameBoard_1.GameBoard();
        _this.m_board.elements = elements;
        return _this;
    }
    AIBoardController.prototype.animateGameAction = function (action) {
        return Promise.resolve();
    };
    Object.defineProperty(AIBoardController.prototype, "board", {
        get: function () {
            return this.m_board;
        },
        enumerable: false,
        configurable: true
    });
    return AIBoardController;
}(BoardController));
exports.AIBoardController = AIBoardController;
