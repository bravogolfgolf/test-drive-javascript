/* globals wwp:true, TouchEvent:false */


(function () {
    "use strict";

    var assert = require("../shared/assert");

    describe("dom_element should,", function () {
        var domElement;

        beforeEach(function () {
            domElement = wwp.DomElement.fromHtml("<div></div>>");
        });

        describe("on all devices,", function () {
            it("handled mouse events", function () {
                singlePoint(domElement.onMouseDown, domElement.doMouseDown);
                singlePoint(domElement.onMouseMove, domElement.doMouseMove);
                singlePoint(domElement.onMouseLeave, domElement.doMouseLeave);
                singlePoint(domElement.onMouseUp, domElement.doMouseUp);
            });

        });

        describe("on supported devices,", function () {
            if (!browserSupportsTouchEvents()) return;
            it("handled single touch events", function () {
                singlePoint(domElement.onSingleTouchStart, domElement.doSingleTouchStart);
                singlePoint(domElement.onSingleTouchMove, domElement.doSingleTouchMove);
                singlePoint(domElement.onSingleTouchCancel, domElement.doSingleTouchCancel);
                singlePoint(domElement.onSingleTouchEnd, domElement.doSingleTouchEnd);
            });

            it("handled multi touch events", function () {
                multiPoint(domElement.onMultiTouchStart, domElement.doMultiTouchStart);
            });
        });

        function singlePoint(listener, instigator) {
            var actual = null;
            listener.call(domElement, function (point) {
                actual = point;
            });
            instigator.call(domElement, 123, 456);
            assert.deepEqual(actual, {x: 123, y: 456});
        }

        function multiPoint(listener, instigator) {
            var actual = null;
            listener.call(domElement, function (event) {
                actual = event;
            });
            instigator.call(domElement, {x: 12, y: 34}, {x: 56, y: 78});
            assert.isOk(actual);
        }

        function browserSupportsTouchEvents() {
            return 'TouchEvent' in window && TouchEvent.length > 0;
        }
    });
}());