"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UnitQueue = (function () {
    function UnitQueue() {
        var _this = this;
        this.m_root = {
            next: null,
            unit: null,
        };
        this.m_current = this.m_root;
        this.addUnits = function (units) {
            units.forEach(_this.addUnit);
        };
        this.addUnit = function (unit) {
            var parent = _this.m_root;
            while (parent.next && parent.next.unit.stats.speed >= unit.stats.speed) {
                parent = parent.next;
            }
            var next = parent.next;
            parent.next = {
                unit: unit,
                next: next,
            };
        };
        this.removeUnit = function (id) {
            var target = _this.m_root;
            while (target && target.next) {
                if (target.next.unit.id === id) {
                    target.next = target.next.next;
                }
                target = target.next;
            }
        };
        this.getNextQueued = function () {
            _this.m_current = _this.m_current.next;
            if (_this.m_current) {
                return _this.m_current.unit.id;
            }
            else if (_this.m_root.next) {
                _this.m_current = _this.m_root;
                return _this.getNextQueued();
            }
            return null;
        };
    }
    return UnitQueue;
}());
exports.UnitQueue = UnitQueue;
