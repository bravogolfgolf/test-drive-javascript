(function () {
    "use strict";

    var test = require('selenium-webdriver/testing');

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

    test.describe("Application should", function () {

        test.before(function (done) {
            runCommand(function () {
                done();
            });
        });

        test.after(function (done) {
            child.on("exit", function () {
                done();
            });
            child.kill();
        });

        test.it("draw line in drawing area", function () {

            var gecko = require("geckodriver");
            var webdriver = require('selenium-webdriver');

            new webdriver.Builder()
                .forBrowser('firefox')
                .build();
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