(function () {
    "use strict";

    var assert = require("../shared/assert");
    var client = require("./client.js");
    var browser = require("./browser.js");
    var HtmlElement = require("./html_element.js");

    var ORIGIN = {x: 0, y: 0};
    var HEIGHT = 200;
    var WIDTH = 400;

    var windowElement;
    var documentBody;
    var drawingArea;
    var svgCanvas;

    describe("Client should,", function () {

        beforeEach(function () {
            var html = "<div id=drawingArea style='" +
                "height: " + HEIGHT + "px;" +
                "width: " + WIDTH + "px;'></div>";
            windowElement = new HtmlElement(window);
            documentBody = new HtmlElement(document.body);
            drawingArea = new HtmlElement(html);
            documentBody.append(drawingArea);
            svgCanvas = client.initializeDrawingArea(drawingArea);
        });

        afterEach(function () {
            documentBody.removeEventListeners();
            drawingArea.remove();
            client.removeDrawingArea();
        });

        describe("if initialized twice", function () {

            var drawingArea2;

            beforeEach(function () {
                var html2 = "<div id=drawingArea2 style='" +
                    "height: " + HEIGHT + "px;" +
                    "width: " + WIDTH + "px;'></div>";
                drawingArea2 = HtmlElement.fromHtml(html2);
                documentBody.append(drawingArea2);

            });

            afterEach(function () {
                drawingArea2.remove();
            });

            it("throw error", function () {
                assert.throws(
                    function () {
                        svgCanvas = client.initializeDrawingArea(drawingArea2);
                    },
                    Error,
                    "May only initialize canvas once.");
            });

        });

        it("not select text or other elements when drag continues out of drawing area", function () {
            drawingArea.onMouseDown(function (point, event) {
                assert.isOk(event.isDefaultPrevented(), "Prevent default event on pointer down in drawing area");

            });
            drawingArea.triggerMouseDown(50, 50);
        });

        describe("in response to mouse events,", function () {

            it("draw a circle on mouse click", function () {
                drawingArea.triggerMouseDown(20, 30);
                drawingArea.triggerMouseUp(20, 30);
                drawingArea.triggerMouseClick(20, 30);

                assert.deepEqual(lineSegments(), [[20, 30]], "Origin of Raphael circle");
            });

            it("draw a line with a drag", function () {
                drawingArea.triggerMouseDown(20, 30);
                drawingArea.triggerMouseMove(50, 60);
                drawingArea.triggerMouseUp(50, 60);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60]], "Paths of Raphael elements");
            });

            it("not draw circles in line when dragged slowly", function () {
                drawingArea.triggerMouseDown(20, 30);

                drawingArea.triggerMouseMove(50, 60);
                drawingArea.triggerMouseMove(50, 60);
                drawingArea.triggerMouseMove(50, 60);

                drawingArea.triggerMouseUp(50, 60);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60]], "Paths of Raphael elements");
            });

            it("not draw circle at end of drag", function () {
                drawingArea.triggerMouseDown(20, 30);
                drawingArea.triggerMouseMove(50, 60);
                drawingArea.triggerMouseUp(50, 60);
                drawingArea.triggerMouseClick(50, 60);

                assert.equal(svgCanvas.elements().length, 1);
                assert.deepEqual(lineSegments(), [[20, 30, 50, 60]], "Paths of Raphael elements");

            });

            it("not draw circle if drag not started in drawing area", function () {
                documentBody.triggerMouseDown(20, 30);
                drawingArea.triggerMouseMove(50, 60);
                drawingArea.triggerMouseUp(50, 60);
                assert.deepEqual(lineSegments(), [], "Paths of Raphael elements");
            });

            it("draw multiple line segments dragged multiple places", function () {
                drawingArea.triggerMouseDown(20, 30);
                drawingArea.triggerMouseMove(50, 60);
                drawingArea.triggerMouseMove(80, 20);
                drawingArea.triggerMouseMove(100, 70);
                drawingArea.triggerMouseUp(100, 70);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60], [50, 60, 80, 20], [80, 20, 100, 70]], "Paths of Raphael elements");
            });

            it("draw multiple line segments when there are multiple drags", function () {
                drawingArea.triggerMouseDown(20, 30);
                drawingArea.triggerMouseMove(50, 60);
                drawingArea.triggerMouseUp(50, 60);

                drawingArea.triggerMouseMove(90, 60);

                drawingArea.triggerMouseDown(100, 70);
                drawingArea.triggerMouseMove(80, 20);
                drawingArea.triggerMouseUp(80, 20);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60], [100, 70, 80, 20]], "Paths of Raphael elements");
            });

            it("not draw line segments when mouse is not down", function () {
                drawingArea.triggerMouseMove(20, 30);
                drawingArea.triggerMouseMove(50, 60);

                assert.deepEqual(lineSegments(), [], "Paths of Raphael elements");
            });

            it("stop drawing line segments when mouse is up", function () {
                drawingArea.triggerMouseDown(20, 30);
                drawingArea.triggerMouseMove(50, 60);
                drawingArea.triggerMouseUp(50, 60);
                drawingArea.triggerMouseMove(100, 70);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60]], "Paths of Raphael elements");
            });

            it("continue to draw if mouse leaves drawing area and comes back in", function () {
                drawingArea.triggerMouseDown(20, 30);
                drawingArea.triggerMouseMove(50, 60);
                documentBody.triggerMouseMove(WIDTH + 100, HEIGHT + 100);
                drawingArea.triggerMouseMove(60, 70);
                drawingArea.triggerMouseUp(60, 70);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60], [50, 60, WIDTH + 100, HEIGHT + 100], [WIDTH + 100, HEIGHT + 100, 60, 70]], "Paths of Raphael elements");
            });

            it("not continue to draw if mouse leaves drawing area and mouse is released", function () {
                drawingArea.triggerMouseDown(20, 30);
                drawingArea.triggerMouseMove(50, 60);
                documentBody.triggerMouseMove(WIDTH + 100, HEIGHT + 100);
                documentBody.triggerMouseUp(WIDTH + 100, HEIGHT + 100);
                drawingArea.triggerMouseMove(60, 70);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60], [50, 60, WIDTH + 100, HEIGHT + 100]], "Paths of Raphael elements");

            });

            it("not continue to draw if mouse leaves window and mouse is released", function () {
                drawingArea.triggerMouseDown(20, 30);
                drawingArea.triggerMouseMove(50, 60);
                documentBody.triggerMouseMove(WIDTH + 100, HEIGHT + 100);
                windowElement.triggerMouseMove();
                windowElement.triggerMouseUp();
                drawingArea.triggerMouseMove(60, 70);

                assert.deepEqual(lineSegments(), [[20, 30, 50, 60], [50, 60, WIDTH + 100, HEIGHT + 100]], "Paths of Raphael elements");

            });

            describe("not start drawing if started outside drawing area", function () {

                it("from top", function () {
                    documentBody.triggerMouseDown(100, ORIGIN.y - 1);
                    drawingArea.triggerMouseMove(50, 50);

                    assert.deepEqual(lineSegments(), [], "Paths of Raphael elements");
                });

                it("from right", function () {
                    documentBody.triggerMouseDown(WIDTH + 1, 100);
                    drawingArea.triggerMouseMove(50, 50);

                    assert.deepEqual(lineSegments(), [], "Paths of Raphael elements");
                });

                it("from bottom", function () {
                    documentBody.triggerMouseDown(100, HEIGHT + 1);
                    drawingArea.triggerMouseMove(50, 50);

                    assert.deepEqual(lineSegments(), [], "Paths of Raphael elements");
                });

                it("from left", function () {
                    documentBody.triggerMouseDown(ORIGIN.x - 1, 100);
                    drawingArea.triggerMouseMove(50, 50);

                    assert.deepEqual(lineSegments(), [], "Paths of Raphael elements");
                });
            });

            describe("draw from exact edge of drawing area", function () {
                it("from origin", function () {
                    drawingArea.triggerMouseDown(ORIGIN.x, ORIGIN.y);
                    drawingArea.triggerMouseMove(50, 50);
                    drawingArea.triggerMouseUp(50, 50);

                    assert.deepEqual(lineSegments(), [[ORIGIN.x, ORIGIN.y, 50, 50]], "Paths of Raphael elements");
                });

                it("from bottom, right corner", function () {
                    drawingArea.triggerMouseDown(WIDTH, HEIGHT);
                    drawingArea.triggerMouseMove(50, 50);
                    drawingArea.triggerMouseUp(50, 50);

                    assert.deepEqual(lineSegments(), [[WIDTH, HEIGHT, 50, 50]], "Paths of Raphael elements");
                });
            });
        });

        describe("in response to touch events,", function () {
            if (!browser.supportsTouchEvents()) return;

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

        function lineSegments() {
            return svgCanvas.lineSegments();
        }
    });
}());