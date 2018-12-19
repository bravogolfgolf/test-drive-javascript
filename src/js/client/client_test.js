/* globals wwp:true, dump:false */

(function () {
    "use strict";

    var assert = require("../shared/assert");
    var div;

    describe("Drawing area", function () {

        afterEach(function () {
            $(div).remove();
        });

        it("should be initialized with Raphael", function () {
            div = $("<div></div>");
            $(document.body).append(div);

            wwp.initializeDrawingArea(div[0]);

            var tagName = $(div).children()[0].tagName;
            assert.equal(tagName, "svg");
        });

        it("should have the same dimensions as enclosing div", function () {
            div = $("<div id='wwp-drawingArea' style='height:200px; width:400px'></div>");
            $(document.body).append(div);

            var paper = wwp.initializeDrawingArea(div[0]);

            assert.equal(paper.height, 200);
            assert.equal(paper.width, 400);
        });
    });
}());