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
            mouseDown(20, 30);
            mouseMove(50, 60);

            assert.deepEqual(paperPaths(paper), [[20, 30, 50, 60]], "Paths of Raphael elements");
        });

        it("not draw line segments when mouse is not down", function () {
            mouseMove(20, 30);
            mouseMove(50, 60);

            assert.deepEqual(paperPaths(paper), [], "Paths of Raphael elements");
        });

        it("stop drawing line segments when mouse is up", function () {
            mouseDown(20, 30);
            mouseMove(50, 60);
            mouseUp(50, 60);
            mouseMove(100, 70);

            assert.deepEqual(paperPaths(paper), [[20, 30, 50, 60]], "Paths of Raphael elements");
        });

        it("draw multiple line segments when mouse dragged multiple places", function () {
            mouseDown(20, 30);
            mouseMove(50, 60);
            mouseMove(80, 20);
            mouseMove(100, 70);

            assert.deepEqual(paperPaths(paper), [[20, 30, 50, 60], [50, 60, 80, 20], [80, 20, 100, 70]], "Paths of Raphael elements");
        });

        it("draw multiple line segments when there are multiple drags", function () {
            mouseDown(20, 30);
            mouseMove(50, 60);
            mouseUp(50, 60);

            mouseMove(90, 60);

            mouseDown(100, 70);
            mouseMove(80, 20);
            mouseUp(80, 20);

            assert.deepEqual(paperPaths(paper), [[20, 30, 50, 60], [100, 70, 80, 20]], "Paths of Raphael elements");
        });

        it("not draw line segment in response to mouseup event", function () {
            mouseDown(20, 30);
            mouseUp(80, 20);

            assert.deepEqual(paperPaths(paper), [], "Paths of Raphael elements");
        });

        function mouseDown(x, y) {
            clickEvent("mousedown", x, y);
        }

        function mouseMove(x, y) {
            clickEvent("mousemove", x, y);
        }

        function mouseUp(x, y) {
            clickEvent("mouseup", x, y);
        }

        function clickEvent(type, x, y) {
            var event = new jQuery.Event(type);
            event.pageX = x + offset.left;
            event.pageY = y + offset.top;
            jQuery(drawingArea).trigger(event);
        }

        function paperPaths(paper) {
            var elements = [];
            paper.forEach(function (element) {
                elements.push(pathOf(element));
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
            return [parseInt(items[1]), parseInt(items[2]), parseInt(items[3]), parseInt(items[4])];
        }
    });
}());