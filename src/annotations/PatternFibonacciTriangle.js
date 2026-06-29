goog.provide('anychart.annotationsModule.PatternFibonacciTriangle');
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
anychart.annotationsModule.PatternFibonacciTriangle = function(chartController) {
  anychart.annotationsModule.PatternFibonacciTriangle.base(this, 'constructor', chartController);

  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, anychart.annotationsModule.FOURTH_ANCHOR_POINT_DESCRIPTORS_META);

  /**
   * Pattern pointer
   * @type {anychart.math.Point2D}
   * @protected
   */
  this.pointer = null;
};

goog.inherits(anychart.annotationsModule.PatternFibonacciTriangle, anychart.annotationsModule.PatternBase);
anychart.core.settings.populate(anychart.annotationsModule.PatternFibonacciTriangle, anychart.annotationsModule.FOURTH_ANCHOR_POINT_DESCRIPTORS);
anychart.annotationsModule.AnnotationTypes[anychart.enums.AnnotationTypes.PATTERNFIBONACCITRIANGLE] = anychart.annotationsModule.PatternFibonacciTriangle;

/**
 * Get pointer
 * @return {anychart.math.Point2D}
 */
anychart.annotationsModule.PatternFibonacciTriangle.prototype.getPointer = function() {
    return this.pointer;
  };


//region Properties
//----------------------------------------------------------------------------------------------------------------------
//
//  Properties
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.annotationsModule.PatternFibonacciTriangle.prototype.type = anychart.enums.AnnotationTypes.PATTERNFIBONACCITRIANGLE;


/**
 * Supported anchors.
 * @type {anychart.annotationsModule.AnchorSupport}
 */
anychart.annotationsModule.PatternFibonacciTriangle.prototype.SUPPORTED_ANCHORS = anychart.annotationsModule.AnchorSupport.FOUR_POINTS;


//endregion
//region Drawing
//----------------------------------------------------------------------------------------------------------------------
//
//  Drawing
//
//----------------------------------------------------------------------------------------------------------------------

/** @inheritDoc */
anychart.annotationsModule.PatternFibonacciTriangle.prototype.drawTwoPointsShape = function(x1, y1, x2, y2) {
    // stroke only
    var path = this.paths_[0];
    path.clear();
    path.moveTo(x1, y1).lineTo(x2, y2);
};

/** @inheritDoc */
anychart.annotationsModule.PatternFibonacciTriangle.prototype.drawThreePointsShape = function(x1, y1, x2, y2, x3, y3) {

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


/** @inheritDoc */
anychart.annotationsModule.PatternFibonacciTriangle.prototype.drawFourPointsShape = function(x1, y1, x2, y2, x3, y3, x4, y4) {

    var pointsByTime = [
        {x: x1, y: y1},
        {x: x2, y: y2},
        {x: x3, y: y3},
        {x: x4, y: y4}
    ];

    // sort points
    pointsByTime.sort( function(a,b) { return a.x - b.x; } );

    x1 = pointsByTime[0].x;
    y1 = pointsByTime[0].y;
    x2 = pointsByTime[1].x;
    y2 = pointsByTime[1].y;
    x3 = pointsByTime[2].x;
    y3 = pointsByTime[2].y;
    x4 = pointsByTime[3].x;
    y4 = pointsByTime[3].y;


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

        path.moveTo(x2, y2)
            .lineTo(x4, y4);

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
anychart.annotationsModule.PatternFibonacciTriangle.prototype.disposeInternal = function() {
    anychart.annotationsModule.PatternFibonacciTriangle.base(this, 'disposeInternal');
  };
//endregion
