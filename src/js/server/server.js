(function () {
    "use strict";

    var http = require("http");
    var fs = require("fs");
    var server;

    exports.start = function (fileName, portNumber) {
        if (!portNumber) throw new Error("Port number is required.");

        server = http.createServer();

        server.on("request", function (request, response) {
            if (request.url === "/" || request.url === "/index.html") {
                fs.readFile(fileName, function (err, data) {
                    if (err) throw err; // TODO: Fix this.
                    response.end(data);
                });
            } else {
                response.statusCode = 404;
                response.end();
            }
        });

        server.listen(portNumber);
    };

    exports.stop = function (callback) {
        server.close(callback);
    };

}());