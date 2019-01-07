/* globals Raphael:false */

(function () {
    "use strict";

    var SvgCanvas = require("./svg_canvas.js");

    var svgCanvas = null;
    var drawingArea = null;
    var start = null;

    exports.initializeDrawingArea = function (htmlElement) {
        if (svgCanvas !== null) throw new Error("May only initialize canvas once.");
        drawingArea = htmlElement;
        svgCanvas = new SvgCanvas(drawingArea);
        handleEvents();
        return svgCanvas;
    };

    exports.removeDrawingArea = function () {
        svgCanvas = null;
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

    function startDrag(pageOffset) {
        start = drawingArea.toElementOffset(pageOffset);
    }

    function continueDrag(pageOffset) {
        if (start === null) return;
        var end = drawingArea.toElementOffset(pageOffset);
        svgCanvas.drawLine(start.x, start.y, end.x, end.y);
        start = end;
    }

    function endDrag() {
        start = null;
    }

}());