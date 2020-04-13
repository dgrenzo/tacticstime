"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var AssetManager_1 = require("../../../game/assets/AssetManager");
var RenderEntity = (function () {
    function RenderEntity(id) {
        var _this = this;
        this.offsetY = 0;
        this.render = function (asset_info) {
            switch (asset_info.type) {
                case "SPRITE":
                    _this.setSprite(asset_info.name);
                    break;
                case "ANIMATED_SPRITE":
                    _this.setAnimatedSprite(asset_info.name);
                    break;
                case "EFFECT":
                    _this.setEffect(asset_info.name);
            }
        };
        this.setPlugin = function (plugin_name) {
            _this.m_image.pluginName = plugin_name;
        };
        this.resetPlugin = function () {
            _this.m_image.pluginName = 'batch';
        };
        this.setSprite = function (asset_name) {
            _this.m_container.removeChildren();
            _this.m_container.addChild(_this.m_image = new PIXI.Sprite(AssetManager_1.default.getTile(asset_name)));
        };
        this.setAnimatedSprite = function (animation_name) {
            _this.m_container.removeChildren();
            var animation_data = AssetManager_1.default.getAnimatedSprite(animation_name);
            var animated_sprite = new PIXI.AnimatedSprite(animation_data, true);
            animated_sprite.position.set(3, -7);
            animated_sprite.play();
            _this.m_image = animated_sprite;
            _this.m_container.addChild(animated_sprite);
        };
        this.setEffect = function (effect_name) {
        };
        this.m_container = new PIXI.Sprite();
        this.m_container.interactive = this.m_container.buttonMode = true;
        this.m_id = id;
        this.m_image = new PIXI.Sprite();
        this.m_container.addChild(this.m_image);
    }
    Object.defineProperty(RenderEntity.prototype, "id", {
        get: function () {
            return this.m_id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderEntity.prototype, "sprite", {
        get: function () {
            return this.m_container;
        },
        enumerable: true,
        configurable: true
    });
    RenderEntity.prototype.setPosition = function (x, y) {
        this.m_container.position.set(x, y + this.offsetY);
    };
    return RenderEntity;
}());
exports.RenderEntity = RenderEntity;
