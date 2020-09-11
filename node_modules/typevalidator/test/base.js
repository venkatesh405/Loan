import assert from "assert";
import Typechecker from "../index";

describe("base", () => {
    it("base type", (done) => {
        let typechecker = Typechecker();
        typechecker.check("string", "ssad");
        typechecker.check("undefined", undefined);
        typechecker.check("function", () => {});

        try {
            typechecker.check("number", () => {});
        } catch (err) {
            assert(err.toString().indexOf("type checking fail") !== -1, true);
            done();
        }
    });

    it("compose", (done) => {
        let typechecker = Typechecker();
        typechecker.check("string | number", "ssad");
        typechecker.check("string | number", 123);
        typechecker.check("(~object & ~string) | null", () => {});
        typechecker.check("(~object & ~string) | null", undefined);

        try {
            typechecker.check("(~object & ~string) | null", {});
        } catch (err) {
            assert(err.toString().indexOf("type checking fail") !== -1, true);
            done();
        }
    });

    it("checkbatch", () => {
        let typechecker = Typechecker();
        typechecker.checkBatch(["(~object & ~string) | null", "any"], [() => {}]);
    });

    it("self definition", (done) => {
        let typechecker = Typechecker({
            "myType": v => typeof v === "number" && v > 10
        });

        typechecker.check("myType", 100);
        try {
            typechecker.check("myType", null);
        } catch (err) {
            assert(err.toString().indexOf("type checking fail") !== -1, true);
            done();
        }
    });
});