/**
 * expresion combined by two kinds of nodes: operations and values
 *
 * operations contains two type
 * (1) block area which has a start and a close operation
 * (2) simple operation
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _findOp = require("./findOp");

var _findOp2 = _interopRequireDefault(_findOp);

var ast = function ast(operationMap) {
	return function (str) {
		if (typeof str !== "string") throw new TypeError("unexpected value to parse.");
		var opStack = [],
		    valueStack = [],
		    tmpStr = "";
		for (var i = 0; i < str.length; i++) {
			var ch = str[i];
			var opName = (0, _findOp2["default"])(str, i, operationMap);
			if (opName !== undefined) {
				i = i + opName.length - 1;
				tmpStr = tmpStr.trim();
				if (tmpStr) {
					valueStack.push(tmpStr);
					tmpStr = "";
				}
				pushOp(opName, opStack, valueStack, operationMap);
			} else {
				tmpStr += ch;
				if (i === str.length - 1) {
					tmpStr = tmpStr.trim();
					valueStack.push(tmpStr);
					tmpStr = "";
				}
			}
		}
		finish(opStack, valueStack, operationMap);
		return {
			value: valueStack[0]
		};
	};
};

var pushOp = function pushOp(opName, opStack, valueStack, operationMap) {
	// blanket
	if (isStartBlanket(opName, operationMap)) {
		opStack.push(opName);
		return;
	}
	if (isEndBlanket(opName, operationMap)) {
		while (opStack.length) {
			if (isMatchedStart(opStack[opStack.length - 1], opName, operationMap)) {
				opStack.pop();
				return;
			}
			computeOperation(opStack, valueStack, operationMap);
		}
		throw new Error("missing left blanket.");
	}
	// have no operation
	if (opStack.length === 0) {
		opStack.push(opName);
		return;
	}
	// compare for other operation
	comparePriority(opName, opStack, valueStack, operationMap);
};

var comparePriority = function comparePriority(opName, opStack, valueStack, operationMap) {
	// compare for other operation
	var curOp = operationMap[opName];
	var top = opStack[opStack.length - 1];
	if (operationMap[top].priority >= curOp.priority) {
		computeOperation(opStack, valueStack, operationMap);
	}
	opStack.push(opName);
};

var finish = function finish(opStack, valueStack, operationMap) {
	while (opStack.length) {
		computeOperation(opStack, valueStack, operationMap);
	}

	if (valueStack.length !== 1) throw new Error("There are not one value in stack.");
};

var computeOperation = function computeOperation(opStack, valueStack, operationMap) {
	if (opStack.length === 0) {
		return;
	}
	var top = opStack.pop();
	var operation = operationMap[top];
	operation.opNum = operation.opNum || 0;
	if (operation.opNum > valueStack.length) {
		throw new Error("missing value for operation " + top);
	}
	var opVs = [];
	for (var i = 0; i < operation.opNum; i++) {
		var value = valueStack.pop();
		opVs.unshift(value);
	}
	var val = operation.execute.apply(undefined, opVs);
	valueStack.push(val);
};

var isMatchedStart = function isMatchedStart(opName, closeName, operationMap) {
	return operationMap[closeName].match === opName;
};

var isStartBlanket = function isStartBlanket(opName, operationMap) {
	return operationMap[opName].type === "start";
};

var isEndBlanket = function isEndBlanket(opName, operationMap) {
	return operationMap[opName].type === "close";
};

exports["default"] = ast;
module.exports = exports["default"];