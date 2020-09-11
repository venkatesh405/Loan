import line from "./line";
import Node from "./Node";
import releaser from "./releaser";
import TypeChecker from "typevalidator";

var typeChecker = TypeChecker();

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

var validateMap = searchMap => {
    for (let name in searchMap) {
        let searchRules = searchMap[name];
        validateRules(name, searchRules);
    }
}

var validateRules = (name, searchRules) => {
    typeChecker.check("array", searchRules);
    for (let i = 0; i < searchRules.length; i++) {
        let searchRule = searchRules[i];
        checkSearchRule(name, searchRule);
    }
}

var checkSearchRule = (name, searchRule) => {
    typeChecker.check("string & truthy", name);
    typeChecker.check("pureObj", searchRule);
    typeChecker.check("function", searchRule.filter);
    typeChecker.check("number", searchRule.dis);
}

var addSearchRule = (searchMap, name, searchRule) => {
    checkSearchRule(name, searchRule);
    searchMap[name] = searchMap[name] || [];
    searchMap[name].push(searchRule);
}

var setSearchRules = (searchMap, name, searchRules) => {
    validateRules(name, searchRules);
    searchMap[name] = searchRules;
}

var searchByType = (refer, searchRules, cb) => {
    let res = [];
    if (searchRules) {
        for (let i = 0; i < searchRules.length; i++) {
            let {
                filter, dis
            } = searchRules[i];
            let target = line.search(refer, filter, dis);
            let data = target && target.getData();
            res.push(data);
        }
    }
    cb && cb(res);
}

var remove = (list, item) => {
    for (var i = 0; i < list.length; i++) {
        if (list[i] === item) {
            list.splice(i, 1);
            return list;
        }
    }
    return list;
}

var likePromise = v => v && typeof v === "object" &&
    typeof v.then === "function";


export default (searchMap = {}) => {
    validateMap(searchMap);
    var head = null;
    var waitList = [];

    var push = (data) => {
        let node = new Node(data);
        if (head) head.addNext(node);
        head = node;
    }

    /**
     * store data and return cared other data
     *
     * data : tos store
     * type : trigger which kind of search rules to search line
     * wait : delay search or not
     */
    var store = (data) => {
        push(data);
        let refer = head;
        return {
            search: (type, cb, wait) => search(type, cb, wait, refer),
            store
        };
    }

    var search = (type, cb, wait, refer = head) => {
        let searchRules = searchMap[type];
        if (typeof wait === "number") {
            waitList.push(refer);
            setTimeout(() => {
                remove(waitList, refer);
                searchByType(refer, searchRules, cb);
            }, wait);
        } else if (likePromise(wait)) {
            waitList.push(refer);
            wait.then(res => {
                remove(waitList, refer);
                searchByType(refer, searchRules, cb);
            });
        } else {
            searchByType(refer, searchRules, cb);
        }
        return {
            search,
            store
        };
    }

    //
    return {
        store,
        getLength: () => line.getLength(head),
        release: () => {
            releaser.release(waitList, head, searchMap);
        },
        addSearchRule: (name, searchRule) => addSearchRule(searchMap, name, searchRule),
        setSearchRules: (name, searchRules) => setSearchRules(searchMap, name, searchRules)
    }
}