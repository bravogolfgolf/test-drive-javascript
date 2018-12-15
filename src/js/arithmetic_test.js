(function () {
    "use strict";

    var assert = require("../third-party/chai-4.2.0.js").assert;
    var arithmetic = require("./arithmetic.js");

    describe("Arithmetic", function () {
        it("adds two numbers", function () {
            assert.equal(arithmetic.add(3, 4), 7);
        });
    });
}());