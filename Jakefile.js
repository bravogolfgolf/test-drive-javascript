(function () {
    "use strict";

    var semver = require("semver");

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
        console.log("Linting JavaScript: ");
        jake.exec("node node_modules/jshint/bin/jshint Jakefile.js", {interactive: true}, complete);
    }, {aysnc: true});

}());