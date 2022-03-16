"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var GoldDisplay = (function () {
    function GoldDisplay(container, game_events) {
        var text_style = {
            fontSize: 24,
            fill: 0xFFFF00,
            stroke: 0x333333,
            strokeThickness: 4,
        };
        var text = new PIXI.Text('0', text_style);
        container.addChild(text);
        game_events.on('SET_GOLD', function (data) {
            text.text = data.amount + '';
        });
    }
    return GoldDisplay;
}());
exports.GoldDisplay = GoldDisplay;
