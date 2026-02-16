goog.provide('anychart.annotationsModule.ProfileBars');
goog.require('anychart.annotationsModule.Base');



/**
 * ProfileBars annotation.
 * Must supply bars data with method barsData( {...} )
 *
 * @param {!anychart.annotationsModule.ChartController} chartController
 * @constructor
 * @extends {anychart.annotationsModule.Base}
 */
anychart.annotationsModule.ProfileBars = function(chartController) {
  anychart.annotationsModule.ProfileBars.base(this, 'constructor', chartController);

  /**
   * Whether auto width calculation needed.
   * If true - auto calculate and apply channel width
   * after drawing mode is finished.
   */
  this.needsAutoWidth_ = false;

  /**
   * Paths array.
   * 0 - stroke path
   * 1 - fill path
   * 2 - low volume area fill path
   * 3 - transparent handler path
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

  /**
   * Fill resolver.
   * @param {anychart.annotationsModule.Base} annotation
   * @param {number} state
   * @return {acgraph.vector.Fill}
   * @private
   */
  this.fillResolver_ = /** @type {function(anychart.annotationsModule.Base,number):acgraph.vector.Fill} */(
      anychart.annotationsModule.Base.getColorResolver('fill', anychart.enums.ColorType.FILL, true));

  /* *
   * fill resolver for low volume bars
   * @param {anychart.annotationsModule.Base} annotation
   * @param {number} state
   * @return {acgraph.vector.Fill}
   * @private
   */
  /*this.lowVolumeFillResolver_ = /** @type {function(anychart.annotationsModule.Base,number):acgraph.vector.Fill} * /(
      anychart.annotationsModule.Base.getColorResolver('lowVolumeFill', anychart.enums.ColorType.FILL, true));*/

  anychart.core.settings.createDescriptorMeta(this.descriptorsMeta, 'showTrend', anychart.ConsistencyState.ANNOTATIONS_SHAPES | anychart.ConsistencyState.ANNOTATIONS_ANCHORS, anychart.Signal.NEEDS_REDRAW);
  anychart.core.settings.createDescriptorMeta(this.descriptorsMeta, 'barsData', anychart.ConsistencyState.ANNOTATIONS_SHAPES | anychart.ConsistencyState.ANNOTATIONS_ANCHORS, anychart.Signal.NEEDS_REDRAW);
  // anychart.core.settings.createDescriptorMeta(this.descriptorsMeta, 'lowVolumeFill', anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, anychart.annotationsModule.X_ANCHOR_DESCRIPTORS_META);
  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, anychart.annotationsModule.VALUE_ANCHOR_DESCRIPTORS_META);
  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, anychart.annotationsModule.SECOND_ANCHOR_POINT_DESCRIPTORS_META);

};
goog.inherits(anychart.annotationsModule.ProfileBars, anychart.annotationsModule.Base);
anychart.annotationsModule.AnnotationTypes[anychart.enums.AnnotationTypes.PROFILE_BARS] = anychart.annotationsModule.ProfileBars;


anychart.core.settings.populateAliases(anychart.annotationsModule.ProfileBars, ['fill', 'stroke'], 'normal');
anychart.core.settings.populate(anychart.annotationsModule.ProfileBars, anychart.annotationsModule.X_ANCHOR_DESCRIPTORS);
anychart.core.settings.populate(anychart.annotationsModule.ProfileBars, anychart.annotationsModule.VALUE_ANCHOR_DESCRIPTORS);
anychart.core.settings.populate(anychart.annotationsModule.ProfileBars, anychart.annotationsModule.SECOND_ANCHOR_POINT_DESCRIPTORS);

anychart.annotationsModule.ProfileBars.prototype.SUPPORTED_ANCHORS = anychart.annotationsModule.AnchorSupport.TWO_POINTS;

/*anychart.annotationsModule.ProfileBars.LOW_VOLUME_DESCRIPTORS_META = (function() {
  return [
    ['lowVolumeFill', anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW]
  ];
})();*/

