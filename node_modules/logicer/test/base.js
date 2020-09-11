import logic from "../index.js";
import assert from "assert";

describe("base", () => {
    it("base", () => {
        let logicCom = logic({
            "test1": () => true,
            "test2": () => false
        });

        let newF1 = logicCom.translate("test1 | test2");
        let newF2 = logicCom.translate("test1 & test2");
        let newF3 = logicCom.translate("~test2");
        assert(newF1() === true, true);
        assert(newF2() === false, true);
        assert(newF3() === true, true);
    });

    it("single", () => {
        let logicCom = logic({
            "test": () => true
        });
        let newF = logicCom.translate("test");
        assert(newF() === true, true);
    });

    it("blanket", () => {
        let logicCom = logic({
            "a": a => false,
            "b": a => false,
            "c": a => !!a,
            "d": a => !a
        });

        let strOrNum = logicCom.translate("a | (~b & (c | d))");

        assert(strOrNum(10) === true, false);
    });

    it("logicmap", () => {
        let logicCom = logic({
            a: a => false,
            b: a => true,
            "c": a => !!a
        });
        let strOrNum = logicCom.translate("a | (~b & c)");
        assert(strOrNum(10) === false, false);
    });
});