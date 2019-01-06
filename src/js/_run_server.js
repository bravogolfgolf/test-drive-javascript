(function () {
    "use strict";

    var UTF8 = "utf8";
    var PORT = 5000;

    var fs = require("fs");
    var procfile = require("procfile");
    var child_process = require("child_process");

    exports.runInteractively = function () {
        runWith({stdio: "inherit"});
    };

    exports.run = function (callback) {
        var child = runWith({});

        child.stdout.setEncoding(UTF8);
        child.stdout.on("data", function (chunk) {
            if (chunk.trim() === "Server started.") callback(child);
        });

        child.stderr.setEncoding(UTF8);
        child.stderr.on("data", function (chunk) {
            console.log(chunk);
        });
    };

    function runWith(options) {
        var result = parseProcfile();
        return child_process.spawn(result.command, result.options, options);
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