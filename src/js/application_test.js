/* globals webdriver:false */

(function () {
    "use strict";

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
    var UTF8 = "utf8";

    describe("Application should", function () {

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
            var webdriver = require("selenium-webdriver");
            var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.firefox()).build();
            driver.get("http://www.google.com");
            driver.findElement(webdriver.By.name("q")).sendKeys("webdriver");
            driver.findElement(webdriver.By.name("bthG")).click();
            driver.wait(function () {
                return driver.getTitle().then(function (title) {
                    return title === "webdriver - Google Search";
                });
            });

            // var firefox = require("selenium-webdriver/firefox");
            // var driver = new firefox.Driver();
            // var promise = driver.get("http://www.google.com");
            // console.log("before 'then' called?");
            // promise.then(function () {
            //     console.log("then called?");
            //     driver.quit();
            //     done();
            // });
            // promise.catch(function (reason) {
            //     console.log("Reason: " + reason);
            //     done();
            // });
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