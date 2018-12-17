(function () {
    "use strict";

    var http = require("http");
    var server;

    exports.start = function (portNumber) {
        if(!portNumber) throw new Error("Port number is required.");
        server = http.createServer();

        server.on("request", function (request, response) {
            response.end("Test data");
        });

        server.listen(portNumber);
    };

    exports.stop = function (callback) {
        server.close(callback);
    };

}());