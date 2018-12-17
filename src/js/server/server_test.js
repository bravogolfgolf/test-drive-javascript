(function () {
    "use strict";

    var assert = require("../shared/assert.js");
    var server = require("./server.js");
    var http = require("http");
    var fs = require("fs");

    var TEST_DIRECTORY = "generated/test";
    var TEST_FILE = TEST_DIRECTORY + "/test.html";
    var FILE_CONTENTS = "Test data from file.";
    var PORT = 8080;

    describe('Server should', function () {

        before(function (done) {
            server.start(TEST_FILE, PORT);
            done();
        });

        after(function (done) {
            server.stop();
            fs.unlinkSync(TEST_FILE);
            assert.ok(!fs.existsSync(TEST_FILE), "Could not delete test file [" + TEST_FILE + "]");
            done();
        });

        it('respond successfully to proper GET request with html file', function (done) {
            fs.writeFileSync(TEST_FILE, FILE_CONTENTS);

            var result = http.get({protocol: "http:", host: "localhost", port: PORT});

            result.on("response", function (response) {
                assert.equal(response.statusCode, 200);

                var dataReceived = false;
                response.setEncoding("utf8");
                response.on("data", function (chunk) {
                    dataReceived = true;
                    assert.equal(FILE_CONTENTS, chunk);
                });

                response.on("end", function () {
                    assert.ok(dataReceived);
                    done();
                });
            });
        });
    });

    describe('Server should', function () {

        beforeEach(function (done) {
            server.stop();
            done();
        });

        afterEach(function (done) {
            server.stop();
            done();
        });

        it("throw error when port number is missing", function () {
            assert.throws(
                function () {
                    server.start(TEST_FILE);
                },
                Error,
                "Port number is required.");
        });

        it("run callback when stop completes", function (done) {
            server.start(TEST_FILE, PORT);
            server.stop(function () {
                done();
            });
        });
    });
}());