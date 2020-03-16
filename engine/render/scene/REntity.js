"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var REntity = (function () {
    function REntity(info, tex) {
        var _this = this;
        this.offsetY = 0;
        this.setSprite = function (tex) {
            _this.m_image.texture = tex;
        };
        this.setFilter = function (filter) {
            if (filter.highlight) {
                _this.sprite.alpha = 0.5;
            }
            else {
                _this.sprite.alpha = 1;
            }
        };
        this.m_sprite = new PIXI.Sprite();
        this.m_sprite.interactive = this.m_sprite.buttonMode = true;
        this.id = info.id;
        this.m_image = new PIXI.Sprite();
        this.m_sprite.addChild(this.m_image);
        this.setSprite(tex);
    }
    Object.defineProperty(REntity.prototype, "sprite", {
        get: function () {
            return this.m_sprite;
        },
        enumerable: true,
        configurable: true
    });
    REntity.prototype.setPosition = function (x, y) {
        this.m_sprite.position.set(x, y + this.offsetY);
    };
    return REntity;
}());
exports.REntity = REntity;
