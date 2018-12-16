(function () {
    "use strict";

    var assert = require("../shared/assert.js");
    var server = require("./server.js");

    describe('Server should', function () {
        it('should return number', function () {
            assert.equal(3 , server.number());
        });
    });

}());