anychart.annotationsModule.ProfileBars.OWN_DESCRIPTORS = (function() {
  /** @type {!Object.<string, anychart.core.settings.PropertyDescriptor>} */
  var map = {};
  anychart.core.settings.createDescriptor(
      map,
      anychart.enums.PropertyHandlerType.SINGLE_ARG,
      'showTrend',
      anychart.core.settings.booleanNormalizer);
  anychart.core.settings.createDescriptor(
      map,
      anychart.enums.PropertyHandlerType.SINGLE_ARG,
      'barsData',
      anychart.core.settings.asIsNormalizer);
  /*anychart.core.settings.createDescriptor(
      map,
      anychart.enums.PropertyHandlerType.SINGLE_ARG,
      'lowVolumeFill',
      anychart.core.settings.colorNormalizer);*/
  return map;
})();

anychart.core.settings.populate(anychart.annotationsModule.ProfileBars, anychart.annotationsModule.ProfileBars.OWN_DESCRIPTORS);


/** @inheritDoc */
anychart.annotationsModule.ProfileBars.prototype.type = anychart.enums.AnnotationTypes.PROFILE_BARS;


/** @inheritDoc */
anychart.annotationsModule.ProfileBars.prototype.drawOnePointShape = function(x, y) {
  this.clearPaths_();
  var strokePath = this.paths_[0];
  strokePath.moveTo(x, y).lineTo(x, y);
};


/**
 * "bars":[
 *    {"high":"30970.180000000000000","low":30951.842345059144,"endTime":1681455735388},
 *    {"high":30951.842345059144,"low":30933.504690118287,"endTime":1681455735388},
 *    ....
 * ];
 */
/** @inheritDoc */
anychart.annotationsModule.ProfileBars.prototype.drawTwoPointsShape = function(x1, y1, x2, y2) {

  for (var i = 0; i < this.paths_.length; i++) {
    var path = this.paths_[i];
    path.clear();

    if (this.getOption('showTrend')) {
      path.moveTo(x1, y1).lineTo(x2, y2);
    }
  }

  // console.log(this.lowVolumeFillResolver_);
  // console.log(this.lowVolumeFillResolver_.fill());

  var barsPath = this.paths_[2];
  var barsData = this.getOption('barsData');
  var prevBarLow = null;

  if (goog.isArray(barsData)) {
    for (i = 0; i < barsData.length; i++) {

      var bar = barsData[i];
      // leave 0.5 pixel between bars
      var barHigh  = prevBarLow ? prevBarLow + 0.5 : this.yRatioToPix(this.yScale().transform(bar['high'], 0.5));
      var barLow   = this.yRatioToPix(this.yScale().transform(bar['low'], 0.5));
      var barStart = this.xRatioToPix(this.xScale().transform(bar['start'], 0.5));
      var barEnd   = this.xRatioToPix(this.xScale().transform(bar['end'], 0.5));

      // va = value area (high volume)
      // low volume on paths_[2]
      barsPath = this.paths_[2];
      if (bar['va']) {
        barsPath = this.paths_[1];
      }

      barsPath.moveTo(barStart, barHigh)
        .lineTo(barEnd, barHigh)
        .lineTo(barEnd, barLow)
        .lineTo(barStart, barLow)
        .close();

      prevBarLow = barLow;
    }
  }

};


/** @inheritDoc */
anychart.annotationsModule.ProfileBars.prototype.colorize = function(state) {
  anychart.annotationsModule.ProfileBars.base(this, 'colorize', state);
  this.paths_[0]
      .fill(null)
      .stroke(this.strokeResolver_(this, state));

  // va = value area (high volume), less transparency
  var vaFill = this.fillResolver_(this, state);
  var vaOpacity = goog.isDef(vaFill.opacity) ? vaFill.opacity * 3 : 1;

  this.paths_[1]
      .stroke(null)
      .fill({color: vaFill.color, opacity: Math.min(1, vaOpacity)});

  // low volume on paths_[2]
  this.paths_[2]
      .stroke(null)
      .fill(this.fillResolver_(this, state));
  this.paths_[3]
      .fill(anychart.color.TRANSPARENT_HANDLER)
      .stroke(/** @type {acgraph.vector.SolidFill} */(anychart.color.TRANSPARENT_HANDLER), this['hoverGap']() * 2);
};


