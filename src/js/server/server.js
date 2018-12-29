(function () {
    "use strict";

    var http = require("http");
    var send = require("send");
    var fs = require("fs");
    var server;

    exports.start = function (directory, notFoundPage, portNumber, callback) {

        server = http.createServer();

        server.on("request", function onRequest(request, response) {
            send(request, request.url, {root: directory})
                .on("error", error)
                .pipe(response);


            function error() {
                response.statusCode = 404;

                fs.readFile(notFoundPage, function (error, data) {
                    if (error) throw error;
                    response.end(data);
                });
            }

        });
        server.listen(portNumber, callback);
    };

    exports.stop = function (callback) {
        server.close(callback);
    };
}());