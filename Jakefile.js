(function () {
    "use strict";

    var semver = require("semver");
    var jshint = require("simplebuild-jshint");

    desc("Default build");
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
            options: {},
            globals: {}
        }, complete, fail);
    }, {async: true});
}());