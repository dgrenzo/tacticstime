"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var GameBoard_1 = require("../../board/GameBoard");
var HealthBar = (function () {
    function HealthBar(m_unit_id, animator, m_renderer) {
        this.m_unit_id = m_unit_id;
        this.m_renderer = m_renderer;
        this.m_container = new PIXI.Container();
        this.m_container.addChild(new PIXI.Graphics().beginFill(0x333333).drawRect(4, 4, 12, 4).endFill());
        this.m_container.addChild(new PIXI.Graphics().beginFill(0x291f2e).drawRect(5, 5, 10, 2).endFill());
        this.m_hp_graphic = new PIXI.Graphics();
        this.m_hp_graphic.beginFill(0x00CC00).drawRect(5, 5, 10, 2).endFill();
        this.m_container.addChild(this.m_hp_graphic);
        this.m_container.visible = false;
        var events = animator.events;
        events.on("MOVE", this.onMoveAction, this);
        events.on("DAMAGE_DEALT", this.onDamageDealtAction, this);
        events.on("UNIT_KILLED", this.onUnitKilledAction, this);
    }
    HealthBar.prototype.updatePosition = function (pos, renderer) {
        var screen_pos = renderer.getScreenPosition(pos);
        this.m_container.position.set(screen_pos.x - 1, screen_pos.y - 10);
    };
    HealthBar.prototype.onDamageDealtAction = function (result) {
        var unit_id = this.m_unit_id;
        var container = this.m_container;
        var hp_graphic = this.m_hp_graphic;
        var data = result.action.data;
        if (data.entity_id === unit_id) {
            container.visible = true;
            var unit = GameBoard_1.GameBoard.GetUnit(result.scene, unit_id);
            var bar_width = Math.floor(unit.status.hp / unit.stats.hp * 10);
            var color = 0x00CC00;
            if (bar_width <= 3) {
                color = 0xCC0000;
            }
            else if (bar_width <= 6) {
                color = 0xCCCC00;
            }
            hp_graphic.clear().beginFill(color).drawRect(5, 5, bar_width, 2).endFill();
            this.updatePosition(unit.pos, this.m_renderer);
        }
    };
    HealthBar.prototype.onMoveAction = function (result) {
        var unit_id = this.m_unit_id;
        if (result.action.data.entity_id === unit_id) {
            var renderer = this.m_renderer;
            var unit = GameBoard_1.GameBoard.GetUnit(result.scene, unit_id);
            this.updatePosition(unit.pos, renderer);
        }
    };
    HealthBar.prototype.onUnitKilledAction = function (result) {
        var unit_id = this.m_unit_id;
        var container = this.m_container;
        var data = result.action.data;
        if (data.entity_id === unit_id) {
            container.visible = false;
        }
    };
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
