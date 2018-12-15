(function () {
    "use strict";

    var arithmetic = require("./arithmetic.js");

    describe("Arithmetic", function () {
        it("adds two numbers", function () {
            assertEquals(arithmetic.add(3, 4), 7);
        });
    });

    function assertEquals(actual, expected) {
        if (actual !== expected) throw new Error("Actual was" + actual + ", but expected: " + expected);

    }
}());