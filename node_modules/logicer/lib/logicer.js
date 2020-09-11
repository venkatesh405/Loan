/**
 * 
 * define logic unit
 * 
 * definUnit(name, judge)
 *      name: logic unit name
 *      judge: accept elements return boolean value
 * 
 * basic logic compose: and or not
 * 
 * 1. support compose way
 * 
 * 2. logic language (main purpose)
 * meta: & | ~ ( )
 * 
 * a & b | (c & (e | ~f))
 * =>  or(and(a, b) ,or(and(c, or(e, not(f)))))
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _expressioner = require("expressioner");

var _expressioner2 = _interopRequireDefault(_expressioner);

var getOperationMap = function getOperationMap(logicMap) {
    return {
        "&": {
            priority: 10,
            opNum: 2,
            execute: function execute(name1, name2) {
                return function () {
                    for (var _len = arguments.length, y = Array(_len), _key = 0; _key < _len; _key++) {
                        y[_key] = arguments[_key];
                    }

                    var fun1 = name1,
                        fun2 = name2;
                    if (typeof fun1 === "string") fun1 = logicMap[name1];
                    if (typeof fun2 === "string") fun2 = logicMap[name2];
                    return fun1.apply(undefined, y) && fun2.apply(undefined, y);
                };
            }
        },
        "|": {
            priority: 10,
            opNum: 2,
            execute: function execute(name1, name2) {
                return function () {
                    for (var _len2 = arguments.length, y = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        y[_key2] = arguments[_key2];
                    }

                    var fun1 = name1,
                        fun2 = name2;
                    if (typeof fun1 === "string") fun1 = logicMap[name1];
                    if (typeof fun2 === "string") fun2 = logicMap[name2];
                    return fun1.apply(undefined, y) || fun2.apply(undefined, y);
                };
            }
        },
        "~": {
            priority: 40,
            opNum: 1,
            execute: function execute(name) {
                return function () {
                    for (var _len3 = arguments.length, y = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                        y[_key3] = arguments[_key3];
                    }

                    var fun = name;
                    if (typeof fun === "string") fun = logicMap[name];
                    return !fun.apply(undefined, y);
                };
            }
        },
        "(": {
            type: "start"
        },
        ")": {
            type: "close",
            match: "("
        }
    };
};

var defineUnit = function defineUnit(name, judge, logicMap, operationMap) {
    for (var opName in operationMap) {
        if (name.indexOf(opName) !== -1) {
            throw new TypeError("unexpected name, contain special symbol, like " + metalist.join(" "));
        }
    }
    if (typeof judge === "function" || judge instanceof RegExp) {
        logicMap[name] = judge;
    } else {
        throw new TypeError("unexpected type judge, expect function or RegExp instance.");
    }
};

exports["default"] = function () {
    var setMap = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var cacheMax = arguments.length <= 1 || arguments[1] === undefined ? 10000 : arguments[1];

    if (!setMap || typeof setMap !== "object") throw new TypeError("accept object only.");

    var logicMap = {},
        cacheMap = {},
        counter = 0;
    for (var _name in setMap) {
        defineUnit(_name, setMap[_name], logicMap, operationMap);
    }

    var operationMap = getOperationMap(logicMap);

    var translator = (0, _expressioner2["default"])(operationMap);

    var translate = function translate(str) {
        if (cacheMap.hasOwnProperty(str)) {
            return cacheMap[str];
        }
        var value = translator(str).value;
        if (typeof value === "string") value = logicMap[value];
        if (counter < cacheMax) {
            cacheMap[str] = value;
            counter++;
        }
        return value;
    };

    return {
        translate: translate
    };
};

module.exports = exports["default"];