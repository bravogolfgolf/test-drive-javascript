(function () {
    "use strict";

    var assert = require("../shared/assert");

    describe("SvgCanvas should", function () {

        var div;
        var svgCanvas;

        beforeEach(function (done) {
            div = wwp.HtmlElement.fromHtml("<div></div>");
            svgCanvas = new wwp.SvgCanvas(div);
            done();
        });

        afterEach(function (done) {
            div.remove();
            wwp.removeDrawingArea();
            done();
        });

        it("draw zero line segments", function () {
            assert.deepEqual(svgCanvas.lineSegments(), [], "Svg canvas draws no line");
        });

        it("draw line segment", function () {
            svgCanvas.drawLine(10, 20, 30, 40);
            assert.deepEqual(svgCanvas.lineSegments(), [[10, 20, 30, 40]], "Svg canvas draws line");
        });

        it("draws multiple line segments", function () {
            svgCanvas.drawLine(10, 20, 30, 40);
            svgCanvas.drawLine(50, 60, 70, 80);
            assert.deepEqual(svgCanvas.lineSegments(), [[10, 20, 30, 40], [50, 60, 70, 80]], "Svg canvas draws multiple lines");
        });
    });

}());