/**
 * expresion combined by two kinds of nodes: operations and values
 *
 * operations contains two type
 * (1) block area which has a start and a close operation
 * (2) simple operation
 */

import findOp from "./findOp";

var ast = (operationMap) => (str) => {
	if (typeof str !== "string")
		throw new TypeError("unexpected value to parse.");
	let opStack = [],
		valueStack = [],
		tmpStr = "";
	for (let i = 0; i < str.length; i++) {
		let ch = str[i];
		let opName = findOp(str, i, operationMap);
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
	}
}

var pushOp = (opName, opStack, valueStack, operationMap) => {
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
}

var comparePriority = (opName, opStack, valueStack, operationMap) => {
	// compare for other operation
	let curOp = operationMap[opName];
	let top = opStack[opStack.length - 1];
	if (operationMap[top].priority >= curOp.priority) {
		computeOperation(opStack, valueStack, operationMap);
	}
	opStack.push(opName);
}

var finish = (opStack, valueStack, operationMap) => {
	while (opStack.length) {
		computeOperation(opStack, valueStack, operationMap);
	}

	if (valueStack.length !== 1)
		throw new Error("There are not one value in stack.");
}

var computeOperation = (opStack, valueStack, operationMap) => {
	if (opStack.length === 0) {
		return;
	}
	let top = opStack.pop();
	let operation = operationMap[top];
	operation.opNum = operation.opNum || 0;
	if (operation.opNum > valueStack.length) {
		throw new Error("missing value for operation " + top);
	}
	let opVs = [];
	for (let i = 0; i < operation.opNum; i++) {
		let value = valueStack.pop();
		opVs.unshift(value);
	}
	let val = operation.execute.apply(undefined, opVs);
	valueStack.push(val);
}

var isMatchedStart = (opName, closeName, operationMap) =>
	operationMap[closeName].match === opName;

var isStartBlanket = (opName, operationMap) => operationMap[opName].type === "start";

var isEndBlanket = (opName, operationMap) => operationMap[opName].type === "close";

export default ast;