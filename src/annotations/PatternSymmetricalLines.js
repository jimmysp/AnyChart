goog.provide('anychart.annotationsModule.PatternSymmetricalLines');
goog.require('anychart.annotationsModule');
goog.require('anychart.annotationsModule.PatternBase');
goog.require('anychart.core.settings');
goog.require('anychart.enums');



/**
 * Symmetrical Lines patterns for stock chart.
 * Similar to the symmetrical wedge but the third point defines the symmetry line instead
 *
 * @param {!anychart.annotationsModule.ChartController} chartController
 * @constructor
 * @extends {anychart.annotationsModule.PatternBase}
 */
anychart.annotationsModule.PatternSymmetricalLines = function(chartController) {
  anychart.annotationsModule.PatternSymmetricalLines.base(this, 'constructor', chartController);

  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, anychart.annotationsModule.THIRD_ANCHOR_POINT_DESCRIPTORS_META);
};
goog.inherits(anychart.annotationsModule.PatternSymmetricalLines, anychart.annotationsModule.PatternBase);
anychart.core.settings.populate(anychart.annotationsModule.PatternSymmetricalLines, anychart.annotationsModule.THIRD_ANCHOR_POINT_DESCRIPTORS);
anychart.annotationsModule.AnnotationTypes[anychart.enums.AnnotationTypes.PATTERNSYMMETRICALLINES] = anychart.annotationsModule.PatternSymmetricalLines;


//region Properties
//----------------------------------------------------------------------------------------------------------------------
//
//  Properties
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.annotationsModule.PatternSymmetricalLines.prototype.type = anychart.enums.AnnotationTypes.PATTERNSYMMETRICALLINES;


/**
 * Supported anchors.
 * @type {anychart.annotationsModule.AnchorSupport}
 */
anychart.annotationsModule.PatternSymmetricalLines.prototype.SUPPORTED_ANCHORS = anychart.annotationsModule.AnchorSupport.THREE_POINTS;


//endregion
//region Drawing
//----------------------------------------------------------------------------------------------------------------------
//
//  Drawing
//
//----------------------------------------------------------------------------------------------------------------------

/** @inheritDoc */
anychart.annotationsModule.PatternSymmetricalLines.prototype.drawTwoPointsShape = function(x1, y1, x2, y2) {
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
anychart.annotationsModule.PatternSymmetricalLines.prototype.drawThreePointsShape = function(x1, y1, x2, y2, x3, y3) {
    // constraints
    x2 = Math.max(x1 + 1, x3 + 1, x2);
    x3 = Math.min(x2 - 1, x3);

    if (x3 < x1) {
        var tmpx1 = x3 - 1;
        var tmpy1 = y1 - (tmpx1 - x1) / (x2 - x1) * (y1 - y2);

        x3 = x1;
        x1 = tmpx1;
        y1 = tmpy1;
    }

    // mirrored points
    var mirry1, mirry2;
    if (y1 > y3) {
        mirry1 = y3 - (y1 - y3);
        mirry2 = y3 + (y3 - y2);
    } else {
        mirry1 = y3 + (y3 - y1);
        mirry2 = y3 - (y2 - y3);
    }

    // calculate targets
    var tx = x2 + (x2 - x3) / 2;

    for (var i = 0; i < this.paths_.length; i++) {
        // no fill paths
        if (i == 1 || i == 2) continue;
        var path = this.paths_[i];

        path.clear();
        path.moveTo(x1, y1)
            .lineTo(x2, y2);

        path.moveTo(x1, mirry1)
            .lineTo(x2, mirry2);

        // middle line
        path.moveTo(x1, y3)
            .lineTo(x2, y3);
    }

    this.drawTarget(x2, y3, tx, y3 - Math.abs(y1 - y3), true);
    this.drawTarget(x2, y3, tx, y3 + Math.abs(y1 - y3), false);

    // draw helper for first line
    var helperx = x1 - (x2 - x1);
    var helpery = y1 - (helperx - x1) / (x2 - x1) * (y1 - y2);

    for (var i = 3; i <= 4; i++) {
        // use trend stroke and hover paths
        var path = this.paths_[i];

        // helper line
        path.moveTo(x1, y1).lineTo(helperx, helpery);
    }
};


//endregion
