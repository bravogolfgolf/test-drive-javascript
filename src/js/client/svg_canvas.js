/* globals Raphael:false */

(function () {
    "use strict";

    var SvgCanvas = module.exports = function (htmlElement) {
        this._paper = new Raphael(htmlElement.toDomElement());
    };

    SvgCanvas.prototype.drawLine = function (startX, startY, endX, endY) {
        this._paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
    };

    SvgCanvas.prototype.height = function () {
        return this._paper.height;
    };

    SvgCanvas.prototype.width = function () {
        return this._paper.width;
    };

    SvgCanvas.prototype.lineSegments = function () {
        var elements = [];
        this._paper.forEach(function (element) {
            elements.push(pathOf(element));
        });
        return elements;
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