"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _forward = require("./forward");

var _forward2 = _interopRequireDefault(_forward);

var _filter = require("./filter");

var _filter2 = _interopRequireDefault(_filter);

var _typevalidator = require("typevalidator");

var _typevalidator2 = _interopRequireDefault(_typevalidator);

var typeChecker = (0, _typevalidator2["default"])();

/**
 *
 * searchMap
 *     type   searchRules
 *
 * searchRule = (filter, dis)
 *
 * filter
 *     name
 *     type
 *     value
 * 
 */

exports["default"] = function (searchMap) {
    var forwardline = (0, _forward2["default"])();

    var addSearchRule = function addSearchRule(name, searchRule) {
        typeChecker.check("string", name);
        typeChecker.check("pureObj", searchRule);
        typeChecker.check("array", searchRule.filter);
        searchRule.filter = _filter2["default"].getFilter(searchRule.filter);
        forwardline.addSearchRule(name, searchRule);
    };
    for (var _name in searchMap) {
        var searchRules = searchMap[_name];
        typeChecker.check("array", searchRules);
        for (var i = 0; i < searchRules.length; i++) {
            var searchRule = searchRules[i];
            addSearchRule(_name, searchRule);
        }
    }

    var setSearchRules = function setSearchRules(name, searchRules) {
        forwardline.setSearchRules(name, []);
        for (var i = 0; i < searchRules.length; i++) {
            addSearchRule(name, searchRules[i]);
        }
    };

    var setSearchRule = function setSearchRule(name, searchRule) {};
    return {
        store: forwardline.store,
        search: forwardline.search,
        getLength: forwardline.getLength,
        release: forwardline.release,
        addSearchRule: addSearchRule,
        setSearchRules: setSearchRules
    };
};

module.exports = exports["default"];