"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var findOp = function findOp(str, index, operationMap) {
	var chr = str[index];
	var opNames = filterOpNames(chr, operationMap);
	var machNames = [];

	if (opNames.length) {
		for (var i = 0; i < opNames.length; i++) {
			var opName = opNames[i];
			var opObject = operationMap[opName];
			if (matchOperation(opName, opObject, str, index)) {
				machNames.push(opName);
			}
		}
	}

	// match the longest one.
	if (machNames.length) {
		var res = "";
		for (var j = 0; j < machNames.length; j++) {
			if (machNames[j].length > res.length) res = machNames[j];
		}
		return res;
	}
	return undefined;
};

var matchOperation = function matchOperation(opName, opObject, str, index) {
	if (index > 0) {
		var last = str[index - 1];
		if (opObject.needBeforeSpace) {
			if (!isBlank(last)) {
				return false;
			}
		}
	}
	if (index + opName.length <= str.length) {
		var sub = str.substring(index, index + opName.length);
		if (sub !== opName) return false;
		if (opObject.needAfterSpace && str.length > index + opName.length) {
			var last = str[index + opName.length];
			if (!isBlank(last)) {
				return false;
			}
		}
	} else {
		return false;
	}
	return true;
};

var filterOpNames = function filterOpNames(chr, operationMap) {
	var names = [];
	for (var _name in operationMap) {
		if (_name.startsWith(chr)) {
			names.push(_name);
		}
	}
	return names;
};

var isBlank = function isBlank(chr) {
	return (/^\s$/.test(chr)
	);
};

exports["default"] = findOp;
module.exports = exports["default"];