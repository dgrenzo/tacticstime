"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Movement_1 = require("./executors/action/Movement");
var Damage_1 = require("./executors/action/Damage");
var Killed_1 = require("./executors/action/Killed");
var Ability_1 = require("./executors/action/Ability");
var CreateUnit_1 = require("./executors/action/CreateUnit");
var ActionStack = (function () {
    function ActionStack(m_controller) {
        var _this = this;
        this.m_controller = m_controller;
        this.m_stack_root = {
            action: null,
            next: null,
        };
        this.execute = function (elements) {
            return new Promise(function (resolve) {
                var next_action = _this.shift();
                if (!next_action) {
                    return resolve(null);
                }
                else {
                    return resolve(_this.executeEvent(elements, next_action));
                }
            });
        };
        this.executeEvent = function (elements, action) {
            var controller = _this.m_controller;
            _this.m_controller.emit(action.type, action.data);
            switch (action.type) {
                case "MOVE":
                    return Movement_1.ExecuteMove(action, elements, controller);
                case "ABILITY":
                    return Ability_1.ExecuteAbility(action, elements, controller);
                case "DAMAGE":
                    return Damage_1.ExecuteDamage(action, elements, controller);
                case "UNIT_KILLED":
                    return Killed_1.ExecuteKilled(action, elements, controller);
                case "CREATE_UNIT":
                    return CreateUnit_1.ExecuteCreateUnit(action, elements, controller);
                default:
                    return ExecuteDefault(action, elements, controller);
            }
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
function ExecuteDefault(action, elements, controller) {
    return new Promise(function (resolve) {
        controller.getActionCallback(action).then(function () {
            resolve(elements);
        });
    });
}
