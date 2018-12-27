/* globals wwp:true, dump:false, Touch:false, TouchEvent:false */

(function () {
    "use strict";

    var assert = require("../shared/assert");

    var offset = {left: 8, top: 8};
    var drawingArea;
    var paper;
    var ORIGIN = {x: 0, y: 0};
    var HEIGHT = 200;
    var WIDTH = 400;

    describe("Drawing area should,", function () {

        beforeEach(function () {
            var html = "<div id=drawingArea style='" +
                "height: " + HEIGHT + "px;" +
                "width: " + WIDTH + "px;'></div>";
            drawingArea = $(html);
            $(document.body).append(drawingArea);
            paper = wwp.initializeDrawingArea(drawingArea[0]);
        });

        afterEach(function () {
            wwp.removeDrawingArea();
            drawingArea.remove();
        });

        describe("if initialized twice", function () {

            var drawingArea2;

            beforeEach(function () {
                var html2 = "<div id=drawingArea2 style='" +
                    "height: " + HEIGHT + "px;" +
                    "width: " + WIDTH + "px;'></div>";
                drawingArea2 = $(html2);
                $(document.body).append(drawingArea2);

            });

            afterEach(function () {
                drawingArea2.remove();
            });

            it("throw error", function () {
                assert.throws(
                    function () {
                        paper = wwp.initializeDrawingArea(drawingArea2[0]);
                    },
                    Error,
                    "May only initialize drawing area once.");
            });

        });

        it(" have the same dimensions as enclosing div", function () {
            assert.equal(paper.height, HEIGHT, "Height of Raphael paper:");
            assert.equal(paper.width, WIDTH, "Width of Raphael paper:");
        });

        describe("in response to mouse events,", function () {

            it("draw a line with a drag", function () {
                mouseDown(20, 30);
                mouseMove(50, 60);
                mouseUp(50, 60);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60]], "Paths of Raphael elements");
            });

            it("draw multiple line segments dragged multiple places", function () {
                mouseDown(20, 30);
                mouseMove(50, 60);
                mouseMove(80, 20);
                mouseMove(100, 70);
                mouseUp(100, 70);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60], [50, 60, 80, 20], [80, 20, 100, 70]], "Paths of Raphael elements");
            });

            it("draw multiple line segments when there are multiple drags", function () {
                mouseDown(20, 30);
                mouseMove(50, 60);
                mouseUp(50, 60);

                mouseMove(90, 60);

                mouseDown(100, 70);
                mouseMove(80, 20);
                mouseUp(80, 20);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60], [100, 70, 80, 20]], "Paths of Raphael elements");
            });

            it("not draw line segment when mouse is up", function () {
                mouseDown(20, 30);
                mouseUp(80, 20);

                assert.deepEqual(lineSegments(), [], "Paths of Raphael elements");
            });

            it("not draw line segments when mouse is not down", function () {
                mouseMove(20, 30);
                mouseMove(50, 60);

                assert.deepEqual(lineSegments(), [], "Paths of Raphael elements");
            });

            it("stop drawing line segments when mouse is up", function () {
                mouseDown(20, 30);
                mouseMove(50, 60);
                mouseUp(50, 60);
                mouseMove(100, 70);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60]], "Paths of Raphael elements");
            });

            it("not continue to draw if mouse leaves drawing area", function () {
                mouseDown(20, 30);
                mouseMove(50, 60);
                mouseLeave(WIDTH + 1, HEIGHT + 1);
                mouseMove(WIDTH + 1, HEIGHT + 1, $(document));
                mouseMove(60, 70);
                mouseUp(60, 70);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60]], "Paths of Raphael elements");
            });

            describe("not start drawing if started outside drawing area", function () {

                it("from top", function () {
                    mouseDown(100, ORIGIN.y - 1, $(document));
                    mouseMove(50, 50);

                    assert.deepEqual(lineSegments(), [], "Paths of Raphael elements");
                });

                it("from right", function () {
                    mouseDown(WIDTH + 1, 100, $(document));
                    mouseMove(50, 50);

                    assert.deepEqual(lineSegments(), [], "Paths of Raphael elements");
                });

                it("from bottom", function () {
                    mouseDown(100, HEIGHT + 1, $(document));
                    mouseMove(50, 50);

                    assert.deepEqual(lineSegments(), [], "Paths of Raphael elements");
                });

                it("from left", function () {
                    mouseDown(ORIGIN.x - 1, 100, $(document));
                    mouseMove(50, 50);

                    assert.deepEqual(lineSegments(), [], "Paths of Raphael elements");
                });
            });

            describe("draw from exact edge of drawing area", function () {
                it("from origin", function () {
                    mouseDown(ORIGIN.x, ORIGIN.y);
                    mouseMove(50, 50);
                    mouseUp(50, 50);

                    assert.deepEqual(lineSegments(), [[ORIGIN.x, ORIGIN.y, 50, 50]], "Paths of Raphael elements");
                });

                it("from bottom, right corner", function () {
                    mouseDown(WIDTH, HEIGHT);
                    mouseMove(50, 50);
                    mouseUp(50, 50);

                    assert.deepEqual(lineSegments(), [[WIDTH, HEIGHT, 50, 50]], "Paths of Raphael elements");
                });
            });

            it("not select text or other elements when drag continues out of drawing area", function () {
                drawingArea.mousedown(function (event) {
                    assert.isOk(event.isDefaultPrevented(), "Prevent default event on pointer down in drawing area");

                });
                mouseDown(50, 50);
            });
        });

        describe("in response to touch events,", function () {
            if (!browserSupportsTouchEvents()) return;

            it("draw a line with a drag", function () {
                touchStart(20, 30);
                touchMove(50, 60);
                touchEnd(50, 60);
                touchMove(100, 1100);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60]], "Paths of Raphael elements");
            });

            it("stop drawing line when touch cancelled", function () {
                touchStart(20, 30);
                touchMove(50, 60);
                touchCancel(50, 60);
                touchMove(100, 1100);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60]], "Paths of Raphael elements");
            });

            it("not scroll or zoom when touching in drawing area", function () {
                drawingArea.on("touchstart", function (event) {
                    assert.isOk(event.isDefaultPrevented(), "Prevent default event on pointer down in drawing area");

                });
                touchStart(50, 50);
            });

            it("stop drawing line when multi-touches detected", function () {
                touchStart(20, 30);
                touchMove(50, 60);
                multiTouchStart({x: 50, y: 60}, {x: 100, y: 110});
                touchMove(150, 160);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60]], "Paths of Raphael elements");
            });
        });

        function browserSupportsTouchEvents() {
            return 'TouchEvent' in window && TouchEvent.length > 0;
        }

        function mouseDown(x, y, optionalJQueryElement) {
            clickEvent("mousedown", x, y, optionalJQueryElement);
        }

        function mouseMove(x, y, optionalJQueryElement) {
            clickEvent("mousemove", x, y, optionalJQueryElement);
        }

        function mouseLeave(x, y, optionalJQueryElement) {
            clickEvent("mouseleave", x, y, optionalJQueryElement);
        }

        function mouseUp(x, y, optionalJQueryElement) {
            clickEvent("mouseup", x, y, optionalJQueryElement);
        }

        function touchStart(x, y, optionalJQueryElement) {
            var points = [{x: x, y: y}];
            touchEvent("touchstart", points, optionalJQueryElement);
        }

        function multiTouchStart(point1, point2, optionalJQueryElement) {
            var points = [point1, point2];
            touchEvent("touchstart", points, optionalJQueryElement);
        }

        function touchMove(x, y, optionalJQueryElement) {
            var points = [{x: x, y: y}];
            touchEvent("touchmove", points, optionalJQueryElement);
        }

        function touchEnd(x, y, optionalJQueryElement) {
            var points = [{x: x, y: y}];
            touchEvent("touchend", points, optionalJQueryElement);
        }

        function touchCancel(x, y, optionalJQueryElement) {
            var points = [{x: x, y: y}];
            touchEvent("touchcancel", points, optionalJQueryElement);
        }

        function clickEvent(type, x, y, optionalJQueryElement) {
            var jQueryElement = optionalJQueryElement || drawingArea;

            var event = new jQuery.Event(type);
            event.pageX = x + offset.left;
            event.pageY = y + offset.top;
            jQueryElement.trigger(event);
        }

        function touchEvent(type, points, optionalJQueryElement) {
            var jQueryElement = optionalJQueryElement || drawingArea;
            var target = jQueryElement[0];
            var touchList = createTouchList(points, target);
            var touchEvent = createTouchEvent(type, touchList);

            target.dispatchEvent(touchEvent);
        }

        function createTouchList(points, target) {
            var touchList = [];
            var identifier = 0;
            points.forEach(function (point) {
                var touch = createTouch(identifier, target, point);
                identifier++;
                touchList.push(touch);
            });
            return touchList;
        }

        function createTouch(identifier, target, point) {
            return new Touch({
                identifier: identifier,
                target: target,
                pageX: point.x + offset.left,
                pageY: point.y + offset.top
            });
        }

        function createTouchEvent(type, touchList) {
            return new TouchEvent(type, {
                cancelable: true,
                bubbles: true,
                touches: touchList,
                targetTouches: touchList,
                changedTouches: touchList
            });
        }

        function lineSegments() {
            var elements = [];
            paper.forEach(function (element) {
                // dump(pathOf(element));
                elements.push(pathOf(element));
            });
            return elements;
        }

        function pathOf(element) {
            var regEx = null;
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