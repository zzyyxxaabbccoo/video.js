/**
 * @file cue-point.js
 */
import Component from '../../../component.js';
import {IS_IOS, IS_ANDROID} from '../../../utils/browser.js';
// import formatTime from '../../utils/format-time.js';
// import * as Fn from '../../utils/fn.js';

/**
 * Used by {@link SeekBar} to display cue-points as part of the
 * {@link ProgressControl}.
 *
 * @extends Component
 */
class CuePoint extends Component {

  /**
   * Creates an instance of this class.
   *
   * @param {Player} player
   *        The {@link Player} that this class should be attached to.
   *
   * @param {Object} [options]
   *        The key/value store of player options.
   */
  constructor(player, options, index = 0) {
    super(player, options);
    // player.log('cue-points:' + player.options_.cuePoints);
    this.index_ = index;
    this.start_ = player.options_.cuePoints[index].start;
    this.title_ = player.options_.cuePoints[index].title;
    this.end_ = player.options_.cuePoints[index].end;
    this.guid_ = player.options_.cuePoints[index].guid;
    // player.log('start:' + player.options_.cuePoints[index]['start']);
    // player.log('title:' + player.options_.cuePoints[index]['title']);
    // this.update = Fn.throttle(Fn.bind_(this, this.update), Fn.UPDATE_REFRESH_INTERVAL);

    // player.log('duration:' + player.duration());

    this.on(player, 'durationchange', this.update);

    // this.on(this.el_, 'mouseup', this.handleMouseUp);
    this.on(this.el_, 'mouseover', this.handleMouseOver);
    this.on(this.el_, 'mouseout', this.handleMouseOut);
    this.on(this.el_, 'mousedown', this.handleMouseDown);
    // this.on(this.el_, 'click', this.handleClick);
  }

  /**
   * Create the the DOM element for this class.
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    const el = super.createEl('div', {
      className: 'vjs-cue-point'
    }, {
      'aria-hidden': 'true'
    });

    return el;
  }

  getIndex() {
    return this.index_;
  }
  getStart() {
    return this.start_;
  }
  getTitle() {
    return this.title_;
  }
  getEnd() {
    return this.end_;
  }

  /**
   * Handle `mouseup` or `touchend` events on the `ProgressControl`.
   *
   * @param {EventTarget~Event} event
   *        `mouseup` or `touchend` event that triggered this function.
   *
   * @listens touchend
   * @listens mouseup
   */

  handleMouseOver(event) {
    // this.player_.log('[cue-point] mouseover' + this.getStart());
    this.parentComponent_.parentComponent_.parentComponent_.showCuePointPreview(this.index_, this.guid_, this.title_, this.start_ / 1000);
    // this.parentComponent_.parentComponent_.parentComponent_.getChild('cuePointPreview').updateCue(this.index_, this.guid_, this.title_, this.start_ / 1000);
    this.parentComponent_.parentComponent_.getChild('mouseTimeDisplay').getChild('timeTooltip').hide();
  }

  handleMouseOut(event) {
    // this.player_.log('[cue-point] mouseout' + this.getStart());
    this.parentComponent_.parentComponent_.parentComponent_.hideCuePointPreview();
    this.parentComponent_.parentComponent_.getChild('mouseTimeDisplay').getChild('timeTooltip').show();
  }

  handleClick(event) {
    // this.player_.log('[cue-point] click' + this.getStart());
    event.stopPropagation();
  }

  handleMouseDown(event) {
    // this.player_.log('[cue-point] mousedown');
    this.player_.currentTime(this.start_ / 1000);
    event.stopPropagation();
  }

  /**
   *
   */
  update() {
    // this.player_.log('update ' + this.player_.duration() + '::' + this.getIndex());
    if (isNaN(this.player_.duration()) && this.player_.duration() > 16) {
      // this.player_.log('update:' + this.getStart() / 1000 / this.player_.duration());
    } else {
      // this.player_.log('update: NaN');
    }

    this.el().style.left = this.getStart() / 1000 / this.player_.duration() * 100 + '%';

    // const timeTooltip = this.getChild('timeTooltip');

    // if (!timeTooltip) {
    //   return;
    // }

    // const time = (this.player_.scrubbing()) ?
    //   this.player_.getCache().currentTime :
    //   this.player_.currentTime();

    // timeTooltip.updateTime(seekBarRect, seekBarPoint, time);
  }
}

/**
 * Default options for {@link CuePoint}.
 *
 * @type {Object}
 * @private
 */
CuePoint.prototype.options_ = {
  children: []
};

// Time tooltips should not be added to a player on mobile devices
if (!IS_IOS && !IS_ANDROID) {
  // CuePoint.prototype.options_.children.push('timeTooltip');
}

Component.registerComponent('CuePoint', CuePoint);
export default CuePoint;
