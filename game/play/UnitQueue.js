"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var UnitQueue = (function () {
    function UnitQueue() {
        var _this = this;
        this.m_root = {
            next: null,
            unit: null,
        };
        this.m_current = this.m_root;
        this.addUnits = function (units) {
            _.forEach(units, _this.addUnit);
        };
        this.addUnit = function (unit) {
            var parent = _this.m_root;
            while (parent.next && parent.next.unit.getSpeed() >= unit.getSpeed()) {
                parent = parent.next;
            }
            var next = parent.next;
            parent.next = {
                unit: unit,
                next: next,
            };
        };
        this.getNextQueued = function () {
            _this.m_current = _this.m_current.next;
            if (_this.m_current) {
                return _this.m_current.unit;
            }
            return null;
        };
    }
    return UnitQueue;
}());
exports.UnitQueue = UnitQueue;
