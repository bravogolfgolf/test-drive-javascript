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

    var HTTP_GET_OPTIONS = {
        protocol: "http:",
        host: "localhost",
        port: PORT
    };

    describe('Server should', function () {

        before(function (done) {
            fs.writeFileSync(TEST_FILE, FILE_CONTENTS);
            server.start(TEST_FILE, PORT);
            done();
        });

        after(function (done) {
            server.stop();
            fs.unlinkSync(TEST_FILE);
            assert.ok(!fs.existsSync(TEST_FILE), "Could not delete test file [" + TEST_FILE + "]");
            done();
        });

        it("respond with homepage with request to '/'", function (done) {
            HTTP_GET_OPTIONS.path = "/";
            var result = http.get(HTTP_GET_OPTIONS);

            result.on("response", function (response) {
                assert.equal(response.statusCode, 200);

                response.setEncoding("utf8");
                response.on("data", function (chunk) {
                    assert.equal(FILE_CONTENTS, chunk);
                    done();
                });
            });
        });

        it("respond with homepage with request to '/index.html'", function (done) {
            HTTP_GET_OPTIONS.path = "/index.html";
            var result = http.get(HTTP_GET_OPTIONS);

            result.on("response", function (response) {
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it("respond with 404.html to any request except to '/' and '/index.html", function (done) {
            HTTP_GET_OPTIONS.path = "/junk";
            var result = http.get(HTTP_GET_OPTIONS);

            result.on("response", function (response) {
                assert.equal(response.statusCode, 404);
                done();
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