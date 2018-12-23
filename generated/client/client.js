/* globals Raphael:false, wwp:true, dump:false*/

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
            if (isInDrawingArea(potentialStart)) start = potentialStart;
        });

        $(document).mousemove(function (event) {
            if (start === null) return;

            var end = position(drawingArea, event.pageX, event.pageY);
            if (isInDrawingArea(end)) {
                drawLine(start.x, start.y, end.x, end.y);
                start = end;
            } else {
                start = null;
            }
        });

        $(document).mouseup(function () {
            start = null;
        });
    }

    function isInDrawingArea(point) {
        var top = point.y >= 0;
        var right = point.x <= paper.width;
        var bottom = point.y <= paper.height;
        var left = point.x >= 0;
        return top && right && bottom && left;
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