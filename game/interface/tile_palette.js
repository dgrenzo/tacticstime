"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var _ = require("lodash");
var event_1 = require("../../engine/listener/event");
var Tile_1 = require("../board/Tile");
var assets_1 = require("../assets");
var TilePalette = (function () {
    function TilePalette() {
        var _this = this;
        this.on = function (event, cb) {
            _this.m_eventManager.add(event, cb);
        };
        this.init = function () {
            var brush_icon = new PIXI.Sprite();
            brush_icon.texture = assets_1.default.getTile(Tile_1.GetTileName(Tile_1.TILE_DEF.GRASS_EMPTY));
            brush_icon.position.set(5, 30);
            brush_icon.scale.set(2);
            _this.m_container.addChild(brush_icon);
            _.forEach(_.values(Tile_1.TILE_DEF), function (tile_type) {
                if (typeof tile_type === "string") {
                    return;
                }
                var x = tile_type % 10;
                var y = Math.floor(tile_type / 10);
                var btn = new PIXI.Sprite(assets_1.default.getTile(Tile_1.GetTileName(tile_type)));
                _this.m_container.addChild(btn);
                btn.position.set(50 + x * 24, y * 24);
                btn.buttonMode = btn.interactive = true;
                btn.on('pointerdown', function () {
                    _this.m_eventManager.emit("TILE_SELECTED", { def: tile_type });
                    brush_icon.texture = assets_1.default.getTile(Tile_1.GetTileName(tile_type));
                });
            });
        };
        this.m_eventManager = new event_1.EventManager();
        this.m_container = new PIXI.Container();
        this.m_container.interactive = this.m_container.interactiveChildren = true;
        this.init();
    }
    Object.defineProperty(TilePalette.prototype, "container", {
        get: function () {
            return this.m_container;
        },
        enumerable: true,
        configurable: true
    });
    return TilePalette;
}());
exports.TilePalette = TilePalette;
