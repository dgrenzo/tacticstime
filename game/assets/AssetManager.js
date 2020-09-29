"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var _ = require("lodash");
var iso_spritesheet = 'assets/images/isometric/all.json';
var iso_tiles = 'assets/images/isometric/iso.json';
var AssetManager = (function () {
    function AssetManager() {
        var _this = this;
        this.m_animationMap = new Map();
        this.load = function (cb) {
            _this.loader.load(function (loader, resources) {
                _this.m_tilesheet = resources[iso_tiles].spritesheet;
                _this.m_spritesheet = resources[iso_spritesheet].spritesheet;
                _.forEach(_.keys(_this.m_spritesheet.animations), function (animation_name) {
                    var sheet = _this.m_spritesheet;
                    var animation = [];
                    var textures = sheet.animations[animation_name];
                    var data = resources[iso_spritesheet].data;
                    _.forEach(textures, function (tex) {
                        animation.push({
                            texture: tex,
                            time: data.frames[tex.textureCacheIds[0]].frame.time,
                        });
                    });
                    AssetManager._instance.m_animationMap.set(animation_name, animation);
                });
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
    AssetManager.getAnimatedSprite = function (name) {
        return AssetManager._instance.m_animationMap.get(name);
    };
    AssetManager.getEffect = function (asset_info) {
        var effect = new PIXI.Container();
        var text = new PIXI.Text(asset_info.data.amount + '', {
            fill: 0xFFFFCC,
            size: 24,
            stroke: 0x291f2e,
            strokeThickness: 5,
            fontWeight: 'bolder',
        });
        text.scale.set(1.00);
        text.anchor.set(0.5);
        effect.addChild(text);
        return effect;
    };
    AssetManager.init = function (onLoaded) {
        var manager = new AssetManager();
        manager.load(onLoaded);
    };
    return AssetManager;
}());
exports.default = AssetManager;
