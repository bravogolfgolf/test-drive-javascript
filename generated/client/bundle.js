require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"./client.js":[function(require,module,exports){
/* globals Raphael:false */

(function () {
    "use strict";

    var SvgCanvas = require("./svg_canvas.js");
    var HtmlElement = require("./html_element.js");

    var windowElement = null;
    var documentBody = null;
    var drawingArea = null;
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
        drawingArea.onSingleTouchEnd(endDrag);
        drawingArea.onSingleTouchCancel(endDrag);
    }

    function startDrag(pageOffset) {
        start = drawingArea.relativeOffset(pageOffset);
    }

    function continueDrag(pageOffset) {
        if (start === null) return;
        var end = drawingArea.relativeOffset(pageOffset);
        svgCanvas.drawLine(start.x, start.y, end.x, end.y);
        start = end;
    }

    function endDrag() {
        start = null;
    }

}());
},{"./html_element.js":"./html_element.js","./svg_canvas.js":1}],"./html_element.js":[function(require,module,exports){
/* globals Touch:false, TouchEvent:false */

(function () {
    "use strict";

    var HtmlElement = module.exports = function (html) {
        this._element = $(html);
    };

    HtmlElement.fromHtml = function (html) {
        return new HtmlElement($(html));
    };

    HtmlElement.prototype.append = function (elementToAppend) {
        this._element.append(elementToAppend._element);
    };

    HtmlElement.prototype.remove = function () {
        this._element.remove();
    };

    HtmlElement.prototype.toDomElement = function () {
        return this._element.get(0);
    };

    HtmlElement.prototype.removeEventListeners = function () {
        this._element.off();
    };

    HtmlElement.prototype.pageOffset = function (elementCoordinate) {
        return pageOffset(this, elementCoordinate.x, elementCoordinate.y);
    };

    function pageOffset(self, x, y) {
        var offset = self._element.offset();
        return {
            x: x + offset.left,
            y: y + offset.top
        };
    }

    HtmlElement.prototype.relativeOffset = function (pageCoordinate) {
        return relativeOffset(this, pageCoordinate.x, pageCoordinate.y);
    };

    function relativeOffset(self, pageX, pageY) {
        var offset = self._element.offset();
        return {
            x: pageX - offset.left,
            y: pageY - offset.top
        };
    }

    HtmlElement.prototype.triggerMouseClick = triggerMouseEventFn("click");

    HtmlElement.prototype.triggerMouseDown = triggerMouseEventFn("mousedown");

    HtmlElement.prototype.triggerMouseMove = triggerMouseEventFn("mousemove");

    HtmlElement.prototype.triggerMouseLeave = triggerMouseEventFn("mouseleave");

    HtmlElement.prototype.triggerMouseUp = triggerMouseEventFn("mouseup");

    function triggerMouseEventFn(eventType) {
        return function (x, y) {
            triggerMouseEvent(this, eventType, x, y);
        };
    }

    function triggerMouseEvent(self, type, x, y) {
        var pageOffset = handleUndefinedCoordinate(self, x, y);

        var event = new jQuery.Event(type);
        event.pageX = pageOffset.x;
        event.pageY = pageOffset.y;
        self._element.trigger(event);
    }

    function handleUndefinedCoordinate(self, x, y) {
        if (x === undefined || y === undefined) {
            return {x: 0, y: 0};
        } else {
            return pageOffset(self, x, y);
        }
    }

    HtmlElement.prototype.onMouseClick = onMouseEventFn("click");

    HtmlElement.prototype.onMouseDown = onMouseEventFn("mousedown");

    HtmlElement.prototype.onMouseMove = onMouseEventFn("mousemove");

    HtmlElement.prototype.onMouseLeave = onMouseEventFn("mouseleave");

    HtmlElement.prototype.onMouseUp = onMouseEventFn("mouseup");

    function onMouseEventFn(eventType) {
        return function (callback) {
            this._element.on(eventType, onMouseEventHandlerFn(this, callback));
        };
    }

    function onMouseEventHandlerFn(self, callback) {
        return function (event) {
            var pageOffset = {x: event.pageX, y: event.pageY};
            callback(pageOffset, event);
        };
    }

    HtmlElement.prototype.doSingleTouchStart = doSingleTouchFn("touchstart");

    HtmlElement.prototype.doSingleTouchMove = doSingleTouchFn("touchmove");

    HtmlElement.prototype.doSingleTouchEnd = doSingleTouchFn("touchend");

    HtmlElement.prototype.doSingleTouchCancel = doSingleTouchFn("touchcancel");

    function doSingleTouchFn(eventType) {
        return function (x, y) {
            doTouchEvent(this, eventType, [{x: x, y: y}]);
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
        var pageOffset = handleUndefinedCoordinate(self, point.x, point.y);
        return new Touch({
            identifier: identifier,
            target: target,
            pageX: pageOffset.x,
            pageY: pageOffset.y
        });
    }

    HtmlElement.prototype.onSingleTouchStart = onSingleTouchFn("touchstart");

    HtmlElement.prototype.onSingleTouchMove = onSingleTouchFn("touchmove");

    HtmlElement.prototype.onSingleTouchEnd = onSingleTouchFn("touchend");

    HtmlElement.prototype.onSingleTouchCancel = onSingleTouchFn("touchcancel");

    function onSingleTouchFn(eventType) {
        return function (callback) {
            this._element.on(eventType, onSingleTouchEventHandlerFn(this, callback));
        };
    }

    function onSingleTouchEventHandlerFn(self, callback) {
        return function (event) {
            if (event.touches.length !== 1) return;
            var pageOffset = {x: event.touches[0].pageX, y: event.touches[0].pageY};
            callback(pageOffset, event);
        };
    }

    HtmlElement.prototype.doMultiTouchStart = function (point1, point2) {
        doTouchEvent(this, "touchstart", [point1, point2]);
    };

    HtmlElement.prototype.onMultiTouchStart = function (callback) {
        this._element.on("touchstart", function (event) {
            if (event.touches.length !== 1) callback(event);
        });
    };
}());
},{}],1:[function(require,module,exports){
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
},{}]},{},[]);
