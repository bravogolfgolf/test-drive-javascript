/* globals wwp:true, dump:false */

(function () {
    "use strict";

    var assert = require("../shared/assert");

    var drawingArea;
    var paper;

    describe("Drawing area", function () {

        beforeEach(function () {
            var html = "<div id='wwp-drawingArea' style='height:200px; width:400px'></div>";
            drawingArea = $(html);
            $(document.body).append(drawingArea);
            paper = wwp.initializeDrawingArea(drawingArea[0]);
        });

        afterEach(function () {
            $(drawingArea).remove();
        });

        it("should have the same dimensions as enclosing div", function () {
            assert.equal(paper.height, 200);
            assert.equal(paper.width, 400);
        });

        it("draw a line", function () {
            wwp.drawLine(20, 30, 30, 300);

            var elements = elementsOf(paper);
            assert.equal(elements.length, 1);
            assert.equal(pathOf(elements[0]), "M20,30L30,300");
        });

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