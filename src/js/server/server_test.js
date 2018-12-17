(function () {
    "use strict";

    var assert = require("../shared/assert.js");
    var server = require("./server.js");
    var http = require("http");
    var fs = require("fs");

    var PORT = 8080;

    describe('Server should', function () {

        before(function (done) {
            server.start(PORT);
            done();
        });

        after(function (done) {
            server.stop();
            done();
        });

        it('respond successfully to proper GET request with html file', function (done) {

            var testDirectory = "generated/test";
            var testFile = testDirectory + "/test.html";
            var testData = "Test data from file.";
            fs.writeFileSync(testFile, testData);

            var result = http.get({protocol: "http:", host: "localhost", port: PORT});

            result.on("response", function (response) {
                assert.equal(response.statusCode, 200);

                var dataReceived = false;
                response.setEncoding("utf8");
                response.on("data", function (chunk) {
                    dataReceived = true;
                    assert.equal(testData, chunk);
                });

                response.on("end", function () {
                    assert.ok(dataReceived);
                    done();
                });
            });
        });
    });

    describe('Server should', function () {
        it("throw error when port number is missing", function () {
            assert.throws(
                function () {
                    server.start();
                },
                Error,
                "Port number is required.");
        });


        it("run callback when stop completes", function (done) {
            server.start(PORT);
            server.stop(function () {
                done();
            });
        });
    });
}());