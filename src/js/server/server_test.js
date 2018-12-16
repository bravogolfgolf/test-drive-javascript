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

        it('respond successfully to proper GET request with status code 200 and data', function (done) {
            var result = http.get({protocol: "http:", host: "localhost", port: PORT});

            result.on("response", function (response) {
                assert.equal(response.statusCode, 200);

                var dataReceived = false;
                response.setEncoding("utf8");
                response.on("data", function (chunk) {
                    dataReceived = true;
                    assert.equal("Test data", chunk);
                });

                response.on("end", function () {
                    assert.ok(dataReceived);
                    done();
                });
            });
        });
    });
}());