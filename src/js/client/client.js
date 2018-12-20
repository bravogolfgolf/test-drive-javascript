/* globals Raphael:false, wwp:true */

wwp = {};

(function () {
    "use strict";

    var paper;

    wwp.initializeDrawingArea = function (drawingAreaId) {
        var drawingArea = $(drawingAreaId);

        drawingArea.click(function (event) {
            var offSet = drawingArea.offset();
            wwp.drawLine(0, 0, event.pageX - offSet.left, event.pageY - offSet.top);
        });


        paper = new Raphael(drawingAreaId);
        return paper;
    };

    wwp.drawLine = function (startX, startY, endX, endY) {
        paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
    };
}());