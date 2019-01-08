/* globals Modernizr:false */

(function () {
    "use strict";

    exports.supportsTouchEvents = function() {
        return Modernizr.touchevents;
    };
}());