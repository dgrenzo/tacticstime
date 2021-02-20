"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TilePalette = void 0;
var PIXI = require("pixi.js");
var _ = require("lodash");
var Tile_1 = require("../../board/Tile");
var AssetManager_1 = require("../../assets/AssetManager");
var TilePalette = (function () {
    function TilePalette() {
        var _this = this;
        this.m_activeBrush = Tile_1.TILE_DEF.GRASS_EMPTY;
        this.init = function () {
            var brush = _this.m_brushIcon = new PIXI.Sprite();
            brush.position.set(5, 30);
            brush.scale.set(2);
            _this.m_container.addChild(brush);
            _.forEach(_.values(Tile_1.TILE_DEF), function (tile_type) {
                if (typeof tile_type === "string") {
                    return;
                }
                var x = tile_type % 10;
                var y = Math.floor(tile_type / 10);
                var btn = new PIXI.Sprite(AssetManager_1.default.getTile(Tile_1.GetTileName(tile_type)));
                _this.m_container.addChild(btn);
                btn.position.set(50 + x * 24, y * 24);
                btn.buttonMode = btn.interactive = true;
                btn.on('pointerdown', function () {
                    _this.setBrush(tile_type);
                });
            });
        };
        this.setBrush = function (def) {
            _this.m_activeBrush = def;
            _this.m_brushIcon = AssetManager_1.default.getTile(Tile_1.GetTileName(def));
        };
        this.m_container = new PIXI.Container();
        this.m_container.interactive = this.m_container.interactiveChildren = true;
        this.init();
        this.setBrush(Tile_1.TILE_DEF.GRASS_EMPTY);
    }
    Object.defineProperty(TilePalette.prototype, "brush", {
        get: function () {
            return this.m_activeBrush;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TilePalette.prototype, "container", {
        get: function () {
            return this.m_container;
        },
        enumerable: false,
        configurable: true
    });
    return TilePalette;
}());
exports.TilePalette = TilePalette;
