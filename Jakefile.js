(function () {
    "use strict";


    desc("Default build");
    task("default", ["version"], function () {
        console.log("\n\nBUILD OK");
    });

    desc("Check node version");
    task("version", function () {
        console.log("Checking node version: .");

        var packageJson = require("./package.json");
        var EXPECTED_VERSION = "v" + packageJson.engines.node;
        var actualVersion = process.version;
        if (actualVersion !== EXPECTED_VERSION)
            fail("Incorrect Node version: expected " + EXPECTED_VERSION + ", but was " + actualVersion)
    });

}());