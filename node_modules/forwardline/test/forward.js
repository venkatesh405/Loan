import Forward from "../src/forward";
import assert from "assert";

describe("forward", () => {
    it("base", () => {
        let forward = Forward({
            "type1": [{
                filter: v => v > 10,
                dis: 1
            }]
        });

        forward.store(10).search("type1", res => {
            assert.equal(res.length, 1);
            assert.equal(res[0], undefined);
        }).store(11).search("type1", res => {
            assert.equal(res.length, 1);
            assert.equal(res[0], undefined);
        }).store(5).search("type1", res => {
            assert.equal(res.length, 1);
            assert.equal(res[0], 11);
        });
    })

    it("base 2", () => {
        let forward = Forward({
            "type1": [{
                filter: v => v > 10,
                dis: 1
            }],
            "type2": [{
                filter: v => typeof v === "string",
                dis: 2
            }]
        });

        forward.store("ok").
        search("type1", res => {}).
        store("why").
        search("type1", res => {}).
        store({}).
        search("type1", res => {}).
        store("one").
        search("type1", res => {}).
        store(5).search("type2", res => {
            assert.equal(res.length, 1);
            assert.equal(res[0], "why");
        });
    })

    it("getLength", () => {
        let forward = Forward({
            "type1": [{
                filter: v => v > 10,
                dis: 1
            }]
        });

        forward.store(10).search("type1", res => {}).
        store(11).search("type1", res => {}).
        store(5).search("type1", res => {});

        assert.equal(forward.getLength(), 3);
    })

    it("wait no", (done) => {
        let forward = Forward({
            "type1": [{
                filter: v => v > 10,
                dis: 1
            }, {
                filter: v => v > 10,
                dis: -1
            }]
        });

        forward.store("ok").search("type1", res => {
            assert.equal(res.length, 2);
            assert.equal(res[0], undefined);
            assert.equal(res[1], undefined);
        }).store(15).search("type1", res => {
            assert.equal(res.length, 2);
            assert.equal(res[0], undefined);
            assert.equal(res[1], undefined);
        }).store(17).search("type1", res => {
            assert.equal(res.length, 2);
            assert.equal(res[0], 15);
            assert.equal(res[1], undefined);
        }).store(18).search("type1", res => {
            assert.equal(res.length, 2);
            assert.equal(res[0], 17);
            assert.equal(res[1], 19);
            done();
        }, 20).store(19).search("type1", res => {
            assert.equal(res.length, 2);
            assert.equal(res[0], 18);
            assert.equal(res[1], undefined);
        });
    })

    it("wait promise", (done) => {
        let forward = Forward({
            "type1": [{
                filter: v => v > 10,
                dis: 1
            }, {
                filter: v => v > 10,
                dis: -1
            }]
        });

        forward.store("ok").search("type1", res => {
            assert.equal(res.length, 2);
            assert.equal(res[0], undefined);
            assert.equal(res[1], undefined);
        }).store(15).search("type1", res => {
            assert.equal(res.length, 2);
            assert.equal(res[0], undefined);
            assert.equal(res[1], undefined);
        }).store(17).search("type1", res => {
            assert.equal(res.length, 2);
            assert.equal(res[0], 15);
            assert.equal(res[1], undefined);
        }).store(18).search("type1", res => {
            assert.equal(res.length, 2);
            assert.equal(res[0], 17);
            assert.equal(res[1], 19);
            done();
        }, new Promise(r => {
            setTimeout(() => r(), 100);
        })).store(19).search("type1", res => {
            assert.equal(res.length, 2);
            assert.equal(res[0], 18);
            assert.equal(res[1], undefined);
        });
    })

    it("search async", (done) => {
        let forward = Forward({
            "type1": [{
                filter: v => v > 10,
                dis: 1
            }, {
                filter: v => v > 10,
                dis: -1
            }]
        });

        forward.store(9);
        forward.store(11).search("type1", res => {
            assert.equal(res.length, 2);
            assert.equal(res[0], undefined);
            assert.equal(res[1], 13);
            done();
        }, 50);
        forward.store(13).search("typeof", res => {
        }, 30)
    })
})