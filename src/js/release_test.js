(function () {
    "use strict";

    var http = require("http");
    var assert = require("../js/shared/assert");

    var HTTP_GET_OPTIONS = {
        protocol: "http:",
        host: "calm-bayou-59937.herokuapp.com"
    };

    var UTF8 = "utf8";

    describe("Release test", function () {

        it("test home page was displayed", function (done) {
            HTTP_GET_OPTIONS.path = "/";
            var result = http.get(HTTP_GET_OPTIONS);

            result.on("response", function (response) {
                assert.equal(response.statusCode, 200);

                response.setEncoding(UTF8);
                response.on("data", function (chunk) {
                    assert.notEqual(chunk.indexOf("WeeWikiPaint Homepage Watermark"), -1);
                    done();
                });
            });
        });
    });
}());