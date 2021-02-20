"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedList = void 0;
var LinkedList = (function () {
    function LinkedList() {
        var _this = this;
        this.list_root = null;
        this.forEach = function (fn) {
            var node = _this.list_root;
            while (node) {
                fn(node.element);
                node = node.next;
            }
        };
        this.getFirst = function (comparison) {
            var node = _this.list_root;
            while (node) {
                if (comparison(node.element)) {
                    return node.element;
                }
                node = node.next;
            }
            return null;
        };
        this.getFirstIndex = function (comparison) {
            var node = _this.list_root;
            var index = 0;
            while (node) {
                if (comparison(node.element)) {
                    return index;
                }
                node = node.next;
                index++;
            }
            return index;
        };
        this.insertAt = function (element, index) {
            var node = _this.list_root;
            var prev = null;
            if (index === 0) {
                _this.add(element);
                return;
            }
            var count = 0;
            while (node && count < index) {
                count++;
                prev = node;
                node = node.next;
            }
            prev.next = {
                element: element,
                next: node,
            };
        };
    }
    LinkedList.prototype.add = function (element) {
        var current_root = this.list_root;
        this.list_root = {
            element: element,
            next: current_root,
        };
    };
    LinkedList.prototype.remove = function (element) {
        if (!this.list_root) {
            return;
        }
        if (element === this.list_root.element) {
            this.list_root = this.list_root.next;
            return;
        }
        var current = this.list_root;
        var prev = null;
        while (current) {
            if (current.element === element) {
                if (prev) {
                    prev.next = current.next;
                }
                return;
            }
            prev = current;
            current = current.next;
        }
    };
    return LinkedList;
}());
exports.LinkedList = LinkedList;
