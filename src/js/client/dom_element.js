/* globals wwp:true, Touch:false, TouchEvent:false */

window.wwp = window.wwp || {};

(function () {
    "use strict";

    var DomElement = wwp.DomElement = function DomElement(element) {
        this.element = $(element);
        this.offset = this.element.offset();
    };

    DomElement.prototype.touchStart = function (x, y) {
        var points = [{x: x, y: y}];
        touchEvent(this, "touchstart", points);
    };


    DomElement.prototype.touchMove = function (x, y) {
        var points = [{x: x, y: y}];
        touchEvent(this, "touchmove", points);
    };

    DomElement.prototype.touchEnd = function (x, y) {
        var points = [{x: x, y: y}];
        touchEvent(this, "touchend", points);
    };

    DomElement.prototype.touchCancel = function (x, y) {
        var points = [{x: x, y: y}];
        touchEvent(this, "touchcancel", points);
    };

    DomElement.prototype.multiTouchStart = function (point1, point2) {
        var points = [point1, point2];
        touchEvent(this, "touchstart", points);
    };

    function touchEvent(self, type, points) {
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

    function createTouch(self, identifier, target, point) {
        return new Touch({
            identifier: identifier,
            target: target,
            pageX: point.x + self.offset.left,
            pageY: point.y + self.offset.top
        });
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


    DomElement.prototype.mouseDown = function (x, y) {
        mouseEvent(this, "mousedown", x, y);
    };

    DomElement.prototype.mouseMove = function (x, y) {
        mouseEvent(this, "mousemove", x, y);
    };

    DomElement.prototype.mouseLeave = function (x, y) {
        mouseEvent(this, "mouseleave", x, y);
    };

    DomElement.prototype.mouseUp = function (x, y) {
        mouseEvent(this, "mouseup", x, y);
    };

    function mouseEvent(self, type, x, y) {
        var event = new jQuery.Event(type);
        event.pageX = x + self.offset.left;
        event.pageY = y + self.offset.top;
        self.element.trigger(event);
    }


    DomElement.prototype.onMouseDown = function (callback) {
        this.element.mousedown(mouseEventHandlerFn(this, callback));
    };

    DomElement.prototype.onMouseMove = function (callback) {
        this.element.mousemove(mouseEventHandlerFn(this, callback));
    };

    DomElement.prototype.onMouseLeave = function (callback) {
        this.element.mouseleave(mouseEventHandlerFn(this, callback));
    };

    DomElement.prototype.onMouseUp = function (callback) {
        this.element.mouseup(mouseEventHandlerFn(this, callback));
    };

    function mouseEventHandlerFn(self, callback) {
        return function (event) {
            var point = self.removeOffsetFrom(event.pageX, event.pageY);
            callback(point, event);
        };
    }

    DomElement.prototype.onSingleTouchStart = function (callback) {
        this.element.on("touchstart", singleTouchEventHandlerFn(this, callback));
    };

    DomElement.prototype.onSingleTouchMove = function (callback) {
        this.element.on("touchmove", singleTouchEventHandlerFn(this, callback));
    };

    DomElement.prototype.onSingleTouchEnd = function (callback) {
        this.element.on("touchend", singleTouchEventHandlerFn(this, callback));
    };

    DomElement.prototype.onSingleTouchCancel = function (callback) {
        this.element.on("touchcancel", singleTouchEventHandlerFn(this, callback));
    };

    function singleTouchEventHandlerFn(self, callback) {
        return function (event) {
            if (event.touches.length !== 1) return;
            var adjusted = self.removeOffsetFrom(event.touches[0].pageX, event.touches[0].pageY);
            callback(adjusted, event);
        };
    }

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
}());