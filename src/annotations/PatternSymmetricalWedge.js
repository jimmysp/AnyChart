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
    var y1Line, x1Line, yStart, xStart, y2Line, x2Line;

    var pointsByTime = [
        {x: x1, y: y1},
        {x: x2, y: y2},
        {x: x3, y: y3}
    ];

    // sort points
    pointsByTime.sort( function(a,b) { return a.x - b.x; } );

    xStart = pointsByTime[0].x;
    yStart = pointsByTime[0].y;
    x1Line = pointsByTime[1].x;
    y1Line = pointsByTime[1].y;
    x2Line = pointsByTime[2].x;
    y2Line = pointsByTime[2].y;


    // project top point on the wedge line
    var pyStart = y1Line - (xStart - x1Line) / (x2Line - x1Line) * (y1Line - y2Line);

    // symmetry line
    var ySymm = yStart - (yStart - pyStart) / 2;

    // mirrored points
    var px1Line = x1Line,
        px2Line = x2Line,
        py2Line = y2Line + 2 * (ySymm - y2Line),
        py1Line = y1Line + 2 * (ySymm - y1Line);

    // triangle tip point
    var px = null, py = null;
    var point = anychart.math.intersectInfiniteLineLine(x1Line, y1Line, x2Line, y2Line, xStart, yStart, px2Line, py2Line);
    if (point) {
        px = point.x;
        py = point.y;
    }

    // shorten projected start point

    /*var px1Line = x1Line + (xStart - x1Line) / 2;
        py1Line = py1Line + (yStart - py1Line) / 2;*/

    // when inversed
    if (px < x1Line) {
        px1Line = x2Line + (xStart - x2Line) / 2;
        py1Line = y2Line + 2 * (ySymm - y2Line);
        py1Line = py1Line + (yStart - py1Line) / 2;
    }

    for (var i = 0; i < this.paths_.length; i++) {
        // only stroke and hover paths
        if (i != 0 && i != 3) continue;
        var path = this.paths_[i];

        path.clear();

        // first wedge line
        if (px && py) {
            if (px > x1Line) {
                path.moveTo(x1Line, y1Line)
                    .lineTo(px, py);
            } else {
                path.moveTo(x2Line, y2Line)
                    .lineTo(px, py);
            }

            path.moveTo(xStart, yStart)
                .lineTo(px, py);
        }
    }

};


//endregion
