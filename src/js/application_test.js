(function () {
    "use strict";

    require("chromedriver");
    var webdriver = require('selenium-webdriver');

    var http = require("http");
    var procfile = require("procfile");
    var fs = require("fs");
    var assert = require("../js/shared/assert");
    var child_process = require("child_process");
    var child;
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

            runCommand(function () {
                driver = new webdriver.Builder()
                    .withCapabilities(webdriver.Capabilities.chrome())
                    .build();
                done();
            });
        });

        after(function (done) {
            child.on("exit", function () {
                driver.quit().then(done);
            });
            child.kill();
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

            driver.then(function () {
                done();
            });
        });
    });

    function runCommand(callback) {
        var result = parseProcfile();
        child = child_process.spawn(result.command, result.options);

        child.stdout.setEncoding(UTF8);
        child.stdout.on("data", function (chunk) {
            if (chunk.trim() === "Server started.") callback();
        });

        child.stderr.setEncoding(UTF8);
        child.stderr.on("data", function (chunk) {
            console.log(chunk);
        });
    }

    function parseProcfile() {
        var heroku_procfile = fs.readFileSync("Procfile", UTF8);
        var parsed = procfile.parse(heroku_procfile);
        var web = parsed.web;
        web.options = web.options.map(function (element) {
            if (element === "$PORT") return PORT;
            else return element;
        });
        return web;
    }
}());