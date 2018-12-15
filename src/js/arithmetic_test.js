(function () {
    "use strict";

    var arithmetic = require("./arithmetic.js");
    var assert = require("./assert.js");

    describe("Arithmetic", function () {
        it("adds two numbers", function () {
            assert.equal(arithmetic.add(3, 4), 7);
        });
    });
}());