"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var id_ticker = 0;
var Entity = (function () {
    function Entity(x, y) {
        this.x = x;
        this.y = y;
        this.id = id_ticker++;
        this.depth_offset = 0;
    }
    Entity.prototype.GetInfo = function () {
        return {
            asset: this.getAssetInfo(),
            depth: this.depth_offset,
            id: this.id
        };
    };
    Entity.prototype.getAssetInfo = function () {
        return {
            name: 'grass_empty.png'
        };
    };
    return Entity;
}());
exports.Entity = Entity;
