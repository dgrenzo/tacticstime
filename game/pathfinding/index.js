"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Tile_1 = require("../board/Tile");
var PathList = (function () {
    function PathList() {
        this.m_list = [];
    }
    PathList.prototype.isEmpty = function () {
        return this.m_list.length === 0;
    };
    PathList.prototype.getLowestCost = function () {
        var path = null;
        _.forEach(this.m_list, function (element) {
            if (!path || element.cost < path.cost) {
                path = element;
            }
        });
        _.remove(this.m_list, (function (element) { return element === path; }));
        return path;
    };
    PathList.prototype.push = function (path) {
        if (path.tile === null) {
            return;
        }
        if (this.exists(path)) {
            this.updateCost(path);
        }
        else {
            this.m_list.push(path);
        }
    };
    PathList.prototype.exists = function (path) {
        var exists = false;
        _.forEach(this.m_list, function (element) {
            if (path.tile === element.tile) {
                exists = true;
                return false;
            }
            return true;
        });
        return exists;
    };
    PathList.prototype.updateCost = function (path) {
        _.forEach(this.m_list, function (element) {
            if (path.tile === element.tile) {
                if (path.cost < element.cost) {
                    element.cost = path.cost;
                    element.last = path.last;
                }
                return false;
            }
            return true;
        });
    };
    PathList.prototype.shift = function () {
        return this.m_list.shift();
    };
    PathList.prototype.getPaths = function () {
        return this.m_list;
    };
    PathList.prototype.getTiles = function () {
        var tiles = [];
        _.forEach(this.m_list, function (path) {
            tiles.push(path.tile);
        });
        return tiles;
    };
    return PathList;
}());
function GetMoveOptions(unit, board) {
    if (!unit) {
        return [];
    }
    var max_cost = unit.getMove();
    var closed_list = new PathList();
    var open_list = new PathList();
    var current_tile = board.getTile(unit);
    open_list.push({ tile: current_tile, cost: 0, last: null });
    var _loop_1 = function () {
        var next = open_list.getLowestCost();
        closed_list.push(next);
        var adjacent = GetAdjacent(next.tile, board);
        _.forEach(adjacent, function (tile) {
            var path = ToPathTile(tile, next.cost, next);
            if (closed_list.exists(path) || path.cost > max_cost || !CanPassTile(unit, tile, board)) {
                return;
            }
            open_list.push(path);
            return;
        });
    };
    while (!open_list.isEmpty()) {
        _loop_1();
    }
    return closed_list.getPaths();
}
exports.GetMoveOptions = GetMoveOptions;
function CanOccupyTile(unit, tile, board) {
    return true;
}
function CanPassTile(unit, tile, board) {
    if (board.getUnit(tile)) {
        return false;
    }
    return true;
}
function GetAdjacent(tile, board) {
    return _.shuffle([
        board.getTile({ x: tile.x - 1, y: tile.y }),
        board.getTile({ x: tile.x + 1, y: tile.y }),
        board.getTile({ x: tile.x, y: tile.y - 1 }),
        board.getTile({ x: tile.x, y: tile.y + 1 }),
    ]);
}
function ToPathTile(tile, cost, last) {
    return {
        tile: tile,
        cost: cost + GetTileCost(tile),
        last: last,
    };
}
function GetTileCost(tile) {
    if (!tile) {
        return Infinity;
    }
    if (tile.type === Tile_1.TILE_DEF.WATER_EMPTY) {
        return 2;
    }
    return 1;
}
