"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var iso_spritesheet = 'assets/images/isometric/all.json';
var iso_tiles = 'assets/images/isometric/iso.json';
var AssetManager = (function () {
    function AssetManager() {
        var _this = this;
        this.load = function (cb) {
            _this.loader.load(function (loader, resources) {
                _this.m_spritesheet = resources[iso_spritesheet].spritesheet;
                _this.m_tilesheet = resources[iso_tiles].spritesheet;
                cb();
            });
        };
        var loader = this.loader = new PIXI.Loader();
        loader.add(iso_spritesheet);
        loader.add(iso_tiles);
        AssetManager._instance = this;
    }
    AssetManager.getTile = function (name) {
        return AssetManager._instance.m_tilesheet.textures[name];
    };
    AssetManager.init = function (onLoaded) {
        var manager = new AssetManager();
        manager.load(onLoaded);
    };
    return AssetManager;
}());
exports.default = AssetManager;
