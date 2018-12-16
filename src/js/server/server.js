(function () {
    "use strict";

    var http = require("http");
    var server;

    exports.start = function (port) {
        server = http.createServer();

        server.on("request", function (request, response) {
            response.end();
        });

        server.listen(port);
    };

    exports.stop = function () {
        server.close();
    };

}());