import Forwardline from "../index";
import assert from "assert";

describe("forwardline", () => {
    it("base", () => {
        let forward = Forwardline({
            "type1": [{
                filter: [
                    [{
                        name: "type",
                        type: "in",
                        value: ["a", "b"]
                    }]
                ],
                dis: 1
            }]
        });

        forward.store({
            type: "a"
        }, "type1", res => {});
        forward.store({
            type: "c"
        }, "type1", res => {
            assert.equal(res.length, 1);
            assert.equal(res[0].type, "a");
        });
        forward.store({
            type: "b"
        }, "type1", res => {
            assert.equal(res.length, 1);
            assert.equal(res[0].type, "a");
        });
    })

    it("addSearchRule", () => {
        let forward = Forwardline();

        forward.addSearchRule("type1", {
            filter: [
                [{
                    name: "type",
                    type: "in",
                    value: ["a", "b"]
                }]
            ],
            dis: 1
        });

        forward.store({
            type: "a"
        }, "type1", res => {});
        forward.store({
            type: "c"
        }, "type1", res => {
            assert.equal(res.length, 1);
            assert.equal(res[0].type, "a");
        });
        forward.store({
            type: "b"
        }, "type1", res => {
            assert.equal(res.length, 1);
            assert.equal(res[0].type, "a");
        });
    })

    it("setSearchRules", () => {
        let forward = Forwardline();

        forward.addSearchRule("type1", {
            filter: [
                [{
                    name: "type",
                    type: "in",
                    value: ["c"]
                }]
            ],
            dis: 1
        });

        forward.setSearchRules("type1", [{
            filter: [
                [{
                    name: "type",
                    type: "in",
                    value: ["a", "b"]
                }]
            ],
            dis: 1
        }]);

        forward.store({
            type: "a"
        }).search("type1", res => {}).store({
            type: "c"
        }).search("type1", res => {
            assert.equal(res.length, 1);
            assert.equal(res[0].type, "a");
        }).store({
            type: "b"
        }).search("type1", res => {
            assert.equal(res.length, 1);
            assert.equal(res[0].type, "a");
        });
    })

    it("base", () => {
        let forward = Forwardline({
            "type1": [{
                filter: [
                    [{
                        name: "type",
                        type: "equal",
                        value: "a"
                    }]
                ],
                dis: 1
            }]
        });

        forward.store({
            type: "a"
        }).search("type1", res => {}).store({
            type: "c"
        }).search("type1", res => {
            assert.equal(res.length, 1);
            assert.equal(res[0].type, "a");
        }).store({
            type: "b"
        }).search("type1", res => {
            assert.equal(res.length, 1);
            assert.equal(res[0].type, "a");
        });
    })

    it("base", () => {
        let forward = Forwardline({
            "type1": [{
                filter: [
                    [{
                        name: "type",
                        type: "regular",
                        value: /number/
                    }]
                ],
                dis: 1
            }]
        });

        forward.store({
            type: "number"
        }).search("type1", res => {}).store({
            type: "2c"
        }).search("type1", res => {
            assert.equal(res.length, 1);
            assert.equal(res[0].type, "number");
        }).store({
            type: "2b"
        }).search("type1", res => {
            assert.equal(res.length, 1);
            assert.equal(res[0].type, "number");
        });
    })

    it("filter multi", () => {
        let forward = Forwardline({
            "type1": [{
                filter: [
                    [{
                        name: "type",
                        type: "regular",
                        value: /number/
                    }, {
                        name: "from",
                        value: "a"
                    }]
                ],
                dis: 1
            }, {
                filter: [
                    [{
                        name: "from",
                        value: "b"
                    }]
                ],
                dis: 1
            }]
        });

        forward.store({
            type: "number",
            from: "a"
        }).search("type1", res => {}).store({
            type: "2c",
            from: "b"
        }).search("type1", res => {
            assert.equal(res.length, 2);
            assert.equal(res[0].type, "number");
            assert.equal(res[1], undefined);

        }).store({
            type: "2b"
        }).search("type1", res => {
            assert.equal(res.length, 2);
            assert.equal(res[0].type, "number");
            assert.equal(res[1].from, "b");
        });
    })

    it("filter |", () => {
        let forward = Forwardline({
            "type1": [{
                filter: [
                    [{
                        name: "type",
                        type: "regular",
                        value: /number/
                    }, {
                        name: "from",
                        value: "a"
                    }],
                    [{
                        name: "from",
                        value: "b"
                    }]
                ],
                dis: 1
            }]
        });

        forward.store({
            type: "number",
            from: "a"
        }).search("type1", res => {}).store({
            type: "2c",
            from: "b"
        }).search("type1", res => {
            assert.equal(res.length, 1);
            assert.equal(res[0].type, "number");

        }).store({
            type: "2b"
        }).search("type1", res => {
            assert.equal(res.length, 1);
            assert.equal(res[0].type, "2c");
        });
    })

})