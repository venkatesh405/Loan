import Forward from "../src/forward";
import assert from "assert";

describe("release", () => {
    it("base", (done) => {
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
        });
        forward.store(15).search("type1", res => {
            assert.equal(res.length, 2);
            assert.equal(res[0], undefined);
            assert.equal(res[1], undefined);
        });

        forward.store(17).search("type1", res => {
            assert.equal(res.length, 2);
            assert.equal(res[0], 15);
            assert.equal(res[1], undefined);
        });

        forward.store(18).search("type1", res => {
            assert.equal(res.length, 2);
            assert.equal(res[0], 17);
            assert.equal(res[1], 19);
            assert.equal(forward.getLength(), 4)
            done();
        }, 20);

        forward.store(19).search("type1", res => {
            assert.equal(res.length, 2);
            assert.equal(res[0], 18);
            assert.equal(res[1], undefined);
        });
        forward.store("abc").search("type1", res => {});
        
        forward.store(100).search("type1", res => {
            assert.equal(res.length, 2);
            assert.equal(res[0], 19);
            assert.equal(res[1], undefined);
        });

        forward.release();
    })
})