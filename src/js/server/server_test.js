(function () {
    "use strict";

    var assert = require("../shared/assert.js");
    var server = require("./server.js");
    var http = require("http");
    var fs = require("fs");


    var TEST_DIRECTORY = "generated/test";
    var TEST_HOME_PAGE = TEST_DIRECTORY + "/index.html";
    var TEST_HOME_PAGE_CONTENTS = "Test home page contents.";
    var TEST_404_PAGE = TEST_DIRECTORY + "/404.html";
    var TEST_404_PAGE_CONTENTS = "Test 404 page contents.";

    var CLIENT_DIRECTORY = "src/js/client";
    var CLIENT_JS = "/client.js";
    var SOURCE_CLIENT_JS = CLIENT_DIRECTORY + CLIENT_JS;
    var TEST_CLIENT_JS = TEST_DIRECTORY + CLIENT_JS;

    var THIRD_PARTY_DIRECTORY = "third-party";
    var JQUERY_JS = "/jquery-3.3.1.js";
    var SOURCE_JQUERY_JS = THIRD_PARTY_DIRECTORY + JQUERY_JS;
    var TEST_JQUERY_JS = TEST_DIRECTORY + JQUERY_JS;
    var RAPHAEL_JS = "/raphael-2.2.1.js";
    var SOURCE_RAPHAEL_JS = THIRD_PARTY_DIRECTORY + RAPHAEL_JS;
    var TEST_RAPHAEL_JS = TEST_DIRECTORY + RAPHAEL_JS;
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
            fs.copyFileSync(SOURCE_CLIENT_JS, TEST_CLIENT_JS);
            fs.copyFileSync(SOURCE_JQUERY_JS, TEST_JQUERY_JS);
            fs.copyFileSync(SOURCE_RAPHAEL_JS, TEST_RAPHAEL_JS);
            server.start(TEST_DIRECTORY, TEST_404_PAGE, PORT, function () {
                done();
            });
        });

        after(function (done) {
            server.stop();
            fs.unlinkSync(TEST_HOME_PAGE);
            fs.unlinkSync(TEST_404_PAGE);
            fs.unlinkSync(TEST_CLIENT_JS);
            fs.unlinkSync(TEST_JQUERY_JS);
            fs.unlinkSync(TEST_RAPHAEL_JS);
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

        it("respond with client.js with request to '/client.js'", function (done) {
            HTTP_GET_OPTIONS.path = "/client.js";
            var result = http.get(HTTP_GET_OPTIONS);

            result.on("response", function (response) {
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it("respond with jquery-3.3.1.js with request to '/jquery-3.3.1.js'", function (done) {
            HTTP_GET_OPTIONS.path = "/jquery-3.3.1.js";
            var result = http.get(HTTP_GET_OPTIONS);

            result.on("response", function (response) {
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it("respond with raphael-2.2.1.js with request to '/raphael-2.2.1.js'", function (done) {
            HTTP_GET_OPTIONS.path = "/raphael-2.2.1.js";
            var result = http.get(HTTP_GET_OPTIONS);

            result.on("response", function (response) {
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it("respond with 404.html to any request not explicitly defined", function (done) {
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