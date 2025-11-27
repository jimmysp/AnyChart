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
    var helperx = x1 - (x2 - x1);
    var helpery = y1 - (helperx - x1) / (x2 - x1) * (y1 - y2);

    path = this.paths_[4];

    // helper line
    path.clear();
    path.moveTo(x1, y1).lineTo(helperx, helpery);
};


/** @inheritDoc */
anychart.annotationsModule.PatternSymmetricalWedge.prototype.drawThreePointsShape = function(x1, y1, x2, y2, x3, y3) {
    // constraints
    // x2 = Math.max(x1 + 1, x3 + 1, x2);
    // x3 = Math.min(x2 - 1, x3);

    /*if (x3 < x1) {
        var tmpx1 = x3 - 1;
        var tmpy1 = y1 - (tmpx1 - x1) / (x2 - x1) * (y1 - y2);

        x3 = x1;
        if (y2 > y1) {
            y3 -= y1 - tmpy1;
        } else {
            y3 += tmpy1 - y1;
        }

        x1 = tmpx1;
        y1 = tmpy1;
    }*/

    // project last point on the main line
    var py3 = y1 - (x3 - x1) / (x2 - x1) * (y1 - y2);

    // mirrored points
    var y4, x4 = x2; //mirry1, mirry2;
    if (py3 > y3) {
        // mirry1 = y3 - (y1 - py3);
        y4 = y3 + (py3 - y2);
    } else {
        // mirry1 = y3 + (py3 - y1);
        y4 = y3 - (y2 - py3);
    }
    
    // constraints
    x1 = Math.min(x1, x2 - 1);
    x3 = Math.min(x3, x4 - 1);
    // var midx = null, midy = null;

    if (x3 < x1) {
        // project x3 on line
        y1 = y1 - (x3 - x1) / (x2 - x1) * (y1 - y2);
        x1 = x3;
        // midx = x3;
    } else {
        // project x1 on line
        y3 = y3 - (x1 - x3) / (x4 - x3) * (y3 - y4);
        x3 = x1;
        // midx = x1;
    }

    // triangle tip point
    var px = null, py = null;
    var point = anychart.math.intersectInfiniteLineLine(x1, y1, x2, y2, x3, y3, x4, y4);
    if (point) {
        px = point.x;
        py = point.y;
    }

    for (var i = 0; i < this.paths_.length; i++) {
        // only stroke and hover paths
        if (i != 0 && i != 3) continue;
        var path = this.paths_[i];

        path.clear();

        // first wedge line
        if (px && py && px > x2) {
            path.moveTo(x1, y1)
                .lineTo(px, py);
        } else {
            path.moveTo(x1, y1)
                .lineTo(x2, y2);
        }

        // second wedge line
        if (px && py && px > x4) {
            path.moveTo(x3, y3)
                .lineTo(px, py);
        } else {
            path.moveTo(x1, y3)
                .lineTo(x4, y4);
        }

        /*if (px && py && midx < px) {
            path.moveTo(midx, midy)
                .lineTo(px, py);
        }*/
    }

    return;


    // calculate targets
    /*var tx = x2 + (x2 - x3) / 2;
    var midy = (y2 > mirry2) ? y2 - (y2 - mirry2) / 2 : y2 + (mirry2 - y2) / 2;

    for (var i = 0; i < this.paths_.length; i++) {
        // only stroke and hover paths
        if (i != 0 && i != 3) continue;
        var path = this.paths_[i];

        path.clear();
        path.moveTo(x1, y1)
            .lineTo(x2, y2);

        path.moveTo(x1, mirry1)
            .lineTo(x2, mirry2);

        // path.moveTo(x3, y3)
        //    .lineTo(x3, py3);

        // middle line
        path.moveTo(x1, midy)
            .lineTo(x2, midy);
    }

    /*this.drawTarget(x2, midy, tx, midy - Math.abs(y3 - py3), true);
    this.drawTarget(x2, midy, tx, midy + Math.abs(y3 - py3), false);

    // draw helper for first line
    var helperx = x1 - (x2 - x1);
    var helpery = y1 - (helperx - x1) / (x2 - x1) * (y1 - y2);

    for (var i = 3; i <= 4; i++) {
        // use trend stroke and hover paths
        var path = this.paths_[i];

        // helper line
        path.moveTo(x1, y1).lineTo(helperx, helpery);
    }*/
};


//endregion
