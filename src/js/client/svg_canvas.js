/* globals Raphael:false */

(function () {
    "use strict";


    var SvgCanvas = module.exports = function (htmlElement) {
        this._paper = new Raphael(htmlElement.toDomElement());
    };

    SvgCanvas.COLOR = "black";
    SvgCanvas.STROKE_WIDTH = 2;
    SvgCanvas.STROKE_LINE_CAP = "round";

    SvgCanvas.prototype.draw = function (startX, startY, endX, endY) {
        if (startX === endX && startY === endY) {
            this._paper.circle(startX, startY, SvgCanvas.STROKE_WIDTH / 2)
                .attr({
                    "stroke": SvgCanvas.COLOR,
                    "fill": SvgCanvas.COLOR
                });
            return;
        }

        this._paper.path("M" + startX + "," + startY + "L" + endX + "," + endY)
            .attr({
                "stroke": SvgCanvas.COLOR,
                "stroke-width": SvgCanvas.STROKE_WIDTH,
                "stroke-linecap": SvgCanvas.STROKE_LINE_CAP
            });
    };

    SvgCanvas.prototype.height = function () {
        return this._paper.height;
    };

    SvgCanvas.prototype.width = function () {
        return this._paper.width;
    };

    SvgCanvas.prototype.elements = function () {
        var elements = [];
        this._paper.forEach(function (element) {
            elements.push(element);
        });
        return elements;
    };

    SvgCanvas.prototype.lineSegments = function () {
        var paths = [];
        this._paper.forEach(function (element) {
            if (element.type === "path") paths.push(pathOf(element));
        });
        return paths;
    };

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
}());