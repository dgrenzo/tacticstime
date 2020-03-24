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
        _this.addUnit = function (unit) {
            _this.addElement(unit);
        };
        _this.addTile = function (x, y, def) {
            _this.m_tiles[x][y] = _this.addElement(new Tile_1.Tile(x, y, def));
        };
        _this.getUnit = function (pos) {
            var unit = null;
            _.forEach(_this.getElementsAt(pos), function (element) {
                if (element instanceof Unit_1.Unit) {
                    unit = element;
                    return false;
                }
                return true;
            });
            return unit;
        };
        _this.getTile = function (pos) {
            if (!_this.m_tiles[pos.x] || !_this.m_tiles[pos.x][pos.y]) {
                return null;
            }
            return _this.m_tiles[pos.x][pos.y];
        };
        _this.tileExists = function (pos) {
            return _this.getTile(pos) !== null;
        };
        _this.getConfig = function () {
            var cfg = [];
            cfg.push(String.fromCharCode(_this.width));
            cfg.push(String.fromCharCode(_this.height));
            for (var y = 0; y < _this.height; y++) {
                for (var x = 0; x < _this.width; x++) {
                    var type = _this.getTile({ x: x, y: y }).type;
                    cfg.push(String.fromCharCode(type));
                }
            }
            return cfg.join('');
        };
        return _this;
    }
    GameBoard.prototype.init = function (board_config) {
        var _this = this;
        this.m_elements = [];
        this.width = board_config.layout.width;
        this.height = board_config.layout.height;
        this.m_tiles = [];
        for (var i = 0; i < this.height; i++) {
            this.m_tiles.push([]);
        }
        _.forEach(board_config.layout.tiles, function (tile, index) {
            var x = index % board_config.layout.width;
            var y = Math.floor(index / board_config.layout.width);
            _this.addTile(x, y, tile);
        });
        this.addUnit(new Unit_1.Unit(7, 10, { asset: "dwarf" }));
        this.addUnit(new Unit_1.Unit(8, 13, { asset: "lizard" }));
        this.addUnit(new Unit_1.Unit(9, 11, { asset: "guard" }));
        this.addUnit(new Unit_1.Unit(10, 9, { asset: "monk" }));
        this.addUnit(new Unit_1.Unit(11, 8, { asset: "oldman" }));
        this.addUnit(new Unit_1.Unit(3, 6, { asset: "rhino" }));
        this.addUnit(new Unit_1.Unit(10, 3, { asset: "wizard" }));
    };
    GameBoard.prototype.getElementsAt = function (pos) {
        if (!pos) {
            return [];
        }
        var elements = [];
        this.m_elements.forEach(function (ent) {
            if (ent.x === pos.x && ent.y === pos.y) {
                elements.push(ent);
            }
        });
        return elements;
    };
    return GameBoard;
}(Scene_1.Scene));
exports.GameBoard = GameBoard;
