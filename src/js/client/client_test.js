/* globals wwp:true, dump:false */

(function () {
    "use strict";

    var assert = require("../shared/assert");
    var div;

    describe("Drawing area", function () {

        afterEach(function () {
            $(div).remove();
        });

        it("should be initialized with Raphael", function () {
            setUpDOM("<div></div>");

            wwp.initializeDrawingArea(div[0]);

            var tagName = $(div).children()[0].tagName;
            assert.equal(tagName, "svg");
        });

        it("should have the same dimensions as enclosing div", function () {
            setUpDOM("<div id='wwp-drawingArea' style='height:200px; width:400px'></div>");

            var paper = wwp.initializeDrawingArea(div[0]);

            assert.equal(paper.height, 200);
            assert.equal(paper.width, 400);
        });

        it("draw a line", function () {
            setUpDOM("<div id='wwp-drawingArea' style='height:200px; width:400px'></div>");

            var paper = wwp.initializeDrawingArea(div[0]);
            wwp.drawLine(20, 30, 30, 300);

            var elements = [];
            paper.forEach(function (element) {
                elements.push(element);
            });
            assert.equal(elements.length, 1);

            var path = pathFor(elements[0]);
            assert.equal(path, "M20,30L30,300");

        });

        function setUpDOM(string) {
            div = $(string);
            $(document.body).append(div);
        }

        function pathFor(element) {
            var path = element.node.attributes.d.value;
            if (path.indexOf(",") !== -1) {
                return path;
            } else {
                var ie11RegEx = /M (\d+) (\d+) L (\d+) (\d+)/;
                var ie11 = path.match(ie11RegEx);
                return "M" + ie11[1] + "," + ie11[2] + "L" + ie11[3] + "," + ie11[4];
            }
        }
    });
}());