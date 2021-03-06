/* globals jake:false, desc:false, task:false, complete:false, fail:false, directory:false */

(function () {

    "use strict";

    var runCommand = require("./src/js/_run_server.js");

    var semver = require("semver");
    var jshint = require("simplebuild-jshint");
    var karma = require("simplebuild-karma");
    var shell = require("shelljs");
    var browserify = require("browserify");
    var fs = require("fs");
    var Mocha = require("mocha");

    var GENERATED_DIRECTORY = "generated";
    var GENERATED_CLIENT_DIRECTORY = GENERATED_DIRECTORY + "/client";
    var GENERATED_TEST_DIRECTORY = GENERATED_DIRECTORY + "/test";
    var KARMA_CONF_JS = "karma.conf.js";
    var EXPECTED_BROWSERS = [
        "Safari 12.0.2 (Mac OS X 10.14.2)",
        "Mobile Safari 12.0.0 (iOS 12.1.0)",
        "Chrome 71.0.3578 (Mac OS X 10.14.2)",
        "Firefox 64.0.0 (Mac OS X 10.14.0)",
        "IE 11.0.0 (Windows 7.0.0)",
        "Chrome Mobile 69.0.3497 (Android 0.0.0)"];

    desc("Start karma server");
    task("karma", function () {
        console.log("Running karma server:");
        karma.start({
            configFile: KARMA_CONF_JS
        }, complete, fail);
    }, {async: true});

    desc("Test Server and Client");
    task("default", ["testClient", "testServer", "testApp"], function () {
        console.log("\n\nBUILD OK");
    });

    desc("Check node version");
    task("version", function () {
        console.log("Checking node version:");

        var packageJson = require("./package.json");
        var EXPECTED_VERSION = packageJson.engines.node;
        var actualVersion = process.version;
        if (semver.neq(actualVersion, EXPECTED_VERSION))
            fail("Incorrect Node version: expected " + EXPECTED_VERSION + ", but was " + actualVersion);
    });

    desc("Lint JavaScript");
    task("lint", function () {
        process.stdout.write("Linting JavaScript: ");

        jshint.checkFiles({
            files: ["Jakefile.js", "src/js/**/*.js"],
            options: lintingOptions(),
            globals: {}
        }, complete, fail);
    }, {async: true});

    desc("Run server tests");
    task("testServer", ["version", "lint", GENERATED_TEST_DIRECTORY], function () {
        console.log("Testing server JavaScript:");

        var mocha = new Mocha({
            ui: "bdd",
            reporter: "spec"
        });

        mocha.addFile("src/js/server/server_test.js");
        mocha.run(function (failures) {
            if (failures) return fail("Server tests failed");
            else return complete();
        });
    }, {async: true});

    directory(GENERATED_TEST_DIRECTORY);

    desc("Run client tests in browsers");
    task("testClient", ["lint"], function () {
        console.log("Testing client JavaScript in browsers:");
        karma.run({
            configFile: KARMA_CONF_JS,
            expectedBrowsers: EXPECTED_BROWSERS,
            strict: !process.env.loose
        }, complete, fail);
    }, {async: true});

    desc("Run application tests");
    task("testApp", ["lint", "build"], function () {
        console.log("Testing application:");

        var mocha = new Mocha({
            timeout: 30000, // 30 seconds
            ui: "bdd",
            reporter: "spec"
        });

        mocha.addFile("src/js/application_test.js");
        mocha.run(function (failures) {
            if (failures) return fail("Application tests failed");
            else return complete();
        });
    }, {async: true});

    desc("Run a local http server");
    task("run", ["build"], function () {
        console.log("Running local http server:");
        runCommand.runInteractively();
    }, {async: true});

    desc("Build distribution files");
    task("build", ["clean", GENERATED_CLIENT_DIRECTORY], function () {
        console.log("Building distribution files:");
        shell.cp("src/html/*.html", GENERATED_CLIENT_DIRECTORY);
        shell.cp("third-party/jquery-3.3.1.js", GENERATED_CLIENT_DIRECTORY);
        shell.cp("third-party/raphael-2.2.1.js", GENERATED_CLIENT_DIRECTORY);

        var b = browserify();
        b.require("./src/js/client/client.js", {expose: "./client.js"});
        b.require("./src/js/client/html_element.js", {expose: "./html_element.js"});
        b.bundle(function (error, bundle) {
            if (error) fail(error);
            fs.writeFileSync(GENERATED_CLIENT_DIRECTORY + "/bundle.js", bundle);
            complete();
        });
    }, {async: true});

    desc("Cleans generated directory");
    task("clean", function () {
        console.log("Cleaning generated directory:");
        shell.rm("-rf", GENERATED_DIRECTORY);
    });

    directory(GENERATED_CLIENT_DIRECTORY);

    desc("Integrate");
    task("integrate", ["default"], function () {
        console.log("1. Make sure 'git status' is clean.");
        console.log("2. Build on the integration box.");
        console.log("   a. Walk over to integration box.");
        console.log("   b. 'git pull'");
        console.log("   c. 'jake'");
        console.log("   d. If jake fails, stop! Try again after fixing the issue.");
        console.log("3. git checkout integration");
        console.log("4. git merge master --no-ff --log");
        console.log("5. git checkout master");
    });

    desc("Deploy to Heroku");
    task("deploy", ["build", "default"], function () {
        console.log("1. Make sure 'git status' is clean.");
        console.log("2. git push heroku master");
        console.log("3. ./jake.sh testRelease");
    });

    desc("Run release test");
    task("testRelease", ["version", "lint"], function () {
        console.log("Testing website is available:");

        var mocha = new Mocha({
            ui: "bdd",
            reporter: "spec"
        });

        mocha.addFile("src/js/release_test.js");
        mocha.run(function (failures) {
            if (failures) return fail("Website not available.");
            else return complete();
        });
    }, {async: true});

    function lintingOptions() {
        return {
            bitwise: true,
            eqeqeq: true,
            forin: true,
            freeze: true,
            futurehostile: true,
            latedef: "nofunc",
            noarg: true,
            nocomma: true,
            nonbsp: true,
            nonew: true,
            strict: true,
            undef: true,

            node: true,
            browser: true,
            mocha: true,
            jquery: true
        };
    }
}());