import TypeChecker from "typevalidator";

var typeChecker = TypeChecker();

/**
 * type: equal, in, regular
 */
var getFilter = (matrix) => {
    typeChecker.check("array", matrix);

    let items = [];
    for (let i = 0; i < matrix.length; i++) {
        items.push(getAndFilter(matrix[i]));
    }
    return (data) => {
        for (let i = 0; i < items.length; i++) {
            if (items[i](data)) {
                return true;
            }
        }
        return false;
    }
}

var getAndFilter = (list) => {
    typeChecker.check("array", list);

    let items = [];
    for (let i = 0; i < list.length; i++) {
        items.push(getSingleFilter(list[i]));
    }
    return (data) => {
        for (let i = 0; i < items.length; i++) {
            if (!items[i](data)) {
                return false;
            }
        }
        return true;
    }
}

var getSingleFilter = (obj) => {
    let name = obj.name;
    let type = obj.type || "equal";
    let value = obj.value;

    if (type === "in") {
        typeChecker.check("array", value);
    } else if (type === "regular") {
        typeChecker.check("regExp", value);
    }

    return (data) => {
        if (name) data = data[name];
        if (type === "equal") return data === value;
        if (type === "in") return contain(value, data);
        if (type === "regular") return value.test(data);
    }
}

var contain = (list, item) => {
    for (var i = 0; i < list.length; i++) {
        if (list[i] === item) {
            return true;
        }
    }
    return false;
}

export default {
    getFilter
}