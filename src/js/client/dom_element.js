/* globals wwp:true */

window.wwp = window.wwp || {};

(function () {
    "use strict";

    var DomElement = wwp.DomElement = function DomElement(element) {
        this.offset = element.offset();
    };

    DomElement.prototype.removeOffsetFrom = function (pageX, pageY) {
        return {
            x: pageX - this.offset.left,
            y: pageY - this.offset.top
        };
    };
}());