/* globals Raphael:false, wwp:true, dump:false*/

window.wwp = window.wwp || {};

(function () {
    "use strict";

    var paper = null;
    var domElement = null;
    var start = null;

    wwp.initializeDrawingArea = function (drawingAreaId) {
        if (paper !== null) throw new Error("May only initialize drawing area once.");
        paper = new Raphael(drawingAreaId);
        domElement = new wwp.DomElement(drawingAreaId);
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
        domElement.onMultiTouchStart(endDrag);

    }

    function preventDefaults() {
        domElement.onMouseDown(function (undefined, event) {
            event.preventDefault();
        });

        domElement.onSingleTouchStart(function (undefined, event) {
            event.preventDefault();
        });

        domElement.onMultiTouchStart(function (event) {
            event.preventDefault();
        });
    }

    function mouseEvents() {
        domElement.onMouseDown(startDrag);
        domElement.onMouseMove(continueDrag);
        domElement.onMouseLeave(endDrag);
        domElement.onMouseUp(endDrag);
    }

    function singleTouchEvents() {
        domElement.onSingleTouchStart(startDrag);
        domElement.onSingleTouchMove(continueDrag);
        domElement.onSingleTouchEnd(endDrag);
        domElement.onSingleTouchCancel(endDrag);
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