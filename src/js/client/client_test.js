/* globals wwp:true, dump:false */

(function () {
    "use strict";

    var assert = require("../shared/assert");

    var drawingArea;
    var paper;
    var HEIGHT = 200;
    var WIDTH = 400;
    // var MARGIN = 20;
    // var BORDER = 20;
    // var PADDING = 20;

    describe("Drawing area", function () {

        beforeEach(function () {
            var html = "<div id=drawingArea style='" +
                "height: " + HEIGHT + "px;" +
                "width: " + WIDTH + "px;'></div>";
            drawingArea = $(html);
            $(document.body).append(drawingArea);
            paper = wwp.initializeDrawingArea(drawingArea[0]);
        });

        afterEach(function () {
            $(drawingArea).remove();
        });

        it("should have the same dimensions as enclosing div", function () {
            assert.equal(paper.height, HEIGHT, "Height of Raphael paper:");
            assert.equal(paper.width, WIDTH, "Width of Raphael paper:");
        });

        it("draw a line", function () {
            wwp.drawLine(20, 30, 30, 300);

            var elements = elementsOf(paper);
            assert.equal(elements.length, 1, "Number of Raphael paper elements:");
            assert.equal(pathOf(elements[0]), "M20,30L30,300", "Path of Raphael element:");
        });

        it("mouse click", function () {
            var PAGE_X = 20;
            var PAGE_Y = 30;
            var TESTING_AREA_OFFSET_LEFT = 8;
            var TESTING_AREA_OFFSET_TOP = 8;
            var expectedX = PAGE_X - TESTING_AREA_OFFSET_LEFT;
            var expectedY = PAGE_Y - TESTING_AREA_OFFSET_TOP;

            var event = new jQuery.Event("click");
            event.pageX = PAGE_X;
            event.pageY = PAGE_Y;

            jQuery(drawingArea).trigger(event);

            var elements = elementsOf(paper);
            assert.equal(elements.length, 1, "Number of Raphael paper elements:");
            assert.equal(pathOf(elements[0]), "M0,0L" + expectedX + "," + expectedY, "Path of Raphael element:");
        });


        function elementsOf(element) {
            var elements = [];
            element.forEach(function (element) {
                elements.push(element);
            });
            return elements;
        }

        function pathOf(element) {
            var box = element.getBBox();
            return "M" + box.x + "," + box.y + "L" + box.x2 + "," + box.y2;
        }
    });
}());