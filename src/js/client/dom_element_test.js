/* globals wwp:true, TouchEvent:false */


(function () {
    "use strict";

    var assert = require("../shared/assert");

    describe("dom_element should have", function () {
        var domElement;

        beforeEach(function () {
            var div = document.createElement("div");
            domElement = new wwp.DomElement(div);
        });

        describe("mouse events", function () {
            it("handled on all devices", function () {
                testEvent(domElement.onMouseDown, domElement.doMouseDown);
                testEvent(domElement.onMouseMove, domElement.doMouseMove);
                testEvent(domElement.onMouseLeave, domElement.doMouseLeave);
                testEvent(domElement.onMouseUp, domElement.doMouseUp);
            });

        });

        describe("touch events", function () {
            if (!browserSupportsTouchEvents()) return;
            it("handled on supported devices", function () {
                testEvent(domElement.onSingleTouchStart, domElement.doSingleTouchStart);
                testEvent(domElement.onSingleTouchMove, domElement.doSingleTouchMove);
                testEvent(domElement.onSingleTouchCancel, domElement.doSingleTouchCancel);
                testEvent(domElement.onSingleTouchEnd, domElement.doSingleTouchEnd);
            });
        });

        function testEvent(listener, instigator) {
            var actual = null;
            listener.call(domElement, function (point) {
                actual = point;
            });
            instigator.call(domElement, 123, 456);
            assert.deepEqual(actual, {x: 123, y: 456});
        }

        function browserSupportsTouchEvents() {
            return 'TouchEvent' in window && TouchEvent.length > 0;
        }
    });
}());