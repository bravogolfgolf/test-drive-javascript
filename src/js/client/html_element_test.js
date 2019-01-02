/* globals TouchEvent:false */

(function () {
    "use strict";

    var assert = require("../shared/assert");

    describe("HtmlElement should", function () {
        var htmlElement;

        beforeEach(function () {
            var html = "<div id=drawingArea></div>";
            htmlElement = new wwp.HtmlElement(html);
        });

        it("appends element", function () {
            htmlElement.append(wwp.HtmlElement.fromHtml("<div></div>>"));
            assert.equal(htmlElement._element.children().length, 1);

        });

        it("removes element", function () {
            var elementToAppend = wwp.HtmlElement.fromHtml("<div id=drawingArea></div>");
            htmlElement.append(elementToAppend);
            elementToAppend.remove();
            assert.equal(htmlElement._element.children().length, 0);

        });

        describe("on all devices,", function () {
            it("handled mouse events", function () {
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
            var actual = null;
            listener.call(htmlElement, function (point) {
                actual = point;
            });
            instigator.call(htmlElement, 123, 456);
            assert.deepEqual(actual, {x: 123, y: 456});
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