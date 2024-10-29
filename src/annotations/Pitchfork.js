goog.provide('anychart.annotationsModule.Pitchfork');
goog.require('anychart.annotationsModule');
goog.require('anychart.annotationsModule.AndrewsPitchfork');
goog.require('anychart.core.settings');
goog.require('anychart.enums');



/**
 * Pitchfork annotation.
 * Includes 3 types of pitchforks: Andrews, Schiff, Modified Schiff.
 * @param {!anychart.annotationsModule.ChartController} chartController
 * @constructor
 * @extends {anychart.annotationsModule.AndrewsPitchfork}
 */
anychart.annotationsModule.Pitchfork = function(chartController) {
  anychart.annotationsModule.Pitchfork.base(this, 'constructor', chartController);


  /**
   * Trend stroke resolver.
   * @param {anychart.annotationsModule.Base} annotation
   * @param {number} state
   * @return {acgraph.vector.Stroke}
   * @private
   */
  this.trendResolver_ = /** @type {function(anychart.annotationsModule.Base,number,number=):acgraph.vector.Stroke} */(
    anychart.annotationsModule.Base.getColorResolver('trend', anychart.enums.ColorType.STROKE, true));


  /**
   * Pitchfork style: 'andrews', 'schiff', 'mod-schiff'
   * @type {?string}
   * @protected
   */
  this.style = 'andrews';


  /**
   * Show extra lines
   * @type {number}
   * @protected
   */
  this.showExtraLines = 1;
};
goog.inherits(anychart.annotationsModule.Pitchfork, anychart.annotationsModule.AndrewsPitchfork);
anychart.core.settings.populateAliases(anychart.annotationsModule.Pitchfork, ['stroke', 'trend'], 'normal');
anychart.annotationsModule.AnnotationTypes[anychart.enums.AnnotationTypes.PITCHFORK] = anychart.annotationsModule.Pitchfork;

//region State settings
/** @inheritDoc */
anychart.annotationsModule.Pitchfork.prototype.getNormalDescriptorsMeta = function() {
    var base = anychart.annotationsModule.Pitchfork.base(this, 'getNormalDescriptorsMeta');
    return goog.array.concat(
        base,
        anychart.annotationsModule.FILL_STROKE_DESCRIPTORS_META,
        anychart.annotationsModule.STROKE_TREND_DESCRIPTORS_META
    );
  };

/**
 * Change pitchfork style
 * @param {string} style
 * @return {anychart.annotationsModule.Pitchfork}
 */
anychart.annotationsModule.Pitchfork.prototype.setStyle = function(style) {
    this.style = style;
    this.invalidate(anychart.ConsistencyState.ANNOTATIONS_SHAPES);
    this.draw();
    return this;
};


/**
 * Get pitchfork style
 * @return {?string}
 */
anychart.annotationsModule.Pitchfork.prototype.getStyle = function() {
    return this.style;
};


/**
 * Show extra lines
 * @param {number} lines
 * @return {anychart.annotationsModule.Pitchfork}
 */
anychart.annotationsModule.Pitchfork.prototype.setExtraLines = function(lines) {
    this.showExtraLines = lines;
    this.invalidate(anychart.ConsistencyState.ANNOTATIONS_SHAPES);
    this.draw();
    return this;
};

/**
 * get extra lines
 * @return {number}
 */
anychart.annotationsModule.Pitchfork.prototype.getExtraLines = function() {
    return this.showExtraLines;
};


//region Properties
//----------------------------------------------------------------------------------------------------------------------
//
//  Properties
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.annotationsModule.Pitchfork.prototype.type = anychart.enums.AnnotationTypes.PITCHFORK;


/**
 * Supported anchors.
 * @type {anychart.annotationsModule.AnchorSupport}
 */
anychart.annotationsModule.Pitchfork.prototype.SUPPORTED_ANCHORS = anychart.annotationsModule.AnchorSupport.THREE_POINTS;

//----------------------------------------------------------------------------------------------------------------------
//
//  Drawing
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.annotationsModule.Pitchfork.prototype.ensureCreated = function() {
    anychart.annotationsModule.Pitchfork.base(this, 'ensureCreated');

    if (!(2 in this.paths_)) {
      // trend stroke
      this.paths_[2] = this.rootLayer.path();
      this.paths_[2].zIndex(anychart.annotationsModule.Base.STROKE_ZINDEX);
    }
  };


/** @inheritDoc */
anychart.annotationsModule.Pitchfork.prototype.colorize = function(state) {
    anychart.annotationsModule.Pitchfork.base(this, 'colorize', state);

    // trend stroke
    var stroke = this.trendResolver_(this, state);
    this.paths_[2]
        .fill(null)
        .stroke(stroke);

  };


