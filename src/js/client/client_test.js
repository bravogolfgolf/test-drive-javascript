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

            assert.deepEqual(paperPaths(paper), [[20, 30, 30, 300]], "Path of Raphael element:");
        });

        it("draw connected line segments based on clicks", function () {
            var click1 = {x: 20, y: 30};
            var click2 = {x: 50, y: 60};
            var click3 = {x: 20, y: 40};
            var offset = {left: 8, top: 8};

            clickEvent(click1.x, click1.y, offset);
            clickEvent(click2.x, click2.y, offset);
            clickEvent(click3.x, click3.y, offset);

            assert.deepEqual(paperPaths(paper), [[20, 30, 50, 60], [50, 60, 20, 40]], "Paths of Raphael elements");
        });


        function clickEvent(x, y, offset) {
            var event = new jQuery.Event("click");
            event.pageX = x + offset.left;
            event.pageY = y + offset.top;
            jQuery(drawingArea).trigger(event);
        }

        function paperPaths(paper) {
            var elements = elementsOf(paper);
            return elements.map(function (element) {
                var path = pathOf(element);
                return [path.x, path.y, path.x1, path.y1];
            });
        }

        function elementsOf(element) {
            var elements = [];
            element.forEach(function (element) {
                elements.push(element);
            });
            return elements;
        }

        function pathOf(element) {
            var regEx;
            var path = element.node.attributes.d.value;

            if (path.indexOf(",") !== -1) {
                regEx = /M(\d+),(\d+)L(\d+),(\d+)/;
            } else if ((path.indexOf(" ") !== -1)) {
                regEx = /M (\d+) (\d+) L (\d+) (\d+)/;
            } else throw new Error("No match of expected Raphael path.");

            var items = path.match(regEx);
            return {x: parseInt(items[1]), y: parseInt(items[2]), x1: parseInt(items[3]), y1: parseInt(items[4])};
        }
    });
}());