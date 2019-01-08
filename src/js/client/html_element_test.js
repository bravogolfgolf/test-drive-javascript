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

            it("allows mouse events to be triggered without coordinate parameters", function () {
                singlePointWithoutCoordinate(htmlElement.onMouseDown, htmlElement.doMouseDown);
                singlePointWithoutCoordinate(htmlElement.onMouseMove, htmlElement.doMouseMove);
                singlePointWithoutCoordinate(htmlElement.onMouseLeave, htmlElement.doMouseLeave);
                singlePointWithoutCoordinate(htmlElement.onMouseUp, htmlElement.doMouseUp);
            });

            it("triggers mouse events relative to element and handles them relative to page", function () {
                singlePointWithCoordinate(htmlElement.onMouseDown, htmlElement.doMouseDown);
                singlePointWithCoordinate(htmlElement.onMouseMove, htmlElement.doMouseMove);
                singlePointWithCoordinate(htmlElement.onMouseLeave, htmlElement.doMouseLeave);
                singlePointWithCoordinate(htmlElement.onMouseUp, htmlElement.doMouseUp);
            });

        });

        describe("on supported devices,", function () {
            if (!browser.supportsTouchEvents()) return;

            it("allows touch events to be triggered without coordinate parameters", function () {
                singlePointWithoutCoordinate(htmlElement.onSingleTouchStart, htmlElement.doSingleTouchStart);
                singlePointWithoutCoordinate(htmlElement.onSingleTouchMove, htmlElement.doSingleTouchMove);
                singlePointWithoutCoordinate(htmlElement.onSingleTouchCancel, htmlElement.doSingleTouchCancel);
                singlePointWithoutCoordinate(htmlElement.onSingleTouchEnd, htmlElement.doSingleTouchEnd);
            });

            it("handled single touch events", function () {
                singlePointWithCoordinate(htmlElement.onSingleTouchStart, htmlElement.doSingleTouchStart);
                singlePointWithCoordinate(htmlElement.onSingleTouchMove, htmlElement.doSingleTouchMove);
                singlePointWithCoordinate(htmlElement.onSingleTouchCancel, htmlElement.doSingleTouchCancel);
                singlePointWithCoordinate(htmlElement.onSingleTouchEnd, htmlElement.doSingleTouchEnd);
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