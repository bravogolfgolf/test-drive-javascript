/* globals Raphael:false, wwp:true, dump:false*/

window.wwp = window.wwp || {};

(function () {
    "use strict";

    var paper = null;
    var drawingArea = null;
    var domElement = null;
    var start = null;

    wwp.initializeDrawingArea = function (drawingAreaId) {
        if (paper !== null) throw new Error("May only initialize drawing area once.");
        paper = new Raphael(drawingAreaId);
        domElement = new wwp.DomElement($(drawingAreaId));
        drawingArea = $(drawingAreaId);
        handleEvents();
        return paper;
    };

    wwp.removeDrawingArea = function () {
        paper = null;
    };

    function handleEvents() {

        drawingArea.mousedown(function (event) {
            event.preventDefault();
            startDrag(event.pageX, event.pageY);
        });

        drawingArea.mousemove(function (event) {
            continueDrag(event.pageX, event.pageY);
        });

        drawingArea.mouseleave(function () {
            endDrag();
        });

        drawingArea.mouseup(function () {
            endDrag();
        });

        drawingArea.on("touchstart", function (event) {
            event.preventDefault();
            if (event.touches.length !== 1) {
                endDrag();
                return;
            }
            startDrag(event.touches[0].pageX, event.touches[0].pageY);
        });

        drawingArea.on("touchmove", function (event) {
            continueDrag(event.touches[0].pageX, event.touches[0].pageY);
        });

        drawingArea.on("touchend", function () {
            endDrag();
        });

        drawingArea.on("touchcancel", function () {
            endDrag();
        });
    }

    function startDrag(pageX, pageY) {
        start = domElement.removeOffsetFrom(pageX, pageY);
    }

    function continueDrag(pageX, pageY) {
        if (start === null) return;
        var end = domElement.removeOffsetFrom(pageX, pageY);
        drawLine(start.x, start.y, end.x, end.y);
        start = end;
    }

    function endDrag() {
        start = null;
    }

    function drawLine(startX, startY, endX, endY) {
        paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
    }

}());