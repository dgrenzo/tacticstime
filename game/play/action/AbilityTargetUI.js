"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function GetTileOptionsInRange(scene, start, target_def) {
    var max_range = target_def.range.max;
    var min_range = target_def.range.min;
    var options = [];
    for (var offset_x = -max_range; offset_x <= max_range; offset_x++) {
        var max_y = max_range - Math.abs(offset_x);
        for (var offset_y = -max_y; offset_y <= max_y; offset_y++) {
            if (Math.abs(offset_x) + Math.abs(offset_y) < min_range) {
                continue;
            }
            var tile = this.m_controller.getTile({ x: start.x + offset_x, y: start.y + offset_y });
            if (tile) {
                var unit = this.m_controller.GetUnitAtPosition(tile.pos);
                switch (this.m_ability_def.target.target_type) {
                    case "EMPTY":
                        if (unit) {
                            continue;
                        }
                        break;
                    case "ALLY":
                        if (!unit || this.m_active_unit.data.faction !== unit.data.faction) {
                            continue;
                        }
                        break;
                    case "ENEMY":
                        if (!unit || this.m_active_unit.data.faction === unit.data.faction) {
                            continue;
                        }
                        break;
                    case "ANY":
                        break;
                }
                options.push({ tile: tile });
            }
        }
    }
    return options;
}
function GetAction(tile, options) {
    var option = GetOptionFromTile(tile, options);
    return ToAction(option);
}
function ToAction(option) {
    return [
        {
            type: "ABILITY",
            data: {
                source: this.m_active_unit,
                target: option.tile,
                ability: this.m_ability_def,
            }
        }
    ];
}
function GetOptionFromTile(tile, options) {
    var path = null;
    return path;
}
