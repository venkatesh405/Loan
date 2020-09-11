"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _line = require("./line");

var _line2 = _interopRequireDefault(_line);

var _Node = require("./Node");

var _Node2 = _interopRequireDefault(_Node);

var _releaser = require("./releaser");

var _releaser2 = _interopRequireDefault(_releaser);

var _typevalidator = require("typevalidator");

var _typevalidator2 = _interopRequireDefault(_typevalidator);

var typeChecker = (0, _typevalidator2["default"])();

/**
 * search
 * delay search
 *
 * searchMap
 *     type   searchRules
 *
 * searchRule (filter, dis)
 * 
 */

var validateMap = function validateMap(searchMap) {
    for (var _name in searchMap) {
        var searchRules = searchMap[_name];
        validateRules(_name, searchRules);
    }
};

var validateRules = function validateRules(name, searchRules) {
    typeChecker.check("array", searchRules);
    for (var i = 0; i < searchRules.length; i++) {
        var searchRule = searchRules[i];
        checkSearchRule(name, searchRule);
    }
};

var checkSearchRule = function checkSearchRule(name, searchRule) {
    typeChecker.check("string & truthy", name);
    typeChecker.check("pureObj", searchRule);
    typeChecker.check("function", searchRule.filter);
    typeChecker.check("number", searchRule.dis);
};

var _addSearchRule = function _addSearchRule(searchMap, name, searchRule) {
    checkSearchRule(name, searchRule);
    searchMap[name] = searchMap[name] || [];
    searchMap[name].push(searchRule);
};

var _setSearchRules = function _setSearchRules(searchMap, name, searchRules) {
    validateRules(name, searchRules);
    searchMap[name] = searchRules;
};

var searchByType = function searchByType(refer, searchRules, cb) {
    var res = [];
    if (searchRules) {
        for (var i = 0; i < searchRules.length; i++) {
            var _searchRules$i = searchRules[i];
            var filter = _searchRules$i.filter;
            var dis = _searchRules$i.dis;

            var target = _line2["default"].search(refer, filter, dis);
            var data = target && target.getData();
            res.push(data);
        }
    }
    cb && cb(res);
};

var remove = function remove(list, item) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] === item) {
            list.splice(i, 1);
            return list;
        }
    }
    return list;
};

var likePromise = function likePromise(v) {
    return v && typeof v === "object" && typeof v.then === "function";
};

exports["default"] = function () {
    var searchMap = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    validateMap(searchMap);
    var head = null;
    var waitList = [];

    var push = function push(data) {
        var node = new _Node2["default"](data);
        if (head) head.addNext(node);
        head = node;
    };

    /**
     * store data and return cared other data
     *
     * data : tos store
     * type : trigger which kind of search rules to search line
     * wait : delay search or not
     */
    var store = function store(data) {
        push(data);
        var refer = head;
        return {
            search: (function (_search) {
                function search(_x, _x2, _x3) {
                    return _search.apply(this, arguments);
                }

                search.toString = function () {
                    return _search.toString();
                };

                return search;
            })(function (type, cb, wait) {
                return search(type, cb, wait, refer);
            }),
            store: store
        };
    };

    var search = function search(type, cb, wait) {
        var refer = arguments.length <= 3 || arguments[3] === undefined ? head : arguments[3];

        var searchRules = searchMap[type];
        if (typeof wait === "number") {
            waitList.push(refer);
            setTimeout(function () {
                remove(waitList, refer);
                searchByType(refer, searchRules, cb);
            }, wait);
        } else if (likePromise(wait)) {
            waitList.push(refer);
            wait.then(function (res) {
                remove(waitList, refer);
                searchByType(refer, searchRules, cb);
            });
        } else {
            searchByType(refer, searchRules, cb);
        }
        return {
            search: search,
            store: store
        };
    };

    //
    return {
        store: store,
        getLength: function getLength() {
            return _line2["default"].getLength(head);
        },
        release: function release() {
            _releaser2["default"].release(waitList, head, searchMap);
        },
        addSearchRule: function addSearchRule(name, searchRule) {
            return _addSearchRule(searchMap, name, searchRule);
        },
        setSearchRules: function setSearchRules(name, searchRules) {
            return _setSearchRules(searchMap, name, searchRules);
        }
    };
};

module.exports = exports["default"];