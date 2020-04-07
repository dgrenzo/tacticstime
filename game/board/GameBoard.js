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
var _ = require("lodash");
var Tile_1 = require("./Tile");
var Scene_1 = require("../../engine/scene/Scene");
var Unit_1 = require("./Unit");
var GameBoard = (function (_super) {
    __extends(GameBoard, _super);
    function GameBoard() {
        var _this = _super.call(this) || this;
        _this.addTile = function (x, y, def) {
            _this.addElement(CreateTile(x, y, def));
        };
        _this.getUnitAtPosition = function (pos) {
            var unit = null;
            _this.getElementsAt(pos).forEach(function (element) {
                if (Unit_1.isUnit(element)) {
                    unit = element;
                    return false;
                }
                return true;
            });
            return unit;
        };
        _this.getUnit = function (id) {
            return _this.m_elements.get(id);
        };
        _this.getUnits = function () {
            return _this.m_elements.filter(function (element) {
                return Unit_1.isUnit(element);
            }).toList();
        };
        _this.getTiles = function () {
            return _this.m_elements.filter(function (element) {
                return Tile_1.isTile(element);
            }).toList();
        };
        _this.getTilesInRange = function (pos, range) {
            return _this.getTiles().filter(function (tile) {
                var distance = Math.abs(tile.pos.x - pos.x) + Math.abs(tile.pos.y - pos.y);
                return range.max >= distance && range.min <= distance;
            });
        };
        _this.getTileAtPos = function (pos) {
            var tile = null;
            _this.getElementsAt(pos).forEach(function (element) {
                if (Tile_1.isTile(element)) {
                    tile = element;
                    return false;
                }
                return true;
            });
            return tile;
        };
        return _this;
    }
    GameBoard.prototype.init = function (board_config) {
        var _this = this;
        _.forEach(board_config.layout.tiles, function (tile, index) {
            var x = index % board_config.layout.width;
            var y = Math.floor(index / board_config.layout.width);
            _this.addTile(x, y, tile);
        });
    };
    GameBoard.prototype.getElementsAt = function (pos) {
        return this.m_elements.filter(function (entity) {
            return pos && entity.pos.x === pos.x && entity.pos.y === pos.y;
        }).toList();
    };
    return GameBoard;
}(Scene_1.Scene));
exports.GameBoard = GameBoard;
var _ID = 0;
function CreateUnit(def) {
    return {
        id: _ID++,
        entity_type: "UNIT",
        pos: {
            x: def.pos.x,
            y: def.pos.y,
        },
        data: {
            unit_type: def.unit.display.sprite,
        },
        stats: _.cloneDeep(def.unit.stats),
        status: {
            hp: def.unit.stats.hp,
        },
        abilities: _.cloneDeep(def.unit.abilities),
        depth_offset: 2,
    };
}
exports.CreateUnit = CreateUnit;
function CreateTile(x, y, type) {
    return {
        id: _ID++,
        entity_type: "TILE",
        pos: {
            x: x,
            y: y,
        },
        data: {
            tile_type: type,
        },
        depth_offset: 0,
    };
}
