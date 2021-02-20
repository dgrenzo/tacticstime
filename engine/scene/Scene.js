"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
var immutable_1 = require("immutable");
var Scene = (function () {
    function Scene() {
        var _this = this;
        this.m_elements = immutable_1.Map();
        this.getElement = function (id) {
            return _this.m_elements.get(id);
        };
        this.removeElement = function (id) {
            var element = _this.getElement(id);
            _this.m_elements = _this.m_elements.remove(id);
            return element;
        };
    }
    Scene.prototype.addElement = function (element) {
        this.m_elements = this.m_elements.set(element.id, element);
        return element;
    };
    Object.defineProperty(Scene.prototype, "elements", {
        get: function () {
            return this.m_elements;
        },
        set: function (val) {
            this.m_elements = val;
        },
        enumerable: false,
        configurable: true
    });
    return Scene;
}());
exports.Scene = Scene;
