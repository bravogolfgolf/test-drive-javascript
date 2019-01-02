(function () {
    "use strict";

    var assert = require("../shared/assert");

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
            div = wwp.HtmlElement.fromHtml(html);
            documentBody = new wwp.HtmlElement(document.body);
            documentBody.append(div);
            svgCanvas = new wwp.SvgCanvas(div);
            done();
        });

        afterEach(function (done) {
            div.remove();
            wwp.removeDrawingArea();
            done();
        });

        it("return height and width", function () {
            assert.equal(svgCanvas.height(), HEIGHT, "Svg canvas returns height");
            assert.equal(svgCanvas.width(), WIDTH, "Svg canvas returns width");
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