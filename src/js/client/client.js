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

        domElement.onMouseDown(function (event) {
            event.preventDefault();
            startDrag(event.pageX, event.pageY);
        });

        domElement.onMouseMove(function (event) {
            continueDrag(event.pageX, event.pageY);
        });

        domElement.onMouseLeave(function () {
            endDrag();
        });

        domElement.onMouseUp(function () {
            endDrag();
        });

        domElement.onTouchStart(function (event) {
            event.preventDefault();
            if (event.touches.length !== 1) {
                endDrag();
                return;
            }
            startDrag(event.touches[0].pageX, event.touches[0].pageY);
        });

        domElement.onTouchMove(function (event) {
            continueDrag(event.touches[0].pageX, event.touches[0].pageY);
        });

        domElement.onTouchEnd(function () {
            endDrag();
        });

        domElement.onTouchCancel(function () {
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