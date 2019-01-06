(function () {
    "use strict";

    require("chromedriver");

    var assert = require("../js/shared/assert");
    var server = require("./_run_server.js");

    var webdriver = require('selenium-webdriver');
    var http = require("http");

    var serverProcess;
    var PORT = 5000;
    var HTTP_GET_OPTIONS = {
        protocol: "http:",
        host: "localhost",
        port: PORT
    };
    var WEE_WIKI_PAINT = HTTP_GET_OPTIONS.protocol + "//" + HTTP_GET_OPTIONS.host + ":" + HTTP_GET_OPTIONS.port;
    var driver;
    var UTF8 = "utf8";

    describe("Application should", function () {

        before(function (done) {

            server.run(function (process) {
                serverProcess = process;
                driver = new webdriver.Builder()
                    .withCapabilities(webdriver.Capabilities.chrome())
                    .build();
                done();
            });
        });

        after(function (done) {
            serverProcess.on("exit", function () {
                driver.quit().then(done);
            });
            serverProcess.kill();
        });

        it("should display home page", function (done) {
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

        it("display 404 page", function (done) {
            HTTP_GET_OPTIONS.path = "/junk";
            var result = http.get(HTTP_GET_OPTIONS);

            result.on("response", function (response) {
                assert.equal(response.statusCode, 404);

                response.setEncoding(UTF8);
                response.on("data", function (chunk) {
                    assert.notEqual(chunk.indexOf("WeeWikiPaint 404 page Watermark"), -1);
                    done();
                });
            });
        });

        it("draw line in drawing area", function (done) {
            driver.get(WEE_WIKI_PAINT);

            var drawingArea = driver.findElement(webdriver.By.id("drawingArea"));

            driver.actions()
                .mouseMove(drawingArea, {x: 50, y: 50})
                .mouseDown()
                .mouseMove({x: 80, y: 80})
                .mouseUp()
                .perform();

            driver.executeScript(function () {
                var client = require("./client.js");
                return client.drawingAreaCanvas.lineSegments();
            }).then(function (lineSegments) {
                assert.deepEqual(lineSegments, [[50, 50, 130, 130]], "Selenium draw line failed");
            });

            driver.controlFlow().execute(done);
        });
    });
}());