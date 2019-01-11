(function () {
    "use strict";

    var assert = require("../shared/assert");
    var HtmlElement = require("./html_element.js");
    var SvgCanvas = require("./svg_canvas.js");

    describe("SvgCanvas should", function () {

        var HEIGHT = 200;
        var WIDTH = 400;

        var div;
        var documentBody;
        var svgCanvas;

        beforeEach(function (done) {
            var html = "<div id=drawingArea style='" +
                "height: " + HEIGHT + "px;" +
                "width: " + WIDTH + "px;'></div>";
            div = HtmlElement.fromHtml(html);
            documentBody = new HtmlElement(document.body);
            documentBody.append(div);
            svgCanvas = new SvgCanvas(div);
            done();
        });

        afterEach(function (done) {
            documentBody.removeEventListeners();
            div.removeEventListeners();
            div.remove();
            done();
        });

        it("have the same dimensions as enclosing div", function () {
            assert.equal(svgCanvas.height(), HEIGHT, "Svg canvas returns height");
            assert.equal(svgCanvas.width(), WIDTH, "Svg canvas returns width");
        });

        it("draw a circle when point 1 is same as point 2", function () {
            var expectedCircle = {
                x: 10,
                y: 20,
                r: 1
            };

            svgCanvas.draw(expectedCircle.x, expectedCircle.y, expectedCircle.x, expectedCircle.y);

            var elements = svgCanvas.elements();
            assert.equal(elements.length, 1);

            var actualCircle = {
                x: elements[0].attrs.cx,
                y: elements[0].attrs.cy,
                r: elements[0].attrs.r
            };
            assert.deepEqual(expectedCircle, actualCircle, "Svg Canvas draws circle");
        });

        it("draw a line with proper attributes set", function () {
            svgCanvas.draw(10, 20, 30, 40);
            var elements = svgCanvas.elements();
            assert.equal(elements.length, 1);
            assert.equal(elements[0].attrs.stroke, SvgCanvas.COLOR, "Svg Canvas line segment stroke");
            assert.equal(elements[0].attrs["stroke-width"], SvgCanvas.STROKE_WIDTH, "Svg Canvas line segment stroke width");
            assert.equal(elements[0].attrs["stroke-linecap"], SvgCanvas.STROKE_LINE_CAP, "Svg Canvas line segment stroke linecap");
        });

        it("draw circle with proper attributes set", function () {
            svgCanvas.draw(20, 30, 20, 30);
            var elements = svgCanvas.elements();
            assert.equal(elements.length, 1);
            assert.equal(elements[0].attrs.stroke, SvgCanvas.COLOR, "Svg Canvas circle stroke");
            assert.equal(elements[0].attrs.fill, SvgCanvas.COLOR, "Svg Canvas circle fill");
        });

        it("draw zero line segments", function () {
            assert.deepEqual(svgCanvas.lineSegments(), [], "Svg canvas draws no line");
        });

        it("draw line segment", function () {
            svgCanvas.draw(10, 20, 30, 40);
            assert.deepEqual(svgCanvas.lineSegments(), [[10, 20, 30, 40]], "Svg canvas draws line");
        });

        it("draws multiple line segments", function () {
            svgCanvas.draw(10, 20, 30, 40);
            svgCanvas.draw(50, 60, 70, 80);
            assert.deepEqual(svgCanvas.lineSegments(), [[10, 20, 30, 40], [50, 60, 70, 80]], "Svg canvas draws multiple lines");
        });
    });

}());