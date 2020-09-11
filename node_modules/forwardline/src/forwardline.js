import forward from "./forward";
import filter from "./filter";

import TypeChecker from "typevalidator";

var typeChecker = TypeChecker();

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

export default (searchMap) => {
    let forwardline = forward();

    let addSearchRule = (name, searchRule) => {
        typeChecker.check("string", name);
        typeChecker.check("pureObj", searchRule);
        typeChecker.check("array", searchRule.filter);
        searchRule.filter = filter.getFilter(searchRule.filter);
        forwardline.addSearchRule(name, searchRule);
    }
    for (let name in searchMap) {
        let searchRules = searchMap[name];
        typeChecker.check("array", searchRules);
        for (let i = 0; i < searchRules.length; i++) {
            let searchRule = searchRules[i];
            addSearchRule(name, searchRule);
        }
    }

    let setSearchRules = (name, searchRules) => {
        forwardline.setSearchRules(name, []);
        for (let i = 0; i < searchRules.length; i++) {
            addSearchRule(name, searchRules[i]);
        }
    }

    let setSearchRule = (name, searchRule) => {}
    return {
        store: forwardline.store,
        search: forwardline.search,
        getLength: forwardline.getLength,
        release: forwardline.release,
        addSearchRule,
        setSearchRules
    };
}