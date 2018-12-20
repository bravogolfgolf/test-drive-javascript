/* globals wwp:true, dump:false */

(function () {
    "use strict";

    var assert = require("../shared/assert");

    var drawingArea;
    var paper;

    describe("Drawing area", function () {

        beforeEach(function () {
            var html = "<div id='wwp-drawingArea' style='height:200px; width:400px'></div>";
            drawingArea = $(html);
            $(document.body).append(drawingArea);
            paper = wwp.initializeDrawingArea(drawingArea[0]);
        });

        afterEach(function () {
            $(drawingArea).remove();
        });

        it("should have the same dimensions as enclosing div", function () {
            assert.equal(paper.height, 200, "Height of Raphael paper:");
            assert.equal(paper.width, 400, "Width of Raphael paper:");
        });

        it("draw a line", function () {
            wwp.drawLine(20, 30, 30, 300);

            var elements = elementsOf(paper);
            assert.equal(elements.length, 1, "Number of Raphael paper elements:");
            assert.equal(pathOf(elements[0]), "M20,30L30,300", "Path of Raphael element:");
        });

        it("mouse click", function () {
            var event = new jQuery.Event("click");
            event.pageX = 20;
            event.pageY = 30;

            jQuery(drawingArea).trigger(event);

            var elements = elementsOf(paper);
            assert.equal(elements.length, 1, "Number of Raphael paper elements:");
            assert.equal(pathOf(elements[0]), "M0,0L20,30", "Path of Raphael element:");
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