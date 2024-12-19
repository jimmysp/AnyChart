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
    this.drawThreePointsShape(x1, y1, x2, y2, x2, y2);
};


/** @inheritDoc */
anychart.annotationsModule.PatternSymmetricalWedge.prototype.drawThreePointsShape = function(x1, y1, x2, y2, x3, y3) {
    // constraints
    x3 = Math.max(x1 + 1, x2 + 1, x3);
    x2 = Math.min(x3 - 1, x2);

    if (x2 < x1) {
        var tmpx1 = x2 - 1;
        var tmpy1 = y1 - (tmpx1 - x1) / (x3 - x1) * (y1 - y3);

        x2 = x1;
        if (y3 > y1) {
            y2 -= y1 - tmpy1;
        } else {
            y2 += tmpy1 - y1;
        }

        x1 = tmpx1;
        y1 = tmpy1;
    }

    // project last point on the main line
    var py2 = y1 - (x2 - x1) / (x3 - x1) * (y1 - y3);

    // mirrored points
    var mirry1, mirry3;
    if (py2 > y2) {
        mirry1 = y2 - (y1 - py2);
        mirry3 = y2 + (py2 - y3);
    } else {
        mirry1 = y2 + (py2 - y1);
        mirry3 = y2 - (y3 - py2);
    }

    // calculate targets
    var tx = x3 + (x3 - x2) / 2;
    var midy = (y3 > mirry3) ? y3 - (y3 - mirry3) / 2 : y3 + (mirry3 - y3) / 2;

    for (var i = 0; i < this.paths_.length; i++) {
        // no fill paths
        if (i == 1 || i == 2) continue;
        var path = this.paths_[i];

        path.clear();
        path.moveTo(x1, y1)
            .lineTo(x3, y3);

        path.moveTo(x1, mirry1)
            .lineTo(x3, mirry3);

        // path.moveTo(x2, y2)
        //    .lineTo(x2, py2);

        // middle line
        path.moveTo(x1, midy)
            .lineTo(x3, midy);
    }

    this.drawTarget(x3, midy, tx, midy - Math.abs(y2 - py2), true);
    this.drawTarget(x3, midy, tx, midy + Math.abs(y2 - py2), false);

    // draw helper for first line
    var helperx = x1 - (x3 - x1);
    var helpery = y1 - (helperx - x1) / (x3 - x1) * (y1 - y3);

    for (var i = 3; i <= 4; i++) {
        // use trend stroke and hover paths
        var path = this.paths_[i];

        // helper line
        path.moveTo(x1, y1).lineTo(helperx, helpery);
    }
};


//endregion
