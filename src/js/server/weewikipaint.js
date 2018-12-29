(function () {
    "use strict";


    var DIRECTORY = process.argv[3];
    var PAGE_404 = DIRECTORY + "/404.html";
    var PORT = process.argv[2];


    var server = require("./server.js");
    server.start(DIRECTORY, PAGE_404, PORT, function () {
        console.log("Server started.");
    });

}());