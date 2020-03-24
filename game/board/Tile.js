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
var Entity_1 = require("../../engine/scene/Entity");
var TILE_DEF;
(function (TILE_DEF) {
    TILE_DEF[TILE_DEF["GRASS_EMPTY"] = 10] = "GRASS_EMPTY";
    TILE_DEF[TILE_DEF["GRASS_MTN"] = 11] = "GRASS_MTN";
    TILE_DEF[TILE_DEF["GRASS_TREE"] = 12] = "GRASS_TREE";
    TILE_DEF[TILE_DEF["GRASS_HUT"] = 13] = "GRASS_HUT";
    TILE_DEF[TILE_DEF["DIRT_EMPTY"] = 20] = "DIRT_EMPTY";
    TILE_DEF[TILE_DEF["DIRT_MTN"] = 21] = "DIRT_MTN";
    TILE_DEF[TILE_DEF["DIRT_TREE"] = 22] = "DIRT_TREE";
    TILE_DEF[TILE_DEF["DIRT_HUT"] = 23] = "DIRT_HUT";
    TILE_DEF[TILE_DEF["STONE_EMPTY"] = 30] = "STONE_EMPTY";
    TILE_DEF[TILE_DEF["STONE_MTN"] = 31] = "STONE_MTN";
    TILE_DEF[TILE_DEF["STONE_TREE"] = 32] = "STONE_TREE";
    TILE_DEF[TILE_DEF["STONE_HUT"] = 33] = "STONE_HUT";
    TILE_DEF[TILE_DEF["SAND_EMPTY"] = 40] = "SAND_EMPTY";
    TILE_DEF[TILE_DEF["SAND_MTN"] = 41] = "SAND_MTN";
    TILE_DEF[TILE_DEF["SAND_TREE"] = 42] = "SAND_TREE";
    TILE_DEF[TILE_DEF["SAND_HUT"] = 43] = "SAND_HUT";
    TILE_DEF[TILE_DEF["SNOW_EMPTY"] = 50] = "SNOW_EMPTY";
    TILE_DEF[TILE_DEF["SNOW_MTN"] = 51] = "SNOW_MTN";
    TILE_DEF[TILE_DEF["SNOW_TREE"] = 52] = "SNOW_TREE";
    TILE_DEF[TILE_DEF["SNOW_HUT"] = 53] = "SNOW_HUT";
    TILE_DEF[TILE_DEF["WATER_EMPTY"] = 60] = "WATER_EMPTY";
})(TILE_DEF = exports.TILE_DEF || (exports.TILE_DEF = {}));
var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile(x, y, m_definition) {
        var _this = _super.call(this, x, y) || this;
        _this.m_definition = m_definition;
        _this.depth_offset = -1;
        _this.setTileType = function (def) {
            _this.m_definition = def;
            _this.m_tile_name = exports.GetTileName(def);
        };
        _this.getCurrentAsset = function () {
            return {
                type: "SPRITE",
                name: _this.m_tile_name,
            };
        };
        _this.setTileType(m_definition);
        return _this;
    }
    Object.defineProperty(Tile.prototype, "type", {
        get: function () {
            return this.m_definition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "tile_name", {
        get: function () {
            return this.m_tile_name;
        },
        enumerable: true,
        configurable: true
    });
    return Tile;
}(Entity_1.Entity));
exports.Tile = Tile;
exports.GetTileName = function (def) {
    var base = Math.floor(def / 10);
    var type = def % 10;
    return getBase(base) + '_' + getType(type);
};
var getBase = function (base) {
    return ["blank", "grass", "dirt", "stone", "sand", "snow", "water"][base];
};
var getType = function (type) {
    return ["empty", "mtn", "tree", "hut"][type];
};
