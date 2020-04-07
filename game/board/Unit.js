"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isUnit(entity) {
    return entity.entity_type === "UNIT";
}
exports.isUnit = isUnit;
function asset() {
    return {
        type: "ANIMATED_SPRITE",
        name: this.m_unit_type + '_idle',
    };
}
