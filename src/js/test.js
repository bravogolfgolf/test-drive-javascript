(function () {
    "use strict";

    describe("Arithmetic", function () {
        it("adds two numbers", function () {
            assertEquals(add(3, 4), 7);
        });
    });

    function assertEquals(actual, expected) {
        if (actual !== expected) throws
        new Error("Actual was" + actual + ", but expected: " + expected);

    }

    function add(a, b) {
        return a + b;
    }

}());