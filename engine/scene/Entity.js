"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_1 = require("../listener/event");
var id_ticker = 0;
var Entity = (function () {
    function Entity(x, y) {
        this.x = x;
        this.y = y;
        this.m_id = id_ticker++;
        this.depth_offset = 0;
        this.m_event_manager = new event_1.EventManager();
    }
    Object.defineProperty(Entity.prototype, "depthOffset", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "id", {
        get: function () {
            return this.m_id;
        },
        enumerable: true,
        configurable: true
    });
    return Entity;
}());
exports.Entity = Entity;
