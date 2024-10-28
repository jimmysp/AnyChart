goog.provide('anychart.annotationsModule.SchiffPitchfork');
goog.require('anychart.annotationsModule');
goog.require('anychart.annotationsModule.AndrewsPitchfork');
goog.require('anychart.core.settings');
goog.require('anychart.enums');



/**
 * SchiffPitchfork annotation.
 * @param {!anychart.annotationsModule.ChartController} chartController
 * @constructor
 * @extends {anychart.annotationsModule.AndrewsPitchfork}
 */
anychart.annotationsModule.SchiffPitchfork = function(chartController) {
  anychart.annotationsModule.SchiffPitchfork.base(this, 'constructor', chartController);
};
goog.inherits(anychart.annotationsModule.SchiffPitchfork, anychart.annotationsModule.AndrewsPitchfork);
anychart.annotationsModule.AnnotationTypes[anychart.enums.AnnotationTypes.SCHIFF_PITCHFORK] = anychart.annotationsModule.SchiffPitchfork;


//region Properties
//----------------------------------------------------------------------------------------------------------------------
//
//  Properties
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.annotationsModule.SchiffPitchfork.prototype.type = anychart.enums.AnnotationTypes.SCHIFF_PITCHFORK;


/**
 * Supported anchors.
 * @type {anychart.annotationsModule.AnchorSupport}
 */
anychart.annotationsModule.SchiffPitchfork.prototype.SUPPORTED_ANCHORS = anychart.annotationsModule.AnchorSupport.THREE_POINTS;


//endregion
//region Drawing
//----------------------------------------------------------------------------------------------------------------------
//
//  Drawing
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.annotationsModule.SchiffPitchfork.prototype.drawThreePointsShape = function(x1, y1, x2, y2, x3, y3) {
  // new point
  var x1n = x1;
  var y1n = y1 + (y2 - y1) / 2;

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
  var line1n = anychart.math.clipSegmentByRect(x1, y1, x2, y2, this.pixelBoundsCache);

  for (var i = 0; i < this.paths_.length; i++) {
    var path = this.paths_[i];
    path.clear();
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
};

//endregion
