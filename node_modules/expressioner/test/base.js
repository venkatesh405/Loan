import ast from "../index.js";
import assert from "assert";

describe("base ast", () => {
    it("base", () => {
        let com = ast({
            "+": {
                priority: 10,
                opNum: 2,
                execute: (a, b) => {
                    return Number(a) + Number(b);
                }
            },
            "-": {
                priority: 10,
                opNum: 2,
                execute: (a, b) => {
                    return Number(a) - Number(b);
                }
            }
        });
        assert.equal(com(" 3 + 4 - 2 ").value, 5);
    });

    it("priority", () => {
        let com = ast({
            "+": {
                priority: 10,
                opNum: 2,
                execute: (a, b) => {
                    return Number(a) + Number(b);
                }
            },
            "-": {
                priority: 10,
                opNum: 2,
                execute: (a, b) => {
                    return Number(a) - Number(b);
                }
            },
            "*": {
                priority: 20,
                opNum: 2,
                execute: (a, b) => {
                    return Number(a) * Number(b);
                }
            }
        });

        assert.equal(com(" 3 + 2 * 10 ").value, 23);
    });

    it("Error: missing value for op", () => {
        let com = ast({
            "+": {
                priority: 10,
                opNum: 2,
                execute: (a, b) => {
                    return Number(a) + Number(b);
                }
            },
            "-": {
                priority: 10,
                opNum: 2,
                execute: (a, b) => {
                    return Number(a) - Number(b);
                }
            },
            "*": {
                priority: 20,
                opNum: 2,
                execute: (a, b) => {
                    return Number(a) * Number(b);
                }
            }
        });
        try {
            com(" 3 + 2 * ");
        } catch (e) {
            console.log(e.toString());
        }
    });

    it("blanket", () => {
        let com = ast({
            "+": {
                priority: 10,
                opNum: 2,
                execute: (a, b) => {
                    return Number(a) + Number(b);
                }
            },
            "-": {
                priority: 10,
                opNum: 2,
                execute: (a, b) => {
                    return Number(a) - Number(b);
                }
            },
            "*": {
                priority: 20,
                opNum: 2,
                execute: (a, b) => {
                    return Number(a) * Number(b);
                }
            },
            "(": {
                type: "start"
            },
            ")": {
                type: "close",
                match: "("
            }
        });
        assert.equal(com(" (3 + 2) * 10").value, 50);
    });

    it("blanket2", () => {
        let com = ast({
            "+": {
                priority: 10,
                opNum: 2,
                execute: (a, b) => {
                    return Number(a) + Number(b);
                }
            },
            "-": {
                priority: 10,
                opNum: 2,
                execute: (a, b) => {
                    return Number(a) - Number(b);
                }
            },
            "*": {
                priority: 20,
                opNum: 2,
                execute: (a, b) => {
                    return Number(a) * Number(b);
                }
            },
            "(": {
                type: "start"
            },
            ")": {
                type: "close",
                match: "("
            }
        });
        assert.equal(com(" 3 + (2 * 10 - (5 + 6))").value, 12);
    });

    it("++", () => {
        let com = ast({
            "+": {
                priority: 10,
                opNum: 2,
                execute: (a, b) => {
                    return Number(a) + Number(b);
                }
            },
            "-": {
                priority: 10,
                opNum: 2,
                execute: (a, b) => {
                    return Number(a) - Number(b);
                }
            },
            "*": {
                priority: 20,
                opNum: 2,
                execute: (a, b) => {
                    return Number(a) * Number(b);
                }
            },
            "++": {
                priority: 40,
                opNum: 1,
                execute: (a) => {
                    return Number(a) + 1;
                }
            },
            "(": {
                type: "start"
            },
            ")": {
                type: "close",
                match: "("
            }
        });
        assert.equal(com(" 3 + (2 * 4)++").value, 12);
    });
});