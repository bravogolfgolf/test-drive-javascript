/* globals wwp:true */

window.wwp = window.wwp || {};

(function () {
    "use strict";

    var DomElement = wwp.DomElement = function DomElement(element) {
        this.element = $(element);
        this.offset = this.element.offset();
    };

    DomElement.prototype.onMouseDown = function (callback) {
        this.element.mousedown(callback);
    };

    DomElement.prototype.onMouseMove = function (callback) {
        this.element.mousemove(callback);
    };

    DomElement.prototype.onMouseLeave = function (callback) {
        this.element.mouseleave(callback);
    };

    DomElement.prototype.onMouseUp = function (callback) {
        this.element.mouseup(callback);
    };

    DomElement.prototype.onTouchStart = function (callback) {
        this.element.on("touchstart", callback);
    };

    DomElement.prototype.onTouchMove = function (callback) {
        this.element.on("touchmove", callback);
    };

    DomElement.prototype.onTouchEnd = function (callback) {
        this.element.on("touchend", callback);
    };

    DomElement.prototype.onTouchCancel = function (callback) {
        this.element.on("touchcancel", callback);
    };

    DomElement.prototype.removeOffsetFrom = function (pageX, pageY) {
        return {
            x: pageX - this.offset.left,
            y: pageY - this.offset.top
        };
    };
}());