/* globals Raphael:false, wwp:true */

wwp = {};

(function () {
    "use strict";

    var paper;

    wwp.initializeDrawingArea = function (drawingAreaId) {
        paper = new Raphael(drawingAreaId);
        handleMouseEvents(drawingAreaId);
        return paper;
    };

    function handleMouseEvents(drawingAreaId) {
        var start = null;
        var drawingArea = $(drawingAreaId);

        $(document).mousedown(function (event) {
            var potentialStart = position(drawingArea, event.pageX, event.pageY);
            var top = potentialStart.y >= 0;
            var right = potentialStart.x <= paper.width;
            var bottom = potentialStart.y <= paper.height;
            var left = potentialStart.x >= 0;
            if (top && right && bottom && left) start = potentialStart;
        });

        drawingArea.mousemove(function (event) {
            if (start === null) return;

            var end = position(drawingArea, event.pageX, event.pageY);
            drawLine(start.x, start.y, end.x, end.y);
            start = end;
        });

        $(document).mouseup(function () {
            start = null;
        });
    }

    function drawLine(startX, startY, endX, endY) {
        paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
    }

    function position(drawingArea, pageX, pageY) {
        var offSet = drawingArea.offset();
        return {
            x: pageX - offSet.left,
            y: pageY - offSet.top
        };
    }
}());