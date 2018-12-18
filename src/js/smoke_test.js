(function () {
    "use strict";

    var assert = require("../js/shared/assert");
    var http = require("http");
    var child_process = require("child_process");
    var child;
    var PORT = 8080;
    var HTTP_GET_OPTIONS = {
        protocol: "http:",
        host: "localhost",
        port: PORT
    };

    describe("Smoke test", function () {

        before(function (done) {
            runCommand(function () {
                done();
            });
        });

        after(function (done) {
            child.on("exit", function () {
                done();
            });
            child.kill();
        });


        it("start server and test home page was displayed", function (done) {
            HTTP_GET_OPTIONS.path = "/";
            var result = http.get(HTTP_GET_OPTIONS);

            result.on("response", function (response) {
                assert.equal(response.statusCode, 200);

                response.setEncoding("utf8");
                response.on("data", function (chunk) {
                    assert.notEqual(chunk.indexOf("WeeWikiPaint Homepage Watermark"), -1);
                    done();
                });
            });
        });

        it("start server and test 404 page was displayed", function (done) {
            HTTP_GET_OPTIONS.path = "/junk";
            var result = http.get(HTTP_GET_OPTIONS);

            result.on("response", function (response) {
                assert.equal(response.statusCode, 404);

                response.setEncoding("utf8");
                response.on("data", function (chunk) {
                    assert.notEqual(chunk.indexOf("WeeWikiPaint 404 page Watermark"), -1);
                    done();
                });
            });
        });

    });

    function runCommand(callback) {
        child = child_process.spawn("node", ["src/js/server/weewikipaint", PORT]);

        child.stdout.setEncoding("utf8");
        child.stdout.on("data", function (chunk) {
            if (chunk.trim() === "Server started.") callback();
        });

        child.stderr.setEncoding("utf8");
        child.stderr.on("data", function (chunk) {
            console.log(chunk);
        });
    }
}());