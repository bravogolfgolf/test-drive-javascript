/* globals wwp:true, dump:false */

(function () {
    "use strict";

    var assert = require("../shared/assert");

    var offset = {left: 8, top: 8};
    var drawingArea;
    var paper;
    var HEIGHT = 200;
    var WIDTH = 400;

    describe("Drawing area should", function () {

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

        it("have the same dimensions as enclosing div", function () {
            assert.equal(paper.height, HEIGHT, "Height of Raphael paper:");
            assert.equal(paper.width, WIDTH, "Width of Raphael paper:");
        });

        it("draw a line in response to a drag", function () {
            clickEvent("mousedown", 20, 30, offset);
            clickEvent("mousemove", 50, 60, offset);

            assert.deepEqual(paperPaths(paper), [[20, 30, 50, 60]], "Paths of Raphael elements");
        });

        it("not draw line segments when mouse is not down", function () {
            clickEvent("mousemove", 20, 30, offset);
            clickEvent("mousemove", 50, 60, offset);

            assert.deepEqual(paperPaths(paper), [], "Paths of Raphael elements");
        });

        it("stop drawing line segments when mouse is up", function () {
            clickEvent("mousedown", 20, 30, offset);
            clickEvent("mousemove", 50, 60, offset);
            clickEvent("mouseup", 50, 60, offset);
            clickEvent("mousemove", 100, 70, offset);

            assert.deepEqual(paperPaths(paper), [[20, 30, 50, 60]], "Paths of Raphael elements");
        });

        it("draw multiple line segments when mouse dragged multiple places", function () {
            clickEvent("mousedown", 20, 30, offset);
            clickEvent("mousemove", 50, 60, offset);
            clickEvent("mousemove", 80, 20, offset);
            clickEvent("mousemove", 100, 70, offset);

            assert.deepEqual(paperPaths(paper), [[20, 30, 50, 60], [50, 60, 80, 20], [80, 20, 100, 70]], "Paths of Raphael elements");
        });

        it("draw multiple line segments when there are multiple drags", function () {
            clickEvent("mousedown", 20, 30, offset);
            clickEvent("mousemove", 50, 60, offset);
            clickEvent("mouseup", 50, 60, offset);

            clickEvent("mousemove", 90, 60, offset);

            clickEvent("mousedown", 100, 70, offset);
            clickEvent("mousemove", 80, 20, offset);
            clickEvent("mouseup", 80, 20, offset);


            assert.deepEqual(paperPaths(paper), [[20, 30, 50, 60], [100, 70, 80, 20]], "Paths of Raphael elements");
        });

        it("not draw line segment in response to mouseup event", function () {
            clickEvent("mousedown", 20, 30, offset);
            clickEvent("mouseup", 80, 20, offset);

            assert.deepEqual(paperPaths(paper), [], "Paths of Raphael elements");
        });

        function clickEvent(type, x, y, offset) {
            var event = new jQuery.Event(type);
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