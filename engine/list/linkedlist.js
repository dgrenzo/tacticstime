"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinkedList = (function () {
    function LinkedList() {
        var _this = this;
        this.list_root = {
            element: null,
            next: null
        };
        this.forEach = function (fn) {
            var node = _this.list_root.next;
            while (node) {
                fn(node.element);
                node = node.next;
            }
        };
        this.getFirst = function (comparison) {
            var node = _this.list_root.next;
            while (node) {
                if (comparison(node.element)) {
                    return node.element;
                }
                node = node.next;
            }
            return null;
        };
        this.getFirstIndex = function (comparison) {
            var node = _this.list_root.next;
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
            var node = _this.list_root.next;
            var prev = _this.list_root;
            if (index === 0) {
                _this.unshift(element);
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
    LinkedList.prototype.unshift = function (element) {
        this.list_root.next = {
            element: element,
            next: this.list_root.next
        };
    };
    LinkedList.prototype.isEmpty = function () {
        return this.list_root.next === null;
    };
    Object.defineProperty(LinkedList.prototype, "tail", {
        get: function () {
            var node = this.list_root;
            while (node && node.next) {
                node = node.next;
            }
            return node ? node : null;
        },
        enumerable: true,
        configurable: true
    });
    LinkedList.prototype.push = function (element) {
        this.tail.next = {
            element: element,
            next: null
        };
    };
    LinkedList.prototype.shift = function () {
        var list_element = this.list_root.next;
        if (list_element) {
            this.list_root.next = list_element.next;
            return list_element.element;
        }
        return null;
    };
    LinkedList.prototype.remove = function (element) {
        var current = this.list_root.next;
        var prev = this.list_root;
        while (current) {
            if (current.element === element) {
                prev.next = current.next;
                return;
            }
            prev = current;
            current = current.next;
        }
    };
    return LinkedList;
}());
exports.LinkedList = LinkedList;
