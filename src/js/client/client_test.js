/* globals TouchEvent:false */

(function () {
    "use strict";

    var assert = require("../shared/assert");

    var ORIGIN = {x: 0, y: 0};
    var HEIGHT = 200;
    var WIDTH = 400;

    var svgCanvas;
    var documentBody;
    var drawingArea;
    var paper;

    describe("Drawing area should,", function () {

        beforeEach(function () {
            var html = "<div id=drawingArea style='" +
                "height: " + HEIGHT + "px;" +
                "width: " + WIDTH + "px;'></div>";
            drawingArea = new wwp.HtmlElement(html);
            documentBody = new wwp.HtmlElement(document.body);
            documentBody.append(drawingArea);
            svgCanvas = wwp.initializeDrawingArea(drawingArea);
            paper = svgCanvas._paper;
        });

        afterEach(function () {
            drawingArea.remove();
            wwp.removeDrawingArea();
        });

        describe("if initialized twice", function () {

            var drawingArea2;

            beforeEach(function () {
                var html2 = "<div id=drawingArea2 style='" +
                    "height: " + HEIGHT + "px;" +
                    "width: " + WIDTH + "px;'></div>";
                drawingArea2 = wwp.HtmlElement.fromHtml(html2);
                documentBody.append(drawingArea2);

            });

            afterEach(function () {
                drawingArea2.remove();
            });

            it("throw error", function () {
                assert.throws(
                    function () {
                        paper = wwp.initializeDrawingArea(drawingArea2);
                    },
                    Error,
                    "May only initialize canvas once.");
            });

        });

        it(" have the same dimensions as enclosing div", function () {
            assert.equal(paper.height, HEIGHT, "Height of Raphael paper:");
            assert.equal(paper.width, WIDTH, "Width of Raphael paper:");
        });

        it("not select text or other elements when drag continues out of drawing area", function () {
            drawingArea.onMouseDown(function (point, event) {
                assert.isOk(event.isDefaultPrevented(), "Prevent default event on pointer down in drawing area");

            });
            drawingArea.doMouseDown(50, 50);
        });

        describe("in response to mouse events,", function () {

            it("draw a line with a drag", function () {
                drawingArea.doMouseDown(20, 30);
                drawingArea.doMouseMove(50, 60);
                drawingArea.doMouseUp(50, 60);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60]], "Paths of Raphael elements");
            });

            it("draw multiple line segments dragged multiple places", function () {
                drawingArea.doMouseDown(20, 30);
                drawingArea.doMouseMove(50, 60);
                drawingArea.doMouseMove(80, 20);
                drawingArea.doMouseMove(100, 70);
                drawingArea.doMouseUp(100, 70);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60], [50, 60, 80, 20], [80, 20, 100, 70]], "Paths of Raphael elements");
            });

            it("draw multiple line segments when there are multiple drags", function () {
                drawingArea.doMouseDown(20, 30);
                drawingArea.doMouseMove(50, 60);
                drawingArea.doMouseUp(50, 60);

                drawingArea.doMouseMove(90, 60);

                drawingArea.doMouseDown(100, 70);
                drawingArea.doMouseMove(80, 20);
                drawingArea.doMouseUp(80, 20);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60], [100, 70, 80, 20]], "Paths of Raphael elements");
            });

            it("not draw line segment when mouse is up", function () {
                drawingArea.doMouseDown(20, 30);
                drawingArea.doMouseUp(80, 20);

                assert.deepEqual(lineSegments(), [], "Paths of Raphael elements");
            });

            it("not draw line segments when mouse is not down", function () {
                drawingArea.doMouseMove(20, 30);
                drawingArea.doMouseMove(50, 60);

                assert.deepEqual(lineSegments(), [], "Paths of Raphael elements");
            });

            it("stop drawing line segments when mouse is up", function () {
                drawingArea.doMouseDown(20, 30);
                drawingArea.doMouseMove(50, 60);
                drawingArea.doMouseUp(50, 60);
                drawingArea.doMouseMove(100, 70);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60]], "Paths of Raphael elements");
            });

            it("not continue to draw if mouse leaves drawing area", function () {
                drawingArea.doMouseDown(20, 30);
                drawingArea.doMouseMove(50, 60);
                drawingArea.doMouseLeave(WIDTH + 1, HEIGHT + 1);
                documentBody.doMouseMove(WIDTH + 1, HEIGHT + 1);
                drawingArea.doMouseMove(60, 70);
                drawingArea.doMouseUp(60, 70);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60]], "Paths of Raphael elements");
            });

            describe("not start drawing if started outside drawing area", function () {

                it("from top", function () {
                    documentBody.doMouseDown(100, ORIGIN.y - 1);
                    drawingArea.doMouseMove(50, 50);

                    assert.deepEqual(lineSegments(), [], "Paths of Raphael elements");
                });

                it("from right", function () {
                    documentBody.doMouseDown(WIDTH + 1, 100);
                    drawingArea.doMouseMove(50, 50);

                    assert.deepEqual(lineSegments(), [], "Paths of Raphael elements");
                });

                it("from bottom", function () {
                    documentBody.doMouseDown(100, HEIGHT + 1);
                    drawingArea.doMouseMove(50, 50);

                    assert.deepEqual(lineSegments(), [], "Paths of Raphael elements");
                });

                it("from left", function () {
                    documentBody.doMouseDown(ORIGIN.x - 1, 100);
                    drawingArea.doMouseMove(50, 50);

                    assert.deepEqual(lineSegments(), [], "Paths of Raphael elements");
                });
            });

            describe("draw from exact edge of drawing area", function () {
                it("from origin", function () {
                    drawingArea.doMouseDown(ORIGIN.x, ORIGIN.y);
                    drawingArea.doMouseMove(50, 50);
                    drawingArea.doMouseUp(50, 50);

                    assert.deepEqual(lineSegments(), [[ORIGIN.x, ORIGIN.y, 50, 50]], "Paths of Raphael elements");
                });

                it("from bottom, right corner", function () {
                    drawingArea.doMouseDown(WIDTH, HEIGHT);
                    drawingArea.doMouseMove(50, 50);
                    drawingArea.doMouseUp(50, 50);

                    assert.deepEqual(lineSegments(), [[WIDTH, HEIGHT, 50, 50]], "Paths of Raphael elements");
                });
            });
        });

        describe("in response to touch events,", function () {
            if (!browserSupportsTouchEvents()) return;

            it("draw a line with a drag", function () {
                drawingArea.doSingleTouchStart(20, 30);
                drawingArea.doSingleTouchMove(50, 60);
                drawingArea.doSingleTouchEnd(50, 60);
                drawingArea.doSingleTouchMove(100, 1100);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60]], "Paths of Raphael elements");
            });

            it("stop drawing line when touch cancelled", function () {
                drawingArea.doSingleTouchStart(20, 30);
                drawingArea.doSingleTouchMove(50, 60);
                drawingArea.doSingleTouchCancel(50, 60);
                drawingArea.doSingleTouchMove(100, 110);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60]], "Paths of Raphael elements");
            });

            it("not scroll or zoom when touching in drawing area", function () {
                drawingArea.onSingleTouchStart(function (point, event) {
                    assert.isOk(event.isDefaultPrevented(), "Prevent default event on pointer down in drawing area");
                });
                drawingArea.doSingleTouchStart(50, 50);
            });

            it("stop drawing line when multi-touches detected", function () {
                drawingArea.doSingleTouchStart(20, 30);
                drawingArea.doSingleTouchMove(50, 60);
                drawingArea.doMultiTouchStart({x: 50, y: 60}, {x: 100, y: 110});
                drawingArea.doSingleTouchMove(150, 160);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60]], "Paths of Raphael elements");
            });
        });

        function browserSupportsTouchEvents() {
            return 'TouchEvent' in window && TouchEvent.length > 0;
        }

        function lineSegments() {
            return svgCanvas.lineSegments();
        }
    });
}());