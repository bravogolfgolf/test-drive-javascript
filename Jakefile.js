/* globals jake:false, desc:false, task:false, complete:false, fail:false, directory:false */

(function () {

    "use strict";

    var semver = require("semver");
    var jshint = require("simplebuild-jshint");
    var karma = require("simplebuild-karma");
    var shell = require("shelljs");

    var GENERATED = "generated";
    var KARMA_CONF_JS = "karma.conf.js";
    var EXPECTED_BROWSWERS = [
        "Safari 12.0.2 (Mac OS X 10.14.2)",
        "Mobile Safari 12.0.0 (iOS 12.1.0)",
        "Chrome 70.0.3538 (Mac OS X 10.14.2)",
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

    desc("Run a local http server");
    task("run", ["build"], function () {
        console.log("Running local http server:");
        jake.exec("node node_modules/http-server/bin/http-server " + GENERATED, {interactive: true}, complete);
    }, {async: true});

    desc("Build distribution files");
    task("build", ["clean", GENERATED], function () {
        console.log("Building distribution files:");
        shell.cp("src/html/index.html", GENERATED);
        jake.exec(
            "node node_modules/browserify/bin/cmd.js src/js/client/app.js -o " + GENERATED + "/bundle.js",
            {interactive: true},
            complete);
    }, {aysnc: true});

    desc("Cleans generated directory");
    task("clean", function () {
        console.log("Cleaning generated directory:");
        shell.rm("-rf", GENERATED);
    });

    directory(GENERATED);

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

    desc("Build and test");
    task("default", ["version", "lint", "textClient"], function () {
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
            globals: lintingGlobals()
        }, complete, fail);
    }, {async: true});
    
    desc("Run server tests");
    task("testServer",function () {
        console.log("Testing server JavaScript:");
    });

    desc("Run client tests in browsers");
    task("textClient", function () {
        console.log("Testing client JavaScript in browsers:");
        karma.run({
            configFile: KARMA_CONF_JS,
            expectedBrowsers: EXPECTED_BROWSWERS,
            strict: !process.env.loose

        }, complete, fail);
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
            browser: true
        };
    }

    function lintingGlobals() {
        return {
            describe: false,
            it: false,
            before: false,
            after: false,
            beforeEach: false,
            afterEach: false
        };
    }

}());