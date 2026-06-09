goog.provide('anychart.annotationsModule.PatternRatioTriangle');
goog.require('anychart.annotationsModule');
goog.require('anychart.annotationsModule.PatternBase');
goog.require('anychart.core.settings');
goog.require('anychart.enums');



/**
 * Ratio Triangle pattern for stock chart.
 * The wedge is a price pattern marked by converging trend lines on a price chart.
 *
 * @param {!anychart.annotationsModule.ChartController} chartController
 * @constructor
 * @extends {anychart.annotationsModule.PatternBase}
 */
anychart.annotationsModule.PatternRatioTriangle = function(chartController) {
  anychart.annotationsModule.PatternRatioTriangle.base(this, 'constructor', chartController);

  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, anychart.annotationsModule.THIRD_ANCHOR_POINT_DESCRIPTORS_META);

  /**
   * Pattern pointer
   * @type {anychart.math.Point2D}
   * @protected
   */
  this.pointer = null;
};

goog.inherits(anychart.annotationsModule.PatternRatioTriangle, anychart.annotationsModule.PatternBase);
anychart.core.settings.populate(anychart.annotationsModule.PatternRatioTriangle, anychart.annotationsModule.THIRD_ANCHOR_POINT_DESCRIPTORS);
anychart.annotationsModule.AnnotationTypes[anychart.enums.AnnotationTypes.PATTERNRATIOTRIANGLE] = anychart.annotationsModule.PatternRatioTriangle;

/**
 * Get pointer
 * @return {anychart.math.Point2D}
 */
anychart.annotationsModule.PatternRatioTriangle.prototype.getPointer = function() {
    return this.pointer;
  };


//region Properties
//----------------------------------------------------------------------------------------------------------------------
//
//  Properties
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.annotationsModule.PatternRatioTriangle.prototype.type = anychart.enums.AnnotationTypes.PATTERNRATIOTRIANGLE;


/**
 * Supported anchors.
 * @type {anychart.annotationsModule.AnchorSupport}
 */
anychart.annotationsModule.PatternRatioTriangle.prototype.SUPPORTED_ANCHORS = anychart.annotationsModule.AnchorSupport.THREE_POINTS;


//endregion
//region Drawing
//----------------------------------------------------------------------------------------------------------------------
//
//  Drawing
//
//----------------------------------------------------------------------------------------------------------------------

/** @inheritDoc */
anychart.annotationsModule.PatternRatioTriangle.prototype.drawTwoPointsShape = function(x1, y1, x2, y2) {
    // stroke only
    var path = this.paths_[0];
    path.clear();
    path.moveTo(x1, y1).lineTo(x2, y2);
};

/** @inheritDoc */
anychart.annotationsModule.PatternRatioTriangle.prototype.drawThreePointsShape = function(x1, y1, x2, y2, x3, y3) {

    var pointsByTime = [
        {x: x1, y: y1},
        {x: x2, y: y2},
        {x: x3, y: y3}
    ];

    // sort points
    pointsByTime.sort( function(a,b) { return a.x - b.x; } );

    x1 = pointsByTime[0].x;
    y1 = pointsByTime[0].y;
    x2 = pointsByTime[1].x;
    y2 = pointsByTime[1].y;
    x3 = pointsByTime[2].x;
    y3 = pointsByTime[2].y;


    /*if (x3 < x1) {
        // project x3 on line
        y1 = y1 - (x3 - x1) / (x2 - x1) * (y1 - y2);
        x1 = x3;
        // midx = x3;
    } else {*/
        // project x1 on line
        // y3 = y3 - (x1 - x3) / (x2 - x3) * (y3 - y2);
        // x3 = x1;
        // midx = x1;
    // }
    // midy = y1 + (y3 - y1) / this.ratio;

    for (var i = 0; i < this.paths_.length; i++) {
        // only stroke and hover paths
        if (i != 0 && i != 3) continue;
        var path = this.paths_[i];

        path.clear();

        // wedge lines
        path.moveTo(x1, y1)
            .lineTo(x2, y2);

        path.moveTo(x2, y2)
            .lineTo(x3, y3);

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
anychart.annotationsModule.PatternRatioTriangle.prototype.disposeInternal = function() {
    anychart.annotationsModule.PatternRatioTriangle.base(this, 'disposeInternal');
  };
//endregion
