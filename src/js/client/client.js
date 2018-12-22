/* globals Raphael:false, wwp:true */

wwp = {};

(function () {
    "use strict";

    var paper;

    wwp.initializeDrawingArea = function (drawingAreaId) {
        var isDraggingMouse = false;
        var startX = null;
        var startY = null;

        paper = new Raphael(drawingAreaId);

        var drawingArea = $(drawingAreaId);

        drawingArea.mousedown(function (event) {
            isDraggingMouse = true;
            var offSet = drawingArea.offset();
            startX = event.pageX - offSet.left;
            startY = event.pageY - offSet.top;
        });

        drawingArea.mousemove(function (event) {
            var offSet = drawingArea.offset();
            var endX = event.pageX - offSet.left;
            var endY = event.pageY - offSet.top;

            if (isDraggingMouse)
                wwp.drawLine(startX, startY, endX, endY);

            startX = endX;
            startY = endY;
        });

        drawingArea.mouseup(function () {
            isDraggingMouse = false;
        });

        return paper;
    };

    wwp.drawLine = function (startX, startY, endX, endY) {
        paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
    };
}());