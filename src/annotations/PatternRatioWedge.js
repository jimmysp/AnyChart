goog.provide('anychart.annotationsModule.PatternRatioWedge');
goog.require('anychart.annotationsModule');
goog.require('anychart.annotationsModule.PatternBase');
goog.require('anychart.core.settings');
goog.require('anychart.enums');



/**
 * Ratio Wedge pattern for stock chart.
 * The wedge is a price pattern marked by converging trend lines on a price chart.
 *
 * @param {!anychart.annotationsModule.ChartController} chartController
 * @constructor
 * @extends {anychart.annotationsModule.PatternBase}
 */
anychart.annotationsModule.PatternRatioWedge = function(chartController) {
  anychart.annotationsModule.PatternRatioWedge.base(this, 'constructor', chartController);

  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, anychart.annotationsModule.FOURTH_ANCHOR_POINT_DESCRIPTORS_META);

  /**
   * Pattern ratio
   * @type {number}
   * @protected
   */
  this.ratio = 1.786;

  /**
   * Pattern pointer
   * @type {anychart.math.Point2D}
   * @protected
   */
  this.pointer = null;
};

goog.inherits(anychart.annotationsModule.PatternRatioWedge, anychart.annotationsModule.PatternBase);
anychart.core.settings.populate(anychart.annotationsModule.PatternRatioWedge, anychart.annotationsModule.FOURTH_ANCHOR_POINT_DESCRIPTORS);
anychart.annotationsModule.AnnotationTypes[anychart.enums.AnnotationTypes.PATTERNRATIOWEDGE] = anychart.annotationsModule.PatternRatioWedge;


/**
 * Set ratio
 * @param {number} ratio
 * @return {Array.<number>|anychart.annotationsModule.PatternRatioWedge}
 */
/*anychart.annotationsModule.PatternRatioWedge.prototype.setRatio = function(ratio) {
    this.ratio = ratio;
    this.invalidate(anychart.ConsistencyState.ANNOTATIONS_LAST_POINT);
    this.draw();
    return this;
  };*/

/**
 * Get ratio
 * @return {number}
 */
anychart.annotationsModule.PatternRatioWedge.prototype.getRatio = function() {
    return this.ratio;
  };

/**
 * Get pointer
 * @return {anychart.math.Point2D}
 */
anychart.annotationsModule.PatternRatioWedge.prototype.getPointer = function() {
    return this.pointer;
  };


//region Properties
//----------------------------------------------------------------------------------------------------------------------
//
//  Properties
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.annotationsModule.PatternRatioWedge.prototype.type = anychart.enums.AnnotationTypes.PATTERNRATIOWEDGE;


/**
 * Supported anchors.
 * @type {anychart.annotationsModule.AnchorSupport}
 */
anychart.annotationsModule.PatternRatioWedge.prototype.SUPPORTED_ANCHORS = anychart.annotationsModule.AnchorSupport.FOUR_POINTS;


//endregion
//region Drawing
//----------------------------------------------------------------------------------------------------------------------
//
//  Drawing
//
//----------------------------------------------------------------------------------------------------------------------

/** @inheritDoc */
anychart.annotationsModule.PatternRatioWedge.prototype.drawTwoPointsShape = function(x1, y1, x2, y2) {
    // stroke only
    var path = this.paths_[0];
    path.clear();
    path.moveTo(x1, y1).lineTo(x2, y2);
};


/** @inheritDoc */
anychart.annotationsModule.PatternRatioWedge.prototype.drawThreePointsShape = function(x1, y1, x2, y2, midx1, midy1) {
    // constraints
    /*x2 = Math.max(x1 + 1, x2);
    midx1 = Math.min(midx1, x1 - 1);

    // project midx on trend line
    y1 = y1 - (midx1 - x1) / (x2 - x1) * (y1 - y2);
    x1 = midx1;

    // extend trend line for 3 points
    var px = x2 + (x2 - x1) / 2;
    var py = y2 + (y2 - y1) / 2;

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

        // middle line
        if (px && py && midx1 < px) {
            path.moveTo(x1, midy1)
                .lineTo(px, py);
        }
    }*/
    this.drawTwoPointsShape(x1, y1, x2, y2);
};
//endregion

