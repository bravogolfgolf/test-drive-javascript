/* globals wwp:true, Touch:false, TouchEvent:false */

window.wwp = window.wwp || {};

(function () {
    "use strict";

    var DomElement = wwp.DomElement = function DomElement(element) {
        this.element = $(element);
        this.offset = this.element.offset();
    };

    DomElement.prototype.doMouseDown = function (x, y) {
        doMouseEvent(this, "mousedown", x, y);
    };

    DomElement.prototype.doMouseMove = function (x, y) {
        doMouseEvent(this, "mousemove", x, y);
    };

    DomElement.prototype.doMouseLeave = function (x, y) {
        doMouseEvent(this, "mouseleave", x, y);
    };

    DomElement.prototype.doMouseUp = function (x, y) {
        doMouseEvent(this, "mouseup", x, y);
    };

    DomElement.prototype.onMouseDown = function (callback) {
        this.element.mousedown(onMouseEventHandlerFn(this, callback));
    };

    DomElement.prototype.onMouseMove = function (callback) {
        this.element.mousemove(onMouseEventHandlerFn(this, callback));
    };

    DomElement.prototype.onMouseLeave = function (callback) {
        this.element.mouseleave(onMouseEventHandlerFn(this, callback));
    };

    DomElement.prototype.onMouseUp = function (callback) {
        this.element.mouseup(onMouseEventHandlerFn(this, callback));
    };

    DomElement.prototype.doSingleTouchStart = function (x, y) {
        doTouchEvent(this, "touchstart", [{x: x, y: y}]);
    };

    DomElement.prototype.doSingleTouchMove = function (x, y) {
        doTouchEvent(this, "touchmove", [{x: x, y: y}]);
    };

    DomElement.prototype.doSingleTouchEnd = function (x, y) {
        doTouchEvent(this, "touchend", [{x: x, y: y}]);
    };

    DomElement.prototype.doSingleTouchCancel = function (x, y) {
        doTouchEvent(this, "touchcancel", [{x: x, y: y}]);
    };

    DomElement.prototype.onSingleTouchStart = function (callback) {
        this.element.on("touchstart", onSingleTouchEventHandlerFn(this, callback));
    };

    DomElement.prototype.onSingleTouchMove = function (callback) {
        this.element.on("touchmove", onSingleTouchEventHandlerFn(this, callback));
    };

    DomElement.prototype.onSingleTouchEnd = function (callback) {
        this.element.on("touchend", onSingleTouchEventHandlerFn(this, callback));
    };

    DomElement.prototype.onSingleTouchCancel = function (callback) {
        this.element.on("touchcancel", onSingleTouchEventHandlerFn(this, callback));
    };

    DomElement.prototype.doMultiTouchStart = function (point1, point2) {
        doTouchEvent(this, "touchstart", [point1, point2]);
    };

    DomElement.prototype.onMultiTouchStart = function (callback) {
        this.element.on("touchstart", function (event) {
            if (event.touches.length !== 1) callback(event);
        });
    };

    DomElement.prototype.removeOffsetFrom = function (pageX, pageY) {
        return {
            x: pageX - this.offset.left,
            y: pageY - this.offset.top
        };
    };

    function doMouseEvent(self, type, x, y) {
        var event = new jQuery.Event(type);
        event.pageX = x + self.offset.left;
        event.pageY = y + self.offset.top;
        self.element.trigger(event);
    }

    function onMouseEventHandlerFn(self, callback) {
        return function (event) {
            var point = self.removeOffsetFrom(event.pageX, event.pageY);
            callback(point, event);
        };
    }

    function doTouchEvent(self, type, points) {
        var target = self.element[0];
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
            var adjusted = self.removeOffsetFrom(event.touches[0].pageX, event.touches[0].pageY);
            callback(adjusted, event);
        };
    }
}());