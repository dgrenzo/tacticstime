"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var PIXI = require("pixi.js");
var event_1 = require("../../../engine/listener/event");
var abilities_1 = require("../action/abilities");
var UnitSelectedPanel = (function () {
    function UnitSelectedPanel(m_controller) {
        var _this = this;
        this.m_controller = m_controller;
        this.m_container = new PIXI.Container();
        this.m_event_manager = new event_1.EventManager();
        this.showUnitPanel = function (unit) {
            _this.m_container.removeChildren();
            _this.m_container.visible = true;
            if (!unit) {
                return;
            }
            _this.showAbilities(unit.abilities);
        };
        this.hide = function () {
            _this.m_container.visible = false;
        };
        this.onAbilitySelected = function (cb) {
            _this.m_event_manager.add("ABILITY_SELECTED", cb);
        };
        this.showAbilities = function (abiliy_list) {
            _.forEach(abiliy_list, function (name, index) {
                var ability_def = abilities_1.GetAbilityDef(name);
                var btn = new PIXI.Sprite();
                btn.addChild(new PIXI.Graphics().beginFill(0x333333).drawRoundedRect(0, 0, 200, 60, 5).endFill());
                btn.interactive = btn.buttonMode = true;
                btn.on('pointerdown', function (evt) {
                    evt.stopPropagation();
                    _this.m_event_manager.emit("ABILITY_SELECTED", ability_def);
                });
                btn.position.set(0, 80 + index * 80);
                var label = new PIXI.Text(ability_def.name, { fill: 0xFFFFFF });
                label.anchor.set(0.5);
                label.position.set(100, 30);
                btn.addChild(label);
                _this.m_container.addChild(btn);
            });
        };
        this.m_container.position.set(10, 500);
        m_controller.addInterfaceElement(this.m_container);
    }
    return UnitSelectedPanel;
}());
exports.UnitSelectedPanel = UnitSelectedPanel;