/** @inheritDoc */
anychart.annotationsModule.PatternRatioWedge.prototype.drawFourPointsShape = function(x1, y1, x2, y2, x3, y3, x4, y4) {
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

    return;

    // constraints
    /*x2 = Math.max(x1 + 1, x2);
    midx1 = Math.min(midx1, x1 - 1);

    // project x3 on trend line
    // var py3 = y1 - (x3 - x1) / (x2 - x1) * (y1 - y2);

    // use x3 line to calculate the ratio
    /*this.ratio = 1 + Math.abs(
        Math.sqrt((y1 - midy1) * (y1 - midy1) + (x1 - x3) * (x1 - x3)) /
        Math.sqrt((y1 - y3) * (y1 - y3) + (x1 - x3) * (x1 - x3))
    );*/

    // not consistent - when zooming it gives different results
    // should transform x coordinates to timestamps to have consistent ratios
    /*this.ratio = 1 + Math.abs(
        (y1 - midy1) /
        Math.sqrt((y1 - y3) * (y1 - y3) + (x1 - x3) * (x1 - x3))
    );* /

    this.ratio = 1 + Math.abs(
        (y1 - midy1) /
        (y1 - y3)
    );

    // use x3 line to calculate the ratio
    /*this.ratio = 1 + Math.abs(
        (y1 - midy1) /
        (py3 - y3)
    );*/

    /*if (x3 < x1) {
        // project x3 on line
        y1 = y1 - (x3 - x1) / (x2 - x1) * (y1 - y2);
        x1 = x3;
    }* /

    // project x3 on trend line
    // var py3 = y1 - (x3 - x1) / (x2 - x1) * (y1 - y2);

    var midx2, midy2;
    // midx1 = x3 + (x1 - x3) / this.ratio;
    midx2 = x3 + (x2 - x3) / this.ratio;
    midy2 = y3 + (y2 - y3) / this.ratio;

    // calculate second mid point using the ratio
    // var midy2 = py3 + (y3 - py3) / this.ratio;
    // var midx2 = x3;

    // triangle tip point
    var px = null, py = null;
    this.pointer = anychart.math.intersectInfiniteLineLine(x1, y1, x2, y2, midx1, midy1, midx2, midy2);
    if (this.pointer) {
        px = this.pointer.x;
        py = this.pointer.y;
    }

    // project x1 on middle line
    /*var py1mid = midy1 - (x1 - midx1) / (midx2 - midx1) * (midy1 - midy2);
    y3 = y1 + (py1mid - y1) * this.ratio;
    x3 = x1;* /

    var x4 = x2;
    var y4 = y3 - (x4 - x3) / (px - x3) * (y3 - py);

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
            path.moveTo(x3, y3)
                .lineTo(x4, y4);
        }

        // middle line
        if (px && py && midx1 < px) {
            path.moveTo(midx1, midy1)
                .lineTo(px, py);
        }
    }*/
};
//endregion

//region Serialization / Deserialization / Disposing
//----------------------------------------------------------------------------------------------------------------------
//
//  Serialization / Deserialization / Disposing
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.annotationsModule.PatternRatioWedge.prototype.disposeInternal = function() {
    anychart.annotationsModule.PatternRatioWedge.base(this, 'disposeInternal');

    delete this.ratio;
  };
//endregion
//export
(function() {
    var proto = anychart.annotationsModule.PatternRatioWedge.prototype;
    proto['getRatio'] = proto.getRatio;
    // proto['getPointer'] = proto.getPointer;
    // proto['setRatio'] = proto.setRatio;
  })();
