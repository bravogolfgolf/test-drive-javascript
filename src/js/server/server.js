(function () {
    "use strict";

    var http = require("http");
    var server;

    exports.start = function (portNumber) {
        server = http.createServer();

        server.on("request", function (request, response) {
            response.end("Test data");
        });

        server.listen(portNumber);
    };

    exports.stop = function () {
        server.close();
    };

}());