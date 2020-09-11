"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _line = require("./line");

var _line2 = _interopRequireDefault(_line);

var release = function release(waitList, head, searchMap) {
    var lastest = head;
    if (waitList.length > 0) {
        lastest = waitList[0];
    }
    releaseOld(lastest, searchMap);
    releaseNew(waitList, head, searchMap);
};

var releaseNew = function releaseNew(waitList, head, searchMap) {
    var next = waitList[0] && waitList[0].getNext();
    while (next && next !== head) {
        var should = false;
        if (!contain(waitList, next) && outofSearchRules(head, next, searchMap)) {
            var counter = 0;
            for (var i = 0; i < waitList.length; i++) {
                if (!outofSearchRules(waitList[i], next, searchMap)) {
                    break;
                } else {
                    counter++;
                }
            }
            if (counter == waitList.length) should = true;
        }
        var far = next.getNext();
        if (should) {
            next.remove();
        }
        next = far;
    }
};

var releaseOld = function releaseOld(refer, searchMap) {
    var target = refer.getPrev();
    while (target) {
        var next = target.getPrev();
        if (outofSearchRules(refer, target, searchMap)) {
            target.remove();
        }
        target = next;
    }
};

var outofSearchRules = function outofSearchRules(refer, target, searchMap) {
    for (var _name in searchMap) {
        var searchRules = searchMap[_name];
        for (var i = 0; i < searchRules.length; i++) {
            var _searchRules$i = searchRules[i];
            var filter = _searchRules$i.filter;
            var dis = _searchRules$i.dis;

            var res = _line2["default"].outofSearch(refer, target, filter, dis);
            if (!res) return false;
        }
    }
    return true;
};

var contain = function contain(list, item) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] === item) {
            return true;
        }
    }
    return false;
};

exports["default"] = {
    release: release
};
module.exports = exports["default"];