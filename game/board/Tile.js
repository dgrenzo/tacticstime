"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTileName = exports.isTile = exports.TILE_DEF = void 0;
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
function isTile(entity) {
    return entity.entity_type === "TILE";
}
exports.isTile = isTile;
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
