/* globals wwp:true */

window.wwp = window.wwp || {};

(function () {
    "use strict";

    var DomElement = wwp.DomElement = function DomElement(element) {
        this.element = $(element);
        this.offset = this.element.offset();
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