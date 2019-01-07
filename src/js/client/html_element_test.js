/* globals TouchEvent:false */

(function () {
    "use strict";

    var assert = require("../shared/assert");
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
            htmlElement.doMouseDown(testPoint.x, testPoint.y);
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
            it("triggers mouse events relative to element and handles them relative to page", function () {
                singlePoint(htmlElement.onMouseDown, htmlElement.doMouseDown);
                singlePoint(htmlElement.onMouseMove, htmlElement.doMouseMove);
                singlePoint(htmlElement.onMouseLeave, htmlElement.doMouseLeave);
                singlePoint(htmlElement.onMouseUp, htmlElement.doMouseUp);
            });

        });

        describe("on supported devices,", function () {
            if (!browserSupportsTouchEvents()) return;
            it("handled single touch events", function () {
                singlePoint(htmlElement.onSingleTouchStart, htmlElement.doSingleTouchStart);
                singlePoint(htmlElement.onSingleTouchMove, htmlElement.doSingleTouchMove);
                singlePoint(htmlElement.onSingleTouchCancel, htmlElement.doSingleTouchCancel);
                singlePoint(htmlElement.onSingleTouchEnd, htmlElement.doSingleTouchEnd);
            });

            it("handled multi touch events", function () {
                multiPoint(htmlElement.onMultiTouchStart, htmlElement.doMultiTouchStart);
            });
        });

        function singlePoint(listener, instigator) {
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

        function multiPoint(listener, instigator) {
            var actual = false;
            listener.call(htmlElement, function (event) {
                actual = true;
            });
            instigator.call(htmlElement, {x: 12, y: 34}, {x: 56, y: 78});
            assert.isOk(actual);
        }

        function browserSupportsTouchEvents() {
            return 'TouchEvent' in window && TouchEvent.length > 0;
        }
    });
}());