goog.provide('anychart.annotationsModule.PatternMedianWedge');
goog.require('anychart.annotationsModule');
goog.require('anychart.annotationsModule.PatternBase');
goog.require('anychart.core.settings');
goog.require('anychart.enums');



/**
 * Median Wedge patterns for stock chart.
 * The wedge is a price pattern marked by converging trend lines on a price chart.
 * The direction of the trend is marked with the first 2 points.
 * The third point will create a mirrored trend line converging to the wedge tip.
 * The pattern will show two targets, for both bullish and bearish breakouts.
 *
 * @param {!anychart.annotationsModule.ChartController} chartController
 * @constructor
 * @extends {anychart.annotationsModule.PatternBase}
 */
anychart.annotationsModule.PatternMedianWedge = function(chartController) {
  anychart.annotationsModule.PatternMedianWedge.base(this, 'constructor', chartController);

  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, anychart.annotationsModule.FOURTH_ANCHOR_POINT_DESCRIPTORS_META);

  /* *
   * This is a flag that is setup in labels invalidation processing and that means that the labels should be redrawn
   * after processing
   * @type {number}
   * @protected
   */
//   this.ratio = 1.786;
};
goog.inherits(anychart.annotationsModule.PatternMedianWedge, anychart.annotationsModule.PatternBase);
anychart.core.settings.populate(anychart.annotationsModule.PatternMedianWedge, anychart.annotationsModule.FOURTH_ANCHOR_POINT_DESCRIPTORS);
anychart.annotationsModule.AnnotationTypes[anychart.enums.AnnotationTypes.PATTERNMEDIANWEDGE] = anychart.annotationsModule.PatternMedianWedge;


/**
 * Set ratio
 * @param {number} ratio
 * @return {Array.<number>|anychart.annotationsModule.PatternMedianWedge}
 */
/*anychart.annotationsModule.PatternMedianWedge.prototype.setRatio = function(ratio) {
    this.ratio = ratio;
    this.invalidate(anychart.ConsistencyState.ANNOTATIONS_LAST_POINT);
    this.draw();
    return this;
  };*/

/**
 * Get ratio
 * @return {number}
 */
/*anychart.annotationsModule.PatternMedianWedge.prototype.getRatio = function() {
    return this.ratio;
  };
*/

//region Properties
//----------------------------------------------------------------------------------------------------------------------
//
//  Properties
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.annotationsModule.PatternMedianWedge.prototype.type = anychart.enums.AnnotationTypes.PATTERNMEDIANWEDGE;


/**
 * Supported anchors.
 * @type {anychart.annotationsModule.AnchorSupport}
 */
anychart.annotationsModule.PatternMedianWedge.prototype.SUPPORTED_ANCHORS = anychart.annotationsModule.AnchorSupport.FOUR_POINTS;


//endregion
//region Drawing
//----------------------------------------------------------------------------------------------------------------------
//
//  Drawing
//
//----------------------------------------------------------------------------------------------------------------------

/** @inheritDoc */
anychart.annotationsModule.PatternMedianWedge.prototype.drawTwoPointsShape = function(x1, y1, x2, y2) {
    // stroke only
    var path = this.paths_[0];
    path.clear();
    path.moveTo(x1, y1).lineTo(x2, y2);
};


/** @inheritDoc */
anychart.annotationsModule.PatternMedianWedge.prototype.drawThreePointsShape = function(x1, y1, x2, y2, x3, y3) {
    this.drawTwoPointsShape(x1, y1, x2, y2);
};


/** @inheritDoc */
anychart.annotationsModule.PatternMedianWedge.prototype.drawFourPointsShape = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    var x1initial = x1, x3initial = x3;

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
    // midy = y1 + (y3 - y1) / this.ratio;

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
            path.moveTo(x1, y3)
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
};
//endregion

//region Serialization / Deserialization / Disposing
//----------------------------------------------------------------------------------------------------------------------
//
//  Serialization / Deserialization / Disposing
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
/*anychart.annotationsModule.PatternMedianWedge.prototype.disposeInternal = function() {
    anychart.annotationsModule.PatternMedianWedge.base(this, 'disposeInternal');

    // delete this.ratio;
  };
//endregion
//export
(function() {
    var proto = anychart.annotationsModule.PatternMedianWedge.prototype;
    // proto['getRatio'] = proto.getRatio;
    // proto['setRatio'] = proto.setRatio;
  })();
*/
