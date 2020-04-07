"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var HealthBar = (function () {
    function HealthBar(unit_id, controller, renderer) {
        var _this = this;
        this.m_container = new PIXI.Container();
        var bg = new PIXI.Graphics().beginFill(0xFF0000).drawRect(5, 5, 10, 2).endFill();
        var hp = new PIXI.Graphics().beginFill(0x00FF00).drawRect(5, 5, 10, 2).endFill();
        this.m_container.addChild(bg, hp);
        var unit = controller.getUnit(unit_id);
        var screen_pos = renderer.getScreenPosition(unit.pos.x, unit.pos.y);
        this.m_container.position.set(screen_pos.x, screen_pos.y - 8);
        controller.on("MOVE", function (data) {
            if (data.entity_id === unit_id) {
                var screen_pos_1 = renderer.getScreenPosition(data.move.to.x, data.move.to.y);
                _this.m_container.position.set(screen_pos_1.x, screen_pos_1.y - 8);
            }
        });
        controller.on("DAMAGE_DEALT", function (data) {
            if (data.entity_id === unit_id) {
                var unit_1 = controller.getUnit(unit_id);
                var bar_width = Math.floor(unit_1.status.hp / unit_1.stats.hp * 10);
                hp.clear().beginFill(0x00FF00).drawRect(5, 5, bar_width, 2).endFill();
            }
        });
        controller.on("UNIT_KILLED", function (data) {
            if (data.entity_id === unit_id) {
                _this.m_container.visible = false;
            }
        });
    }
    Object.defineProperty(HealthBar.prototype, "sprite", {
        get: function () {
            return this.m_container;
        },
        enumerable: true,
        configurable: true
    });
    return HealthBar;
}());
exports.HealthBar = HealthBar;
