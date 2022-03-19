"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var AssetList_1 = require("./AssetList");
var Loader_1 = require("../board/Loader");
var AuraLoader = (function () {
    function AuraLoader() {
    }
    AuraLoader.GetAuraDefinition = function (aura_name) {
        if (!isAura(aura_name)) {
            return null;
        }
        return AuraLoader.s_aura_defs.get(aura_name);
    };
    AuraLoader.LoadAuraDefinitions = function () {
        AuraLoader.s_aura_defs = immutable_1.Map();
        var promises = [];
        Object.keys(AssetList_1.DATA_ASSET_MAP.auras).forEach(function (aura_type) {
            var asset_path = AssetList_1.DATA_ASSET_MAP.auras[aura_type];
            promises.push(Loader_1.LoadJSON(asset_path)
                .then(function (aura_data) {
                if (aura_data.value === undefined) {
                    aura_data.value = 10;
                }
                AuraLoader.s_aura_defs = AuraLoader.s_aura_defs.set(aura_type, aura_data);
            }));
        });
        return Promise.all(promises);
    };
    return AuraLoader;
}());
exports.AuraLoader = AuraLoader;
function isAura(aura) {
    return AssetList_1.AURAS.includes(aura);
}
