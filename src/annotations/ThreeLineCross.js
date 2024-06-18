goog.provide('anychart.annotationsModule.ThreeLineCross');
goog.require('anychart.annotationsModule');
goog.require('anychart.annotationsModule.Base');
goog.require('anychart.core.settings');
goog.require('anychart.enums');



/**
 * Three line cross pattern for stock chart
 * The first two points define the first line. The second point is the intersection for all the lines.
 * The next two lines are defined using the 3rd and 4th points, both starting in the 2nd point.
 * For a nice visual, the lines are extended past the intersection point with half their length.
 *
 * @param {!anychart.annotationsModule.ChartController} chartController
 * @constructor
 * @extends {anychart.annotationsModule.Base}
 */
anychart.annotationsModule.ThreeLineCross = function(chartController) {
  anychart.annotationsModule.ThreeLineCross.base(this, 'constructor', chartController);

  /**
   * Paths array.
   * @type {Array.<acgraph.vector.Path>}
   * @private
   */
  this.paths_ = null;

  /**
   * Stroke resolver.
   * @param {anychart.annotationsModule.Base} annotation
   * @param {number} state
   * @return {acgraph.vector.Stroke}
   * @private
   */
  this.strokeResolver_ = /** @type {function(anychart.annotationsModule.Base,number):acgraph.vector.Stroke} */(
      anychart.annotationsModule.Base.getColorResolver('stroke', anychart.enums.ColorType.STROKE, true));

  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, anychart.annotationsModule.X_ANCHOR_DESCRIPTORS_META);
  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, anychart.annotationsModule.VALUE_ANCHOR_DESCRIPTORS_META);
  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, anychart.annotationsModule.SECOND_ANCHOR_POINT_DESCRIPTORS_META);
  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, anychart.annotationsModule.THIRD_ANCHOR_POINT_DESCRIPTORS_META);
  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, anychart.annotationsModule.FOURTH_ANCHOR_POINT_DESCRIPTORS_META);
};
goog.inherits(anychart.annotationsModule.ThreeLineCross, anychart.annotationsModule.Base);
anychart.core.settings.populateAliases(anychart.annotationsModule.ThreeLineCross, ['fill', 'stroke'], 'normal');
anychart.core.settings.populate(anychart.annotationsModule.ThreeLineCross, anychart.annotationsModule.X_ANCHOR_DESCRIPTORS);
anychart.core.settings.populate(anychart.annotationsModule.ThreeLineCross, anychart.annotationsModule.VALUE_ANCHOR_DESCRIPTORS);
anychart.core.settings.populate(anychart.annotationsModule.ThreeLineCross, anychart.annotationsModule.SECOND_ANCHOR_POINT_DESCRIPTORS);
anychart.core.settings.populate(anychart.annotationsModule.ThreeLineCross, anychart.annotationsModule.THIRD_ANCHOR_POINT_DESCRIPTORS);
anychart.core.settings.populate(anychart.annotationsModule.ThreeLineCross, anychart.annotationsModule.FOURTH_ANCHOR_POINT_DESCRIPTORS);
anychart.annotationsModule.AnnotationTypes[anychart.enums.AnnotationTypes.THREELINECROSS] = anychart.annotationsModule.ThreeLineCross;


//region Properties
//----------------------------------------------------------------------------------------------------------------------
//
//  Properties
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.annotationsModule.ThreeLineCross.prototype.type = anychart.enums.AnnotationTypes.THREELINECROSS;


/**
 * Supported anchors.
 * @type {anychart.annotationsModule.AnchorSupport}
 */
anychart.annotationsModule.ThreeLineCross.prototype.SUPPORTED_ANCHORS = anychart.annotationsModule.AnchorSupport.FOUR_POINTS;


//endregion
//region State settings
/** @inheritDoc */
anychart.annotationsModule.ThreeLineCross.prototype.getNormalDescriptorsMeta = function() {
  var base = anychart.annotationsModule.ThreeLineCross.base(this, 'getNormalDescriptorsMeta');
  return goog.array.concat(base, anychart.annotationsModule.STROKE_DESCRIPTORS_META);
};


//endregion
//region Drawing
//----------------------------------------------------------------------------------------------------------------------
//
//  Drawing
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.annotationsModule.ThreeLineCross.prototype.ensureCreated = function() {
  anychart.annotationsModule.ThreeLineCross.base(this, 'ensureCreated');

  if (!this.paths_) {
    // main, hover
    this.paths_ = [this.rootLayer.path(), this.rootLayer.path()];
    this.paths_[0].zIndex(anychart.annotationsModule.Base.SHAPES_ZINDEX);
    this.paths_[1].zIndex(anychart.annotationsModule.Base.HOVER_SHAPE_ZINDEX);
  }
};


/** @inheritDoc */
anychart.annotationsModule.ThreeLineCross.prototype.drawOnePointShape = function(x, y) {
  for (var i = 0; i < this.paths_.length; i++) {
    var path = this.paths_[i];
    path.clear();
    path.moveTo(x, y).lineTo(x, y);
  }
};


