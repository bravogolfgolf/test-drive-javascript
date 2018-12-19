/* globals wwp:true, dump:false */

(function () {
    "use strict";

    var assert = require("../shared/assert");

    describe("Drawing area", function () {

        it("should be initialized with Raphael", function () {

            var div = document.createElement("div");
            div.setAttribute("id", "wwp-drawingArea");
            document.body.appendChild(div);

            wwp.initializeDrawingArea("wwp-drawingArea");

            var tagName = $(div).children()[0].tagName;
            assert.equal(tagName, "svg");
        });
    });
}());