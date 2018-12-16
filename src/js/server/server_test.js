(function () {
    "use strict";

    var assert = require("../shared/assert.js");
    var server = require("./server.js");
    var http = require("http");


    describe('Server should', function () {

        beforeEach(function (done) {
            server.start();
            done();
        });

        afterEach(function (done) {
            server.stop();
            done();
        });

        it('respond to get request', function (done) {
            http.get({protocol: "http:", host: "localhost", port: 8080}, function (response) {
                assert.equal(response.statusCode, 200);
                done();
            });
        });
    });
}());