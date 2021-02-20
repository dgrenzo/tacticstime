"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerParty = void 0;
var immutable_1 = require("immutable");
var PlayerParty = (function () {
    function PlayerParty(m_events) {
        var _this = this;
        this.m_events = m_events;
        this.m_units = immutable_1.List();
        this.m_gold = 0;
        this.addUnit = function (unit) {
            _this.m_units = _this.m_units.push(unit);
        };
        this.addGold = function (amount) {
            _this.changeGold(amount);
            return _this.m_gold;
        };
        this.chargeGold = function (amount) {
            if (_this.m_gold >= amount) {
                _this.changeGold(-amount);
                return true;
            }
            else {
                return false;
            }
        };
        this.changeGold = function (amount) {
            _this.m_gold += amount;
            _this.m_events.emit("SET_GOLD", { amount: _this.m_gold });
        };
        this.addGold(10);
    }
    Object.defineProperty(PlayerParty.prototype, "units", {
        get: function () {
            return this.m_units;
        },
        enumerable: false,
        configurable: true
    });
    return PlayerParty;
}());
exports.PlayerParty = PlayerParty;
