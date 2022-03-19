"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var Loader_1 = require("../board/Loader");
var AssetList_1 = require("./AssetList");
var UnitLoader = (function () {
    function UnitLoader() {
    }
    UnitLoader.GetUnitDefinition = function (unit_type) {
        if (!isUnitType(unit_type)) {
            return null;
        }
        return UnitLoader.s_unit_defs.get(unit_type);
    };
    UnitLoader.LoadUnitDefinitions = function () {
        UnitLoader.s_unit_defs = immutable_1.Map();
        var promises = [];
        Object.keys(AssetList_1.DATA_ASSET_MAP.units).forEach(function (unit_type) {
            var asset_path = AssetList_1.DATA_ASSET_MAP.units[unit_type];
            promises.push(Loader_1.LoadJSON(asset_path)
                .then(function (unit_data) {
                UnitLoader.s_unit_defs = UnitLoader.s_unit_defs.set(unit_type, unit_data);
            }));
        });
        return Promise.all(promises);
    };
    return UnitLoader;
}());
exports.UnitLoader = UnitLoader;
function isUnitType(unit_name) {
    return AssetList_1.UNITS.includes(unit_name);
}
