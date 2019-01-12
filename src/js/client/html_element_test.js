(function () {
    "use strict";

    var assert = require("../shared/assert");
    var browser = require("./browser.js");
    var HtmlElement = require("./html_element.js");

    describe("HtmlElement should", function () {
        var htmlElement;
        var documentBody;

        beforeEach(function () {
            var html = "<div id=drawingArea></div>";
            documentBody = new HtmlElement(document.body);
            htmlElement = new HtmlElement(html);
        });

        it("appends element", function () {
            var elementToAppend = HtmlElement.fromHtml("<div id=drawingArea></div>");
            try {
                htmlElement.append(elementToAppend);
                assert.equal(htmlElement._element.children().length, 1);
            } finally {
                elementToAppend.remove();
            }
        });

        it("removes element", function () {
            var elementToAppend = HtmlElement.fromHtml("<div id=drawingArea></div>");
            try {
                htmlElement.append(elementToAppend);
                elementToAppend.remove();
                assert.equal(htmlElement._element.children().length, 0);
            } finally {
                elementToAppend.remove();
            }
        });

        it("return DOM element", function () {
            var domElement = htmlElement.toDomElement();
            assert.equal("DIV", domElement.tagName);
        });

        it("remove event listeners", function () {
            var testPoint = {x: 0, y: 0};
            htmlElement.onMouseDown(function () {
                throw new Error("Event listener should have been removed.");
            });
            htmlElement.removeEventListeners();
            htmlElement.triggerMouseDown(testPoint.x, testPoint.y);
        });

        it("convert relative coordinate into page coordinate", function () {
            var testPoint = {x: 100, y: 100};
            var expectedPoint = {x: 92, y: 92};
            try {
                documentBody.append(htmlElement);
                var actualPoint = htmlElement.relativeOffset(testPoint);
                assert.deepEqual(actualPoint, expectedPoint);
            } finally {
                htmlElement.remove();
            }
        });

        it("convert page coordinate into relative element coordinate", function () {
            var testPoint = {x: 92, y: 92};
            var expectedPoint = {x: 100, y: 100};
            try {
                documentBody.append(htmlElement);
                var actualPoint = htmlElement.pageOffset(testPoint);
                assert.deepEqual(actualPoint, expectedPoint);
            } finally {
                htmlElement.remove();
            }
        });

        describe("on all devices,", function () {

            it("allows mouse events to be triggered without coordinate parameters", function () {
                singlePointWithoutCoordinate(htmlElement.onMouseDown, htmlElement.triggerMouseDown);
                singlePointWithoutCoordinate(htmlElement.onMouseMove, htmlElement.triggerMouseMove);
                singlePointWithoutCoordinate(htmlElement.onMouseLeave, htmlElement.triggerMouseLeave);
                singlePointWithoutCoordinate(htmlElement.onMouseUp, htmlElement.triggerMouseUp);
            });

            it("triggers mouse events relative to element and handles them relative to page", function () {
                singlePointWithCoordinate(htmlElement.onMouseClick, htmlElement.triggerMouseClick);
                singlePointWithCoordinate(htmlElement.onMouseDown, htmlElement.triggerMouseDown);
                singlePointWithCoordinate(htmlElement.onMouseMove, htmlElement.triggerMouseMove);
                singlePointWithCoordinate(htmlElement.onMouseLeave, htmlElement.triggerMouseLeave);
                singlePointWithCoordinate(htmlElement.onMouseUp, htmlElement.triggerMouseUp);
            });

        });

        describe("on supported devices,", function () {
            if (!browser.supportsTouchEvents()) return;

            it("send zero touches when touchend triggered", function () {
                var monitor = monitorEvent("touchend");
                htmlElement.triggerTouchEnd();
                assert.isOk(monitor.eventTriggered);
                assert.deepEqual(monitor.touches, []);

            });

            it("send zero touches when touchcancel triggered", function () {
                var monitor = monitorEvent("touchcancel");
                htmlElement.triggerTouchCancel();
                assert.isOk(monitor.eventTriggered);
                assert.deepEqual(monitor.touches, []);

            });

            it("handles zero-touch touchend event", function() {
                var functionCalled = false;
                htmlElement.onTouchEnd(function() {
                    functionCalled = true;
                });

                htmlElement.triggerTouchEnd();
                assert.isOk(functionCalled);
            });

            it("handles zero-touch touchcancel event", function() {
                var functionCalled = false;
                htmlElement.onTouchCancel(function() {
                    functionCalled = true;
                });

                htmlElement.triggerTouchCancel();
                assert.isOk(functionCalled);
            });

            function monitorEvent(event) {
                var monitor = {
                    eventTriggered: false,
                    touches: null
                };

                htmlElement._element.on(event, function (event) {
                    monitor.eventTriggered = true;
                    monitor.touches = [];
                    var eventTouches = event.touches;
                    for (var i = 0; i < eventTouches.length; i++) {
                        monitor.touches.push([eventTouches[i].pageX, eventTouches[i].pageY]);
                    }
                });

                return monitor;
            }

            it("allows touch events to be triggered without coordinate parameters", function () {
                singlePointWithoutCoordinate(htmlElement.onSingleTouchStart, htmlElement.doSingleTouchStart);
                singlePointWithoutCoordinate(htmlElement.onSingleTouchMove, htmlElement.doSingleTouchMove);
            });

            it("handled single touch events", function () {
                singlePointWithCoordinate(htmlElement.onSingleTouchStart, htmlElement.doSingleTouchStart);
                singlePointWithCoordinate(htmlElement.onSingleTouchMove, htmlElement.doSingleTouchMove);
            });

            it("handled multi touch events", function () {
                multiPoint(htmlElement.onMultiTouchStart, htmlElement.doMultiTouchStart);
            });
        });

        function singlePointWithCoordinate(listener, instigator) {
            var relativePoint = {x: 100, y: 100};
            var offset = {x: 8, y: 8};
            var expected = {x: relativePoint.x + offset.x, y: relativePoint.y + offset.y};

            try {
                documentBody.append(htmlElement);
                var actual = null;
                listener.call(htmlElement, function (point) {
                    actual = point;
                });
                instigator.call(htmlElement, relativePoint.x, relativePoint.y);
                assert.deepEqual(actual, expected);
            } finally {
                htmlElement.remove();
            }
        }

        function singlePointWithoutCoordinate(listener, instigator) {
            var expected = {x: 0, y: 0};

            try {
                documentBody.append(htmlElement);
                var actual = null;
                listener.call(htmlElement, function (point) {
                    actual = point;
                });
                instigator.call(htmlElement);
                assert.deepEqual(actual, expected);
            } finally {
                htmlElement.remove();
            }
        }

        function multiPoint(listener, instigator) {
            var actual = false;
            listener.call(htmlElement, function (event) {
                actual = true;
            });
            instigator.call(htmlElement, {x: 12, y: 34}, {x: 56, y: 78});
            assert.isOk(actual);
        }
    });
}());