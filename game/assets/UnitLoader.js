"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitLoader = void 0;
var _ = require("lodash");
var immutable_1 = require("immutable");
var Loader_1 = require("../board/Loader");
var unit_list = [
    "dwarf",
    "lizard",
    "monk",
    "mooseman",
    "oldman",
    "rhino",
    "troll",
    "guard",
    "knight_green",
    "basic_bow",
    "basic_axe",
];
var UnitLoader = (function () {
    function UnitLoader() {
    }
    UnitLoader.GetUnitDefinition = function (unit_type) {
        return UnitLoader.s_unit_defs.get(unit_type);
    };
    UnitLoader.LoadUnitDefinitions = function () {
        UnitLoader.s_unit_defs = immutable_1.Map();
        var promises = [];
        _.forEach(unit_list, function (unit_type) {
            var def_url = GetDefURL(unit_type);
            promises.push(Loader_1.LoadJSON(def_url)
                .then(function (unit_data) {
                UnitLoader.s_unit_defs = UnitLoader.s_unit_defs.set(unit_type, unit_data);
            }));
        });
        return Promise.all(promises);
    };
    return UnitLoader;
}());
exports.UnitLoader = UnitLoader;
function GetDefURL(unit_type) {
    return "assets/data/units/" + unit_type + ".json";
}
