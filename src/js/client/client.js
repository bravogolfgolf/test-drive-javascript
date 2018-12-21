/* globals Raphael:false, wwp:true */

wwp = {};

(function () {
    "use strict";

    var paper;

    wwp.initializeDrawingArea = function (drawingAreaId) {
        var startX = null;
        var startY = null;

        paper = new Raphael(drawingAreaId);

        var drawingArea = $(drawingAreaId);
        drawingArea.click(function (event) {
            var offSet = drawingArea.offset();
            var endX = event.pageX - offSet.left;
            var endY = event.pageY - offSet.top;

            if (startX !== null)
                wwp.drawLine(startX, startY, endX, endY);

            startX = endX;
            startY = endY;
        });
        return paper;
    };

    wwp.drawLine = function (startX, startY, endX, endY) {
        paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
    };
}());