"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Loader_1 = require("../../../board/Loader");
var TARGET_TYPE;
(function (TARGET_TYPE) {
    TARGET_TYPE[TARGET_TYPE["ANY"] = 0] = "ANY";
    TARGET_TYPE[TARGET_TYPE["EMPTY"] = 1] = "EMPTY";
    TARGET_TYPE[TARGET_TYPE["UNIT"] = 2] = "UNIT";
    TARGET_TYPE[TARGET_TYPE["ENEMY"] = 3] = "ENEMY";
    TARGET_TYPE[TARGET_TYPE["ALLY"] = 4] = "ALLY";
})(TARGET_TYPE || (TARGET_TYPE = {}));
var s_ability_map = new Map();
_.forEach(["METEOR", "STRIKE"], function (ability_name) {
    Loader_1.LoadJSON('assets/data/abilities/' + ability_name + '.json').then(function (def) {
        s_ability_map.set(ability_name, def);
    });
});
function GetAbilityDef(ability_name) {
    return s_ability_map.get(ability_name);
}
exports.GetAbilityDef = GetAbilityDef;
