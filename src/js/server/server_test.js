(function () {
    "use strict";

    var assert = require("../shared/assert.js");
    var server = require("./server.js");
    var http = require("http");
    var fs = require("fs");

    var TEST_DIRECTORY = "generated/test";
    var TEST_HOME_PAGE = TEST_DIRECTORY + "/index.html";
    var TEST_404_PAGE = TEST_DIRECTORY + "/404.html";
    var TEST_HOME_PAGE_CONTENTS = "Test home page contents.";
    var TEST_404_PAGE_CONTENTS = "Test 404 page contents.";
    var PORT = 7070;

    var HTTP_GET_OPTIONS = {
        protocol: "http:",
        host: "localhost",
        port: PORT
    };

    describe('Server should', function () {

        before(function (done) {
            fs.writeFileSync(TEST_HOME_PAGE, TEST_HOME_PAGE_CONTENTS);
            fs.writeFileSync(TEST_404_PAGE, TEST_404_PAGE_CONTENTS);
            server.start(TEST_HOME_PAGE, TEST_404_PAGE, PORT, function () {
                done();
            });
        });

        after(function (done) {
            server.stop();
            fs.unlinkSync(TEST_HOME_PAGE);
            fs.unlinkSync(TEST_404_PAGE);
            assert.ok(!fs.existsSync(TEST_HOME_PAGE), "Could not delete test file [" + TEST_HOME_PAGE + "]");
            done();
        });

        it("respond with homepage with request to '/'", function (done) {
            HTTP_GET_OPTIONS.path = "/";
            var result = http.get(HTTP_GET_OPTIONS);

            result.on("response", function (response) {
                assert.equal(response.statusCode, 200);

                response.setEncoding("utf8");
                response.on("data", function (chunk) {
                    assert.equal(TEST_HOME_PAGE_CONTENTS, chunk);
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

                response.setEncoding("utf8");
                response.on("data", function (chunk) {
                    assert.equal(TEST_404_PAGE_CONTENTS, chunk);
                    done();
                });
            });
        });

        it("run callback when stop completes", function (done) {
            server.stop(function () {
                done();
            });
        });
    });
}());