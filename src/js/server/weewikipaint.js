(function () {
    "use strict";


    var TEST_DIRECTORY = "src/html";
    var TEST_HOME_PAGE = TEST_DIRECTORY + "/index.html";
    var TEST_404_PAGE = TEST_DIRECTORY + "/404.html";
    var PORT = process.argv[2];


    var server = require("./server.js");
    server.start(TEST_HOME_PAGE, TEST_404_PAGE, PORT, function () {
        console.log("Server started.");
    });

}());