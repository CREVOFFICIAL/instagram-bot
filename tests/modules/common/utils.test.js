const assert = require("assert");

describe("Utils", function () {
    describe("#compute_interval_between_run()", function () {
        it("should compute interval between run correctly", function () {
            const config = require("./../../config.test");
            const utils = require("./../../../modules/common/utils")(null, null, config);
            assert.equal(utils.compute_interval_between_run_in_seconds(10), 1584);
            assert.equal(utils.compute_interval_between_run_in_seconds(100), 159);
            assert.equal(utils.compute_interval_between_run_in_seconds(1000), 16);
            assert.throws(() => utils.compute_interval_between_run_in_seconds(-1), Error, "target_count_per_day must be positive");
        });
    });
});