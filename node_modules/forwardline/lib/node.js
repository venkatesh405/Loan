"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Node = function Node(data) {
    this.prev = null;
    this.next = null;
    this.data = data;
};

Node.prototype = {
    constructor: Node,
    addPrev: function addPrev(n) {
        this.prev = n;
        n.next = this;
    },
    addNext: function addNext(n) {
        this.next = n;
        n.prev = this;
    },
    getPrev: function getPrev() {
        return this.prev;
    },
    getNext: function getNext() {
        return this.next;
    },
    getData: function getData() {
        return this.data;
    },
    remove: function remove() {
        if (this.prev) {
            this.prev.next = this.next;
        }
        if (this.next) {
            this.next.prev = this.prev;
        }
        this.prev = null;
        this.next = null;
    }
};

exports["default"] = Node;
module.exports = exports["default"];