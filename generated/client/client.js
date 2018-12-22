/* globals Raphael:false, wwp:true */

wwp = {};

(function () {
    "use strict";

    var paper;

    wwp.initializeDrawingArea = function (drawingAreaId) {
        var start = null;
        var drawingArea = $(drawingAreaId);

        paper = new Raphael(drawingAreaId);

        $(document).mousedown(function (event) {
            start = position(drawingArea, event.pageX, event.pageY);
        });

        drawingArea.mousemove(function (event) {
            if (start === null) return;

            var end = position(drawingArea, event.pageX, event.pageY);
            wwp.drawLine(start.x, start.y, end.x, end.y);
            start = end;
        });

        $(document).mouseup(function () {
            start = null;
        });

        return paper;
    };

    wwp.drawLine = function (startX, startY, endX, endY) {
        paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
    };

    function position(drawingArea, pageX, pageY) {
        var offSet = drawingArea.offset();
        return {
            x: pageX - offSet.left,
            y: pageY - offSet.top
        };
    }
}());