/** @inheritDoc */
anychart.annotationsModule.ProfileBars.prototype.ensureCreated = function() {
  anychart.annotationsModule.ProfileBars.base(this, 'ensureCreated');

  if (!this.paths_) {
    this.paths_ = [
      this.rootLayer.path(), // Stroke
      this.rootLayer.path(), // Fill
      this.rootLayer.path(), // Low volume area fill
      this.rootLayer.path()  // Transparent handler
    ];

    this.paths_[0].zIndex(anychart.annotationsModule.Base.STROKE_ZINDEX);
    this.paths_[1].zIndex(anychart.annotationsModule.Base.SHAPES_ZINDEX);
    this.paths_[2].zIndex(anychart.annotationsModule.Base.SHAPES_ZINDEX);
    this.paths_[3].zIndex(anychart.annotationsModule.Base.HOVER_SHAPE_ZINDEX);
  }
};



/** @inheritDoc */
anychart.annotationsModule.ProfileBars.prototype.getNormalDescriptorsMeta = function() {
  var base = anychart.annotationsModule.ProfileBars.base(this, 'getNormalDescriptorsMeta');
  return goog.array.concat(
    base,
    anychart.annotationsModule.FILL_STROKE_DESCRIPTORS_META
    // anychart.annotationsModule.ProfileBars.LOW_VOLUME_DESCRIPTORS_META
  );
};


/** @inheritDoc */
anychart.annotationsModule.ProfileBars.prototype.setupByJSON = function(config, opt_default) {
  anychart.annotationsModule.ProfileBars.base(this, 'setupByJSON', config, opt_default);

  anychart.core.settings.deserialize(this, anychart.annotationsModule.ProfileBars.OWN_DESCRIPTORS, config);

  anychart.core.settings.deserialize(this, anychart.annotationsModule.X_ANCHOR_DESCRIPTORS, config);
  anychart.core.settings.deserialize(this, anychart.annotationsModule.VALUE_ANCHOR_DESCRIPTORS, config);
  anychart.core.settings.deserialize(this, anychart.annotationsModule.SECOND_ANCHOR_POINT_DESCRIPTORS, config);
};


/** @inheritDoc */
anychart.annotationsModule.ProfileBars.prototype.serialize = function() {
  var json = anychart.annotationsModule.ProfileBars.base(this, 'serialize');

  anychart.core.settings.serialize(this, anychart.annotationsModule.ProfileBars.OWN_DESCRIPTORS, json, 'Annotation');

  anychart.core.settings.serialize(this, anychart.annotationsModule.X_ANCHOR_DESCRIPTORS, json, 'Annotation');
  anychart.core.settings.serialize(this, anychart.annotationsModule.VALUE_ANCHOR_DESCRIPTORS, json, 'Annotation');
  anychart.core.settings.serialize(this, anychart.annotationsModule.SECOND_ANCHOR_POINT_DESCRIPTORS, json, 'Annotation');

  return json;
};


/** @inheritDoc */
anychart.annotationsModule.ProfileBars.prototype.disposeInternal = function() {
  anychart.annotationsModule.ProfileBars.base(this, 'disposeInternal');

  goog.disposeAll(this.paths_);
  delete this.strokeResolver_;
  delete this.fillResolver_;
  // delete this.lowVolumeFillResolver_;
};


/** @inheritDoc */
anychart.annotationsModule.ProfileBars.prototype.updateLastPoint = function(x, y) {
  /*
    This method is only invoked in drawing mode.
    And after drawing is finished - auto width must be set.
   */
  this.needsAutoWidth_ = true;
  anychart.annotationsModule.ProfileBars.base(this, 'updateLastPoint', x, y);
};


/**
 * Clears paths, used before drawing.
 */
anychart.annotationsModule.ProfileBars.prototype.clearPaths_ = function() {
  for (var i = 0; i < this.paths_.length; i++) {
    this.paths_[i].clear();
  }
};
