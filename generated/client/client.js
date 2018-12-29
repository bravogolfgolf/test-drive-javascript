/* globals Raphael:false */

window.wwp = window.wwp || {};

(function () {
    "use strict";

    var paper = null;
    var drawingArea = null;
    var start = null;

    wwp.initializeDrawingArea = function (htmlElement) {
        if (paper !== null) throw new Error("May only initialize drawing area once.");
        drawingArea = htmlElement;
        paper = new Raphael($(drawingArea.element).get(0));
        handleEvents();
        return paper;
    };

    wwp.removeDrawingArea = function () {
        paper = null;
    };

    function handleEvents() {
        preventDefaults();
        mouseEvents();
        singleTouchEvents();
        drawingArea.onMultiTouchStart(endDrag);

    }

    function preventDefaults() {
        drawingArea.onMouseDown(function (undefined, event) {
            event.preventDefault();
        });

        drawingArea.onSingleTouchStart(function (undefined, event) {
            event.preventDefault();
        });

        drawingArea.onMultiTouchStart(function (event) {
            event.preventDefault();
        });
    }

    function mouseEvents() {
        drawingArea.onMouseDown(startDrag);
        drawingArea.onMouseMove(continueDrag);
        drawingArea.onMouseLeave(endDrag);
        drawingArea.onMouseUp(endDrag);
    }

    function singleTouchEvents() {
        drawingArea.onSingleTouchStart(startDrag);
        drawingArea.onSingleTouchMove(continueDrag);
        drawingArea.onSingleTouchEnd(endDrag);
        drawingArea.onSingleTouchCancel(endDrag);
    }

    function startDrag(point) {
        start = point;
    }

    function continueDrag(point) {
        if (start === null) return;
        var end = point;
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