/** @inheritDoc */
anychart.annotationsModule.ThreeLineCross.prototype.drawTwoPointsShape = function(x1, y1, x2, y2) {
  // extend line
  var ex, ey;

  if (x1 < x2) {
    ex = x2 + (x2 - x1) / 2;
  } else {
    ex = x2 - (x1 - x2) / 2;
  }

  ey = y1 - (ex - x1) / (x2 - x1) * (y1 - y2);

  for (var i = 0; i < this.paths_.length; i++) {
    var path = this.paths_[i];
    path.clear();
    path.moveTo(x1, y1).lineTo(ex, ey);
  }
};


/** @inheritDoc */
anychart.annotationsModule.ThreeLineCross.prototype.drawThreePointsShape = function(x1, y1, x2, y2, x3, y3) {
  this.drawTwoPointsShape(x1, y1, x2, y2);

  // extend 2nd line
  var ex, ey;

  if (x3 < x2) {
    ex = x2 + (x2 - x3) / 2;
  } else {
    ex = x2 - (x3 - x2) / 2;
  }

  ey = y3 - (ex - x3) / (x2 - x3) * (y3 - y2);

  for (var i = 0; i < this.paths_.length; i++) {
    var path = this.paths_[i];
    path.moveTo(x3, y3).lineTo(ex, ey);
  }
};


/** @inheritDoc */
anychart.annotationsModule.ThreeLineCross.prototype.drawFourPointsShape = function(x1, y1, x2, y2, x3, y3, x4, y4) {
  this.drawThreePointsShape(x1, y1, x2, y2, x3, y3);

    // extend 3rd line
  var ex, ey;

  if (x4 < x2) {
    ex = x2 + (x2 - x4) / 2;
  } else {
    ex = x2 - (x4 - x2) / 2;
  }

  ey = y4 - (ex - x4) / (x2 - x4) * (y4 - y2);

  for (var i = 0; i < this.paths_.length; i++) {
    var path = this.paths_[i];
    path.moveTo(x4, y4).lineTo(ex, ey);
  }
};


/** @inheritDoc */
anychart.annotationsModule.ThreeLineCross.prototype.colorize = function(state) {
  anychart.annotationsModule.ThreeLineCross.base(this, 'colorize', state);
  this.paths_[0].stroke(this.strokeResolver_(this, state));
  this.paths_[1]
      .stroke(/** @type {acgraph.vector.SolidFill} */(anychart.color.TRANSPARENT_HANDLER), this['hoverGap']() * 2);
};


//endregion
//region Serialization / Deserialization / Disposing
//----------------------------------------------------------------------------------------------------------------------
//
//  Serialization / Deserialization / Disposing
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.annotationsModule.ThreeLineCross.prototype.serialize = function() {
  var json = anychart.annotationsModule.ThreeLineCross.base(this, 'serialize');

  anychart.core.settings.serialize(this, anychart.annotationsModule.X_ANCHOR_DESCRIPTORS, json, 'Annotation');
  anychart.core.settings.serialize(this, anychart.annotationsModule.VALUE_ANCHOR_DESCRIPTORS, json, 'Annotation');
  anychart.core.settings.serialize(this, anychart.annotationsModule.SECOND_ANCHOR_POINT_DESCRIPTORS, json, 'Annotation');
  anychart.core.settings.serialize(this, anychart.annotationsModule.THIRD_ANCHOR_POINT_DESCRIPTORS, json, 'Annotation');
  anychart.core.settings.serialize(this, anychart.annotationsModule.FOURTH_ANCHOR_POINT_DESCRIPTORS, json, 'Annotation');

  return json;
};


/** @inheritDoc */
anychart.annotationsModule.ThreeLineCross.prototype.setupByJSON = function(config, opt_default) {
  anychart.annotationsModule.ThreeLineCross.base(this, 'setupByJSON', config, opt_default);

  anychart.core.settings.deserialize(this, anychart.annotationsModule.X_ANCHOR_DESCRIPTORS, config);
  anychart.core.settings.deserialize(this, anychart.annotationsModule.VALUE_ANCHOR_DESCRIPTORS, config);
  anychart.core.settings.deserialize(this, anychart.annotationsModule.SECOND_ANCHOR_POINT_DESCRIPTORS, config);
  anychart.core.settings.deserialize(this, anychart.annotationsModule.THIRD_ANCHOR_POINT_DESCRIPTORS, config);
  anychart.core.settings.deserialize(this, anychart.annotationsModule.FOURTH_ANCHOR_POINT_DESCRIPTORS, config);
};


/** @inheritDoc */
anychart.annotationsModule.ThreeLineCross.prototype.disposeInternal = function() {
  anychart.annotationsModule.ThreeLineCross.base(this, 'disposeInternal');

  goog.disposeAll(this.paths_);
  delete this.strokeResolver_;
};
//endregion
