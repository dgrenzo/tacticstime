"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UpdateElements = (function () {
    function UpdateElements() {
    }
    UpdateElements.SetUnitFlag = function (elements, entity_id, flag, value) {
        return elements.setIn([entity_id, 'status', 'flags', flag], value);
    };
    UpdateElements.SetHP = function (elements, entity_id, hp) {
        return elements.setIn([entity_id, 'status', 'hp'], hp);
    };
    UpdateElements.SetMP = function (elements, entity_id, mana) {
        return elements.setIn([entity_id, 'status', 'mana'], mana);
    };
    UpdateElements.SetPosition = function (elements, entity_id, position) {
        return elements.setIn([entity_id, 'pos'], position);
    };
    return UpdateElements;
}());
exports.UpdateElements = UpdateElements;
