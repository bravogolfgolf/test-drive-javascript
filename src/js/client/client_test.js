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

        it("draw connected line segments based on clicks", function () {
            var PAGE_X_1 = 20;
            var PAGE_Y_1 = 30;
            var PAGE_X_2 = 50;
            var PAGE_Y_2 = 60;
            var offset = {
                left: 8,
                top: 8
            };

            clickEvent(PAGE_X_1, PAGE_Y_1);
            clickEvent(PAGE_X_2, PAGE_Y_2);

            var start = relativePosition(PAGE_X_1, PAGE_Y_1, offset);
            var end = relativePosition(PAGE_X_2, PAGE_Y_2, offset);

            var elements = elementsOf(paper);

            assert.equal(elements.length, 1, "Number of Raphael paper elements");
            assert.equal(pathOf(elements[0]), "M" + start.x + "," + start.y + "L" + end.x + "," + end.y, "Path of Raphael element");
        });


        function clickEvent(pageX, pageY) {
            var event = new jQuery.Event("click");
            event.pageX = pageX;
            event.pageY = pageY;
            jQuery(drawingArea).trigger(event);
        }

        function relativePosition(pageX, pageY, offset) {
            var x = pageX - offset.left;
            var y = pageY - offset.top;
            return {x: x, y: y};
        }


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