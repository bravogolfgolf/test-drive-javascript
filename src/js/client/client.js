/* globals Raphael:false, wwp:true */

wwp = {};

(function () {
    "use strict";

    var paper;

    wwp.initializeDrawingArea = function (drawingAreaId) {
        $(drawingAreaId).click(function (event) {
            wwp.drawLine(0, 0, event.pageX, event.pageY);
        });


        paper = new Raphael(drawingAreaId);
        return paper;
    };

    wwp.drawLine = function (startX, startY, endX, endY) {
        paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
    };
}());