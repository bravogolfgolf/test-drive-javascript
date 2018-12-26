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

        drawingArea.mousedown(function (event) {
            start = position(drawingArea, event.pageX, event.pageY);
            event.preventDefault();
        });

        drawingArea.mousemove(function (event) {
            if (start === null) return;

            var end = position(drawingArea, event.pageX, event.pageY);
            drawLine(start.x, start.y, end.x, end.y);
            start = end;

        });

        drawingArea.mouseleave(function () {
            start = null;
        });

        drawingArea.mouseup(function () {
            start = null;
        });

        drawingArea.on("touchstart", function (event) {
            start = position(drawingArea, event.changedTouches[0].pageX, event.changedTouches[0].pageY);
        });

        drawingArea.on("touchmove", function (event) {
            if (start === null) return;

            var end = position(drawingArea, event.changedTouches[0].pageX, event.changedTouches[0].pageY);
            drawLine(start.x, start.y, end.x, end.y);
            start = end;
        });

        drawingArea.on("touchend", function () {
            start = null;
        });

        // drawingArea.ontouchcancel(function () {
        //     start = null;
        // });
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