"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scene = (function () {
    function Scene() {
        var _this = this;
        this.getElements = function () {
            return _this.m_elements;
        };
        this.getElement = function (id) {
            for (var i = 0; i < _this.m_elements.length; i++) {
                if (_this.m_elements[i].id === id) {
                    return _this.m_elements[i];
                }
            }
            return null;
        };
        this.removeElement = function (id) {
            for (var i = 0; i < _this.m_elements.length; i++) {
                if (_this.m_elements[i].id === id) {
                    _this.m_elements.splice(i, 1);
                    return _this.m_elements[i];
                }
            }
            return null;
        };
    }
    Scene.prototype.addElement = function (element) {
        this.m_elements.push(element);
        return element;
    };
    return Scene;
}());
exports.Scene = Scene;
