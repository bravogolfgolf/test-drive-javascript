/* globals desc:false, task:false, complete:false, fail:false */
(function () {
    "use strict";

    var semver = require("semver");
    var jshint = require("simplebuild-jshint");

    desc("Integrate");
    task("integrate", ["default"], function() {
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
    task("default", ["version", "lint"], function () {
        console.log("\n\nBUILD OK");
    });

    desc("Check node version");
    task("version", function () {
        console.log("Checking node version: .");

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
            files: "Jakefile.js",
            options: {
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
            },
            globals: {}
        }, complete, fail);
    }, {async: true});
}());