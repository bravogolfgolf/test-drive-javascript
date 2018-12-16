(function () {
    "use strict";

    var http = require("http");
    var server;

    exports.start = function () {
        server = http.createServer();

        server.on("request", function (request, response) {
            response.end();
        });

        server.listen(8080);
    };

    exports.stop = function () {
        server.close();
    };

}());