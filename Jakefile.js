(function () {
    "use strict";

    var EXPECTED_NODE_VERSION = "v11.4.0";

    desc("Default build");
    task("default", [ "version" ], function () {
        console.log("\n\nBUILD OK");
    });

    desc("Check node version");
    task("version", function () {
        console.log("Checking node version: .");

        var actualVersion = process.version;
        if (actualVersion !== EXPECTED_NODE_VERSION)
            fail("Incorrect Node version: expected " + EXPECTED_NODE_VERSION + ", but was " + actualVersion)
    });

}());