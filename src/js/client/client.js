/* globals Raphael:false */

(function () {
    "use strict";

    var SvgCanvas = require("./svg_canvas.js");
    var HtmlElement = require("./html_element.js");

    var windowElement = null;
    var documentBody = null;
    var drawingArea = null;
    var drawingLine = false;
    var svgCanvas = null;
    var start = null;

    exports.initializeDrawingArea = function (htmlElement) {
        if (svgCanvas !== null) throw new Error("May only initialize canvas once.");
        windowElement = new HtmlElement(window);
        documentBody = new HtmlElement(document.body);
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
        documentBody.onMouseMove(continueDrag);
        windowElement.onMouseUp(endDrag);
    }

    function singleTouchEvents() {
        drawingArea.onSingleTouchStart(startDrag);
        drawingArea.onSingleTouchMove(continueDrag);
        drawingArea.onTouchEnd(endDrag);
        drawingArea.onTouchCancel(endDrag);
    }

    function startDrag(pageOffset) {
        start = drawingArea.relativeOffset(pageOffset);
    }

    function continueDrag(pageOffset) {
        if (start === null) return;

        var end = drawingArea.relativeOffset(pageOffset);

        if (start.x !== end.x || start.y !== end.y) {
            svgCanvas.drawLine(start.x, start.y, end.x, end.y);
            start = end;
            drawingLine = true;
        }
    }

    function endDrag() {
        if (start !== null && !drawingLine) {
            svgCanvas.drawDot(start.x, start.y);
        }
        start = null;
        drawingLine = false;
    }

}());