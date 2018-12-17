(function () {
    "use strict";

    var http = require("http");
    var fs = require("fs");
    var server;

    exports.start = function (homePage, notFoundPage, portNumber) {

        server = http.createServer();

        server.on("request", function (request, response) {
            if (request.url === "/" || request.url === "/index.html") {
                response.statusCode = 200;
                fileToServe(homePage, response);
            } else {
                response.statusCode = 404;
                fileToServe(notFoundPage, response);
            }
        });

        server.listen(portNumber);
    };

    exports.stop = function (callback) {
        server.close(callback);
    };

    function fileToServe(fileName, response) {
        fs.readFile(fileName, function (err, data) {
            if (err) throw err;
            response.end(data);
        });
    }
}());