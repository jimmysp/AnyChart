goog.provide('anychart.annotationsModule.PatternWaveABC');
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
anychart.annotationsModule.PatternWaveABC = function(chartController) {
  anychart.annotationsModule.PatternWaveABC.base(this, 'constructor', chartController);

  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, anychart.annotationsModule.FOURTH_ANCHOR_POINT_DESCRIPTORS_META);
  this.shouldShowTarget = true;

};
goog.inherits(anychart.annotationsModule.PatternWaveABC, anychart.annotationsModule.PatternBase);
anychart.core.settings.populate(anychart.annotationsModule.PatternWaveABC, anychart.annotationsModule.FOURTH_ANCHOR_POINT_DESCRIPTORS);
anychart.annotationsModule.AnnotationTypes[anychart.enums.AnnotationTypes.PATTERNWAVEABC] = anychart.annotationsModule.PatternWaveABC;


//region Properties
//----------------------------------------------------------------------------------------------------------------------
//
//  Properties
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.annotationsModule.PatternWaveABC.prototype.type = anychart.enums.AnnotationTypes.PATTERNWAVEABC;


/**
 * Supported anchors.
 * @type {anychart.annotationsModule.AnchorSupport}
 */
anychart.annotationsModule.PatternWaveABC.prototype.SUPPORTED_ANCHORS = anychart.annotationsModule.AnchorSupport.FOUR_POINTS;


//endregion
//region Drawing
//----------------------------------------------------------------------------------------------------------------------
//
//  Drawing
//
//----------------------------------------------------------------------------------------------------------------------


/** @inheritDoc */
anychart.annotationsModule.PatternWaveABC.prototype.drawFourPointsShape = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    // constraints
    x1 = Math.min(x2 - 1, x1);
    x2 = Math.min(x3 - 1, x2);
    x2 = Math.max(x1 + 1, x2);
    x3 = Math.min(x4 - 1, x3);
    x3 = Math.max(x2 + 1, x3);
    x4 = Math.max(x3 + 1, x4);

    if (y2 > y1) {
        y4 = Math.max(y4, y2 + 1);
    } else {
        y4 = Math.min(y4, y2 - 1);
    }

    // var path = this.paths_[0];
    // path.clear();

    for (var i = 0; i < this.paths_.length; i++) {
        // only stroke and hover paths
        if (i != 0 && i != 3) continue;

        var path = this.paths_[i];
        path.clear();
        // 3 segment wave
        path.moveTo(x1, y1)
            .lineTo(x2, y2)
            .lineTo(x3, y3)
            .lineTo(x4, y4);
    }

    // calculate targets
    var tx = x4 + (x4 - x3);
    var ty = y2 > y3 ? y3 + (y2 - y3) / 2 : y2 + (y3 - y2) / 2;

    this.drawTarget(x4, y4, tx, ty, true);

    for (var i = 3; i <= 4; i++) {
        // only trend stroke and hover paths
        var path = this.paths_[i];
        path.moveTo(x2, y2)
            .lineTo(x2 + 2 * (x4 - x2) , y2);
    }
};


/** @inheritDoc */
anychart.annotationsModule.PatternWaveABC.prototype.colorize = function(state) {
    anychart.annotationsModule.PatternWaveABC.base(this, 'colorize', state);

    // no fill for hover path
    this.paths_[3].fill(null);
  };
//endregion
