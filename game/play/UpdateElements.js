"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateElements = void 0;
var UpdateElements = (function () {
    function UpdateElements() {
    }
    UpdateElements.AddEntity = function (elements, entity_id, entity) {
        return elements.set(entity_id, entity);
    };
    UpdateElements.RemoveEntity = function (elements, entity_id) {
        return elements.remove(entity_id);
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
