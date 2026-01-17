goog.provide('anychart.annotationsModule.PatternSymmetricalWedge');
goog.require('anychart.annotationsModule');
goog.require('anychart.annotationsModule.PatternBase');
goog.require('anychart.core.settings');
goog.require('anychart.enums');



/**
 * Symmetrical Wedge patterns for stock chart.
 * The wedge is a price pattern marked by converging trend lines on a price chart.
 * The direction of the trend is marked with the first 2 points.
 * The third point will create a mirrored trend line converging to the wedge tip.
 * The pattern will show two targets, for both bullish and bearish breakouts.
 *
 * @param {!anychart.annotationsModule.ChartController} chartController
 * @constructor
 * @extends {anychart.annotationsModule.PatternBase}
 */
anychart.annotationsModule.PatternSymmetricalWedge = function(chartController) {
  anychart.annotationsModule.PatternSymmetricalWedge.base(this, 'constructor', chartController);

  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, anychart.annotationsModule.THIRD_ANCHOR_POINT_DESCRIPTORS_META);
};
goog.inherits(anychart.annotationsModule.PatternSymmetricalWedge, anychart.annotationsModule.PatternBase);
anychart.core.settings.populate(anychart.annotationsModule.PatternSymmetricalWedge, anychart.annotationsModule.THIRD_ANCHOR_POINT_DESCRIPTORS);
anychart.annotationsModule.AnnotationTypes[anychart.enums.AnnotationTypes.PATTERNSYMMETRICALWEDGE] = anychart.annotationsModule.PatternSymmetricalWedge;


//region Properties
//----------------------------------------------------------------------------------------------------------------------
//
//  Properties
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.annotationsModule.PatternSymmetricalWedge.prototype.type = anychart.enums.AnnotationTypes.PATTERNSYMMETRICALWEDGE;


/**
 * Supported anchors.
 * @type {anychart.annotationsModule.AnchorSupport}
 */
anychart.annotationsModule.PatternSymmetricalWedge.prototype.SUPPORTED_ANCHORS = anychart.annotationsModule.AnchorSupport.THREE_POINTS;


//endregion
//region Drawing
//----------------------------------------------------------------------------------------------------------------------
//
//  Drawing
//
//----------------------------------------------------------------------------------------------------------------------

/** @inheritDoc */
anychart.annotationsModule.PatternSymmetricalWedge.prototype.drawTwoPointsShape = function(x1, y1, x2, y2) {
    // stroke only
    var path = this.paths_[0];
    path.clear();
    path.moveTo(x1, y1).lineTo(x2, y2);

    // draw helper for first line
    /*var helperx = x1 - (x2 - x1);
    var helpery = y1 - (helperx - x1) / (x2 - x1) * (y1 - y2);

    path = this.paths_[4];

    // helper line
    path.clear();
    path.moveTo(x1, y1).lineTo(helperx, helpery);*/
};


/** @inheritDoc */
anychart.annotationsModule.PatternSymmetricalWedge.prototype.drawThreePointsShape = function(x1, y1, x2, y2, x3, y3) {
    // arrange points
    var yStart, xStart, yTop, xTop, yPullback, xPullback;

    if (x1 < x3 && x1 < x2) {
        yStart = y1;
        xStart = x1;
        if (x2 < x3) {
            yTop = y2;
            xTop = x2;
            yPullback = y3;
            xPullback = x3;
        } else {
            yTop = y3;
            xTop = x3;
            yPullback = y2;
            xPullback = x2;
        }
    } else if (x2 < x3 && x2 < x1) {
        yStart = y2;
        xStart = x2;
        if (x1 < x3) {
            yTop = y1;
            xTop = x1;
            yPullback = y3;
            xPullback = x3;
        } else {
            yTop = y3;
            xTop = x3;
            yPullback = y1;
            xPullback = x1;
        }
    } else { // (x3 < x1 && x3 < x2)
        yStart = y3;
        xStart = x3;
        if (x1 < x2) {
            yTop = y1;
            xTop = x1;
            yPullback = y2;
            xPullback = x2;
        } else {
            yTop = y2;
            xTop = x2;
            yPullback = y1;
            xPullback = x1;
        }
    }

    // project top point on the wedge line
    var pyTop = yStart - (xTop - xStart) / (xPullback - xStart) * (yStart - yPullback);

    // symmetry line
    var ySymm = yTop - (yTop - pyTop) / 2;

    // mirrored points
    var pxPullback = xPullback,
        pyPullback = yPullback + 2 * (ySymm - yPullback),
        pyStart = yStart + 2 * (ySymm - yStart);

    // triangle tip point
    var px = null, py = null;
    var point = anychart.math.intersectInfiniteLineLine(xStart, yStart, xPullback, yPullback, xTop, yTop, pxPullback, pyPullback);
    if (point) {
        px = point.x;
        py = point.y;
    }

    // shorten projected start point
    var pxStart = xStart + (xTop - xStart) / 2;
        pyStart = pyStart + (yTop - pyStart) / 2;

    for (var i = 0; i < this.paths_.length; i++) {
        // only stroke and hover paths
        if (i != 0 && i != 3) continue;
        var path = this.paths_[i];

        path.clear();

        // first wedge line
        if (px && py) {
            path.moveTo(xStart, yStart)
                .lineTo(px, py);

            path.moveTo(pxStart, pyStart)
                .lineTo(px, py);
        }
    }

};


//endregion
