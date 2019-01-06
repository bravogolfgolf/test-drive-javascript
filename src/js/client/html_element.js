/* globals Touch:false, TouchEvent:false */

(function () {
    "use strict";

    var HtmlElement = module.exports = function (html) {
        this._element = $(html);
    };

    HtmlElement.fromHtml = function (html) {
        return new HtmlElement($(html));
    };

    HtmlElement.prototype.toDomElement = function () {
        return this._element.get(0);
    };

    HtmlElement.prototype.relativeCoordinate = function (pageCoordinate) {
        return subtractOffset(this, pageCoordinate.x, pageCoordinate.y);
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
        var adjusted = addOffset(self, x, y);
        var event = new jQuery.Event(type);
        event.pageX = adjusted.x;
        event.pageY = adjusted.y;
        self._element.trigger(event);
    }

    function onMouseEventHandlerFn(self, callback) {
        return function (event) {
            var point = subtractOffset(self, event.pageX, event.pageY);
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
        var adjusted = addOffset(self, point.x, point.y);
        return new Touch({
            identifier: identifier,
            target: target,
            pageX: adjusted.x,
            pageY: adjusted.y
        });
    }

    function onSingleTouchEventHandlerFn(self, callback) {
        return function (event) {
            if (event.touches.length !== 1) return;
            var adjusted = subtractOffset(self, event.touches[0].pageX, event.touches[0].pageY);
            callback(adjusted, event);
        };
    }

    function addOffset(self, x, y){
        var offset = self._element.offset();
        return {
            x: x + offset.left,
            y: y + offset.top
        };
    }

    function subtractOffset(self, pageX, pageY) {
        var offset = self._element.offset();
        return {
            x: pageX - offset.left,
            y: pageY - offset.top
        };
    }
}());