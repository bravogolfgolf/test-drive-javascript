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

    // HtmlElement.prototype.doSingleTouchEnd = doSingleTouchFn("touchend");

    // HtmlElement.prototype.doSingleTouchCancel = doSingleTouchFn("touchcancel");

    HtmlElement.prototype.triggerTouchEnd = function () {
        doTouchEvent(this, "touchend", []);
    };

    HtmlElement.prototype.triggerTouchCancel = function () {
        doTouchEvent(this, "touchcancel", []);
    };

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

    HtmlElement.prototype.onTouchEnd = function (callback) {
            this._element.on("touchend", function () {
                callback();
            });
    };

    HtmlElement.prototype.onTouchCancel = function (callback) {
        this._element.on("touchcancel", function () {
            callback();
        });
    };

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