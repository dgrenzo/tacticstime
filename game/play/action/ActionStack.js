"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var executors_1 = require("./executors");
var ActionStack = (function () {
    function ActionStack(m_controller) {
        var _this = this;
        this.m_controller = m_controller;
        this.m_stack_root = {
            action: null,
            next: null,
        };
        this.execute = function () {
            return new Promise(function (resolve) {
                var next_action = _this.shift();
                if (!next_action) {
                    resolve();
                }
                else {
                    executors_1.ExecuteGameEvent(next_action, _this.m_controller).then(function () {
                        _this.m_controller.emit(next_action.type, next_action.data);
                        return _this.execute();
                    }).then(resolve);
                }
            });
        };
        this.push = function (actions) {
            actions = _.concat(actions);
            _.forEach(actions, function (action) {
                _this.tail.next = {
                    action: action,
                    next: null,
                };
            });
        };
        this.shift = function () {
            var next = _this.m_stack_root.next;
            if (next) {
                _this.m_stack_root.next = next.next;
                return next.action;
            }
            return null;
        };
    }
    Object.defineProperty(ActionStack.prototype, "tail", {
        get: function () {
            var tail = this.m_stack_root;
            while (tail.next) {
                tail = tail.next;
            }
            return tail;
        },
        enumerable: true,
        configurable: true
    });
    return ActionStack;
}());
exports.ActionStack = ActionStack;