/** @inheritDoc */
anychart.annotationsModule.Pitchfork.prototype.drawThreePointsShape = function(x1, y1, x2, y2, x3, y3) {
  // new point
  var x1n = x1;
  var y1n = y1;

  switch (this.style) {
    case 'schiff':
        x1n = x1;
        y1n = y1 + (y2 - y1) / 2;
        break;
    case 'mod-schiff':
        x1n = x1 + (x2 - x1) / 2;
        y1n = y1 + (y2 - y1) / 2;
        break;
  }

  // dx and dy is a vector of the fork
  var dx = (x2 + x3) / 2 - x1n;
  var dy = (y2 + y3) / 2 - y1n;
  // if the vector is zero, let the fork go right horizontal
  if (!dx && !dy) {
    dx = 10;
  }
  var line1 = anychart.math.clipRayByRect(x1n, y1n, x1n + dx, y1n + dy, this.pixelBoundsCache);
  var line2 = anychart.math.clipRayByRect(x2, y2, x2 + dx, y2 + dy, this.pixelBoundsCache);
  var line3 = anychart.math.clipRayByRect(x3, y3, x3 + dx, y3 + dy, this.pixelBoundsCache);
  var handle = anychart.math.clipSegmentByRect(x2, y2, x3, y3, this.pixelBoundsCache);

  var line1n = null;
  switch (this.style) {
    case 'schiff':
    case 'mod-schiff':
        line1n = anychart.math.clipSegmentByRect(x1, y1, x2, y2, this.pixelBoundsCache);
        break;
  }

  // clear all
  for (var i = 0; i < this.paths_.length; i++) {
    var path = this.paths_[i];
    path.clear();
  }

  // normal stroke and hover paths
  for (var i = 0; i < 2; i++) {
    var path = this.paths_[i];
    var hadMoveTo = false;
    if (line2) {
      path.moveTo(line2[2], line2[3]).lineTo(line2[0], line2[1]);
      hadMoveTo = true;
    }
    if (handle) {
      if (hadMoveTo) {
        path.lineTo(handle[0], handle[1]);
      } else {
        path.moveTo(handle[0], handle[1]);
      }
      path.lineTo(handle[2], handle[3]);
      hadMoveTo = true;
    } else {
      hadMoveTo = false;
    }
    if (line3) {
      if (hadMoveTo) {
        path.lineTo(line3[0], line3[1]);
      } else {
        path.moveTo(line3[0], line3[1]);
      }
      path.lineTo(line3[2], line3[3]);
    }
    if (line1) {
      path.moveTo(line1[0], line1[1]).lineTo(line1[2], line1[3]);
    }
    if (line1n) {
      path.moveTo(line1n[0], line1n[1]).lineTo(line1n[2], line1n[3]);
    }
  }

  if (this.showExtraLines) {
    for (var lines = 1; lines <= this.showExtraLines; lines++) {
        var stepx = (lines + 1) * (x3 - x2) / 2;
        var stepy = (lines + 1) * (y2 - y3) / 2;
        var lineup = anychart.math.clipRayByRect(x1n - stepx, y1n + stepy, x1n - stepx + dx, y1n + stepy + dy, this.pixelBoundsCache);
        var linedn = anychart.math.clipRayByRect(x1n + stepx, y1n - stepy, x1n + stepx + dx, y1n - stepy + dy, this.pixelBoundsCache);

        if (lineup) {
            for (var i = 1; i <= 2; i++) {
                // only trend stroke and hover paths
                var path = this.paths_[i];
                path.moveTo(lineup[0], lineup[1]).lineTo(lineup[2], lineup[3]);
            }
        }

        if (linedn) {
            for (var i = 1; i <= 2; i++) {
                // only trend stroke and hover paths
                var path = this.paths_[i];
                path.moveTo(linedn[0], linedn[1]).lineTo(linedn[2], linedn[3]);
            }
        }
    }
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
anychart.annotationsModule.Pitchfork.prototype.disposeInternal = function() {
    anychart.annotationsModule.Pitchfork.base(this, 'disposeInternal');

    delete this.trendResolver_;
  };
//endregion
//exports
(function() {
    var proto = anychart.annotationsModule.Pitchfork.prototype;
    proto['setStyle'] = proto.setStyle;
    proto['getStyle'] = proto.getStyle;
    proto['setExtraLines'] = proto.setExtraLines;
    proto['getExtraLines'] = proto.getExtraLines;
})();
