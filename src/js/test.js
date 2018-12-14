(function () {
    "use strict";

    var chai = require("chai").assert;

    assert.equal(add(3, 4), 7);

    function add(a, b) {
        return a + b;
    }

}());