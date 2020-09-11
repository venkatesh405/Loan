var findOp = (str, index, operationMap) => {
	let chr = str[index];
	let opNames = filterOpNames(chr, operationMap);
	let machNames = [];

	if (opNames.length) {
		for (let i = 0; i < opNames.length; i++) {
			let opName = opNames[i];
			let opObject = operationMap[opName];
			if (matchOperation(opName, opObject, str, index)) {
				machNames.push(opName);
			}
		}
	}

	// match the longest one.
	if (machNames.length) {
		let res = "";
		for (let j = 0; j < machNames.length; j++) {
			if (machNames[j].length > res.length) res = machNames[j];
		}
		return res;
	}
	return undefined;
}

var matchOperation = (opName, opObject, str, index) => {
	if (index > 0) {
		let last = str[index - 1];
		if (opObject.needBeforeSpace) {
			if (!isBlank(last)) {
				return false;
			}
		}
	}
	if (index + opName.length <= str.length) {
		let sub = str.substring(index, index + opName.length);
		if (sub !== opName) return false;
		if (opObject.needAfterSpace && str.length > index + opName.length) {
			let last = str[index + opName.length];
			if (!isBlank(last)) {
				return false;
			}
		}
	} else {
		return false;
	}
	return true;
}

var filterOpNames = (chr, operationMap) => {
	let names = [];
	for (let name in operationMap) {
		if (name.startsWith(chr)) {
			names.push(name);
		}
	}
	return names;
}

var isBlank = (chr) => /^\s$/.test(chr);

export default findOp;