"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderEntity = void 0;
var PIXI = require("pixi.js");
var AssetManager_1 = require("../../../game/assets/AssetManager");
var _RenderEntityID = 0;
var RenderEntity = (function () {
    function RenderEntity() {
        var _this = this;
        this.m_depth = 0;
        this.m_depth_offset = 0;
        this.renderAsset = function (asset_info) {
            switch (asset_info.type) {
                case "SPRITE":
                    _this.setSprite(asset_info);
                    break;
                case "ANIMATED_SPRITE":
                    _this.setAnimatedSprite(asset_info);
                    break;
                case "EFFECT":
                    _this.setEffect(asset_info);
            }
        };
        this.setPlugin = function (plugin_name) {
            _this.m_image.pluginName = plugin_name;
        };
        this.resetPlugin = function () {
            _this.m_image.pluginName = 'batch';
        };
        this.setSprite = function (asset_info) {
            _this.m_container.removeChildren();
            _this.m_depth_offset = asset_info.depth_offset;
            _this.m_container.addChild(_this.m_image = new PIXI.Sprite(AssetManager_1.default.getTile(asset_info.name)));
        };
        this.setAnimatedSprite = function (asset_info) {
            _this.m_container.removeChildren();
            _this.m_depth_offset = asset_info.depth_offset;
            var animation_data = AssetManager_1.default.getAnimatedSprite(asset_info.name);
            var animated_sprite = new PIXI.AnimatedSprite(animation_data, true);
            animated_sprite.position.set(3, -7);
            animated_sprite.gotoAndPlay(Math.random() * 200);
            _this.m_image = animated_sprite;
            _this.m_container.addChild(animated_sprite);
        };
        this.setEffect = function (asset_info) {
            _this.m_container.removeChildren();
            _this.m_depth_offset = asset_info.depth_offset;
            _this.m_container.addChild(AssetManager_1.default.getEffect(asset_info));
        };
        this.m_id = _RenderEntityID++;
        this.m_root = new PIXI.Container();
        this.m_container = new PIXI.Container();
        this.m_root.addChild(this.m_container);
        this.m_image = new PIXI.Sprite();
        this.m_container.addChild(this.m_image);
    }
    Object.defineProperty(RenderEntity.prototype, "id", {
        get: function () {
            return this.m_id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RenderEntity.prototype, "depth_offset", {
        get: function () {
            return this.m_depth_offset;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RenderEntity.prototype, "depth", {
        get: function () {
            return this.m_depth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RenderEntity.prototype, "root", {
        get: function () {
            return this.m_root;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RenderEntity.prototype, "sprite", {
        get: function () {
            return this.m_container;
        },
        enumerable: false,
        configurable: true
    });
    RenderEntity.prototype.setPosition = function (pos, depth) {
        if (depth === void 0) { depth = 0; }
        this.m_root.position.set(pos.x, pos.y);
        this.m_depth = depth;
    };
    return RenderEntity;
}());
exports.RenderEntity = RenderEntity;
