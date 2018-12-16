(function () {
    "use strict";

    var assert = require("../shared/assert.js");
    var server = require("./server.js");
    var http = require("http");

    var PORT = 8080;

    describe('Server should', function () {

        beforeEach(function (done) {
            server.start(PORT);
            done();
        });

        afterEach(function (done) {
            server.stop();
            done();
        });

        it('respond to get request', function (done) {
            http.get({protocol: "http:", host: "localhost", port: PORT}, function (response) {
                assert.equal(response.statusCode, 200);
                done();
            });
        });
    });
}());