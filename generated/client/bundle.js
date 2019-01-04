(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* globals Raphael:false */

window.wwp = window.wwp || {};

(function () {
    "use strict";

    var SvgCanvas = require("./svg_canvas.js");

    var svgCanvas = null;
    var drawingArea = null;
    var start = null;

    exports.initializeDrawingArea = wwp.initializeDrawingArea = function (htmlElement) {
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

    function startDrag(point) {
        start = point;
    }

    function continueDrag(point) {
        if (start === null) return;
        var end = point;
        svgCanvas.drawLine(start.x, start.y, end.x, end.y);
        start = end;
    }

    function endDrag() {
        start = null;
    }

}());
},{"./svg_canvas.js":3}],2:[function(require,module,exports){
/* globals Touch:false, TouchEvent:false */

(function () {
    "use strict";

    var HtmlElement = module.exports = wwp.HtmlElement = function (html) {
        this._element = $(html);
        this.offset = this._element.offset();
    };

    HtmlElement.fromHtml = function (html) {
        return new HtmlElement($(html));
    };

    HtmlElement.prototype.toDomElement = function () {
        return this._element.get(0);
    };

    HtmlElement.prototype.append = function (elementToAppend) {
        this._element.append(elementToAppend._element);
    };

    HtmlElement.prototype.remove = function () {
        this._element.remove();
    };

    HtmlElement.prototype.doMouseDown = function (x, y) {
        doMouseEvent(this, "mousedown", x, y);
    };

    HtmlElement.prototype.doMouseMove = function (x, y) {
        doMouseEvent(this, "mousemove", x, y);
    };

    HtmlElement.prototype.doMouseLeave = function (x, y) {
        doMouseEvent(this, "mouseleave", x, y);
    };

    HtmlElement.prototype.doMouseUp = function (x, y) {
        doMouseEvent(this, "mouseup", x, y);
    };

    HtmlElement.prototype.onMouseDown = function (callback) {
        this._element.mousedown(onMouseEventHandlerFn(this, callback));
    };

    HtmlElement.prototype.onMouseMove = function (callback) {
        this._element.mousemove(onMouseEventHandlerFn(this, callback));
    };

    HtmlElement.prototype.onMouseLeave = function (callback) {
        this._element.mouseleave(onMouseEventHandlerFn(this, callback));
    };

    HtmlElement.prototype.onMouseUp = function (callback) {
        this._element.mouseup(onMouseEventHandlerFn(this, callback));
    };

    HtmlElement.prototype.doSingleTouchStart = function (x, y) {
        doTouchEvent(this, "touchstart", [{x: x, y: y}]);
    };

    HtmlElement.prototype.doSingleTouchMove = function (x, y) {
        doTouchEvent(this, "touchmove", [{x: x, y: y}]);
    };

    HtmlElement.prototype.doSingleTouchEnd = function (x, y) {
        doTouchEvent(this, "touchend", [{x: x, y: y}]);
    };

    HtmlElement.prototype.doSingleTouchCancel = function (x, y) {
        doTouchEvent(this, "touchcancel", [{x: x, y: y}]);
    };

    HtmlElement.prototype.onSingleTouchStart = function (callback) {
        this._element.on("touchstart", onSingleTouchEventHandlerFn(this, callback));
    };

    HtmlElement.prototype.onSingleTouchMove = function (callback) {
        this._element.on("touchmove", onSingleTouchEventHandlerFn(this, callback));
    };

    HtmlElement.prototype.onSingleTouchEnd = function (callback) {
        this._element.on("touchend", onSingleTouchEventHandlerFn(this, callback));
    };

    HtmlElement.prototype.onSingleTouchCancel = function (callback) {
        this._element.on("touchcancel", onSingleTouchEventHandlerFn(this, callback));
    };

    HtmlElement.prototype.doMultiTouchStart = function (point1, point2) {
        doTouchEvent(this, "touchstart", [point1, point2]);
    };

    HtmlElement.prototype.onMultiTouchStart = function (callback) {
        this._element.on("touchstart", function (event) {
            if (event.touches.length !== 1) callback(event);
        });
    };

    function doMouseEvent(self, type, x, y) {
        var event = new jQuery.Event(type);
        event.pageX = x + self.offset.left;
        event.pageY = y + self.offset.top;
        self._element.trigger(event);
    }

    function onMouseEventHandlerFn(self, callback) {
        return function (event) {
            var point = removeOffsetFrom(self, event.pageX, event.pageY);
            callback(point, event);
        };
    }

    function doTouchEvent(self, type, points) {
        var target = self._element[0];
        var touchList = createTouchList(self, points, target);
        var touchEvent = createTouchEvent(type, touchList);

        target.dispatchEvent(touchEvent);
    }

    function createTouchList(self, points, target) {
        var touchList = [];
        var identifier = 0;
        points.forEach(function (point) {
            var touch = createTouch(self, identifier, target, point);
            identifier++;
            touchList.push(touch);
        });
        return touchList;
    }

    function createTouchEvent(type, touchList) {
        return new TouchEvent(type, {
            cancelable: true,
            bubbles: true,
            touches: touchList,
            targetTouches: touchList,
            changedTouches: touchList
        });
    }

    function createTouch(self, identifier, target, point) {
        return new Touch({
            identifier: identifier,
            target: target,
            pageX: point.x + self.offset.left,
            pageY: point.y + self.offset.top
        });
    }

    function onSingleTouchEventHandlerFn(self, callback) {
        return function (event) {
            if (event.touches.length !== 1) return;
            var adjusted = removeOffsetFrom(self, event.touches[0].pageX, event.touches[0].pageY);
            callback(adjusted, event);
        };
    }

    function removeOffsetFrom(self, pageX, pageY) {
        return {
            x: pageX - self.offset.left,
            y: pageY - self.offset.top
        };
    }
}());
},{}],3:[function(require,module,exports){
/* globals Raphael:false */

(function () {
    "use strict";

    var SvgCanvas = module.exports = function (htmlElement) {
        this._paper = new Raphael(htmlElement.toDomElement());
    };

    SvgCanvas.prototype.drawLine = function (startX, startY, endX, endY) {
        this._paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
    };

    SvgCanvas.prototype.height = function () {
        return this._paper.height;
    };

    SvgCanvas.prototype.width = function () {
        return this._paper.width;
    };

    SvgCanvas.prototype.lineSegments = function () {
        var elements = [];
        this._paper.forEach(function (element) {
            elements.push(pathOf(element));
        });
        return elements;
    };

    function pathOf(element) {
        var regEx = null;
        var path = element.node.attributes.d.value;

        if (path.indexOf(",") !== -1) {
            regEx = /M(\d+),(\d+)L(\d+),(\d+)/;
        } else if ((path.indexOf(" ") !== -1)) {
            regEx = /M (\d+) (\d+) L (\d+) (\d+)/;
        } else throw new Error("No match of expected Raphael path.");

        var items = path.match(regEx);
        return [parseInt(items[1]), parseInt(items[2]), parseInt(items[3]), parseInt(items[4])];
    }

}());
},{}]},{},[1,2]);
