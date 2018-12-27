/* globals Raphael:false, wwp:true, dump:false*/

wwp = {};

(function () {
    "use strict";

    var paper = null;
    var start = null;

    wwp.initializeDrawingArea = function (drawingAreaId) {
        if (paper !== null) throw new Error("May only initialize drawing area once.");
        paper = new Raphael(drawingAreaId);
        handleEvents(drawingAreaId);
        return paper;
    };

    wwp.removeDrawingArea = function () {
        paper = null;
    };

    function handleEvents(drawingAreaId) {
        var drawingArea = $(drawingAreaId);

        drawingArea.mousedown(function (event) {
            event.preventDefault();
            start = position(drawingArea, event.pageX, event.pageY);
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
            if (event.touches.length !== 1) {
                start = null;
                return;
            }
            event.preventDefault();
            start = position(drawingArea, event.touches[0].pageX, event.touches[0].pageY);
        });

        drawingArea.on("touchmove", function (event) {
            if (start === null) return;

            var end = position(drawingArea, event.touches[0].pageX, event.touches[0].pageY);
            drawLine(start.x, start.y, end.x, end.y);
            start = end;
        });

        drawingArea.on("touchend", function () {
            start = null;
        });

        drawingArea.on("touchcancel", function () {
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