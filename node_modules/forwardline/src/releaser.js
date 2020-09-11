import line from "./line";

var release = (waitList, head, searchMap) => {
    let lastest = head;
    if (waitList.length > 0) {
        lastest = waitList[0];
    }
    releaseOld(lastest, searchMap);
    releaseNew(waitList, head, searchMap);
}

var releaseNew = (waitList, head, searchMap) => {
    let next = waitList[0] && waitList[0].getNext();
    while (next && next !== head) {
        let should = false;
        if (!contain(waitList, next) &&
            outofSearchRules(head, next, searchMap)) {
            let counter = 0;
            for (let i = 0; i < waitList.length; i++) {
                if (!outofSearchRules(waitList[i], next, searchMap)) {
                    break;
                } else {
                    counter++;
                }
            }
            if (counter == waitList.length) should = true;
        }
        let far = next.getNext();
        if (should) {
            next.remove();
        }
        next = far;
    }
}

var releaseOld = (refer, searchMap) => {
    let target = refer.getPrev();
    while (target) {
        let next = target.getPrev();
        if (outofSearchRules(refer, target, searchMap)) {
            target.remove();
        }
        target = next;
    }
}

var outofSearchRules = (refer, target, searchMap) => {
    for (let name in searchMap) {
        let searchRules = searchMap[name];
        for (let i = 0; i < searchRules.length; i++) {
            let { filter, dis } = searchRules[i];
            let res = line.outofSearch(refer, target, filter, dis);
            if (!res) return false;
        }
    }
    return true;
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
    release
}