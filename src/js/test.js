(function () {
    "use strict";

    var chai = require("chai").assert;


    describe("Arithmetic", function () {
        it("adds two numbers", function () {
            assert.equal(add(3, 4), 7);
        });
    });

    function add(a, b) {
        return a + b;
    }

}());