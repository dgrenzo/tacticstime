"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var PlayerParty = (function () {
    function PlayerParty() {
        var _this = this;
        this.m_units = immutable_1.List();
        this.m_gold = 10;
        this.addUnit = function (unit) {
            _this.m_units = _this.m_units.push(unit);
        };
        this.chargeGold = function (amount) {
            if (_this.m_gold >= amount) {
                _this.m_gold -= amount;
                return true;
            }
            else {
                return false;
            }
        };
    }
    Object.defineProperty(PlayerParty.prototype, "units", {
        get: function () {
            return this.m_units;
        },
        enumerable: true,
        configurable: true
    });
    return PlayerParty;
}());
exports.PlayerParty = PlayerParty;
