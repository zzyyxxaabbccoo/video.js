/**
 * @file cue-point-preview.js
 */
import Component from '../../../component.js';
import * as Fn from '../../../utils/fn.js';
// import * as Dom from '../../utils/dom.js';
import {formatTime} from '../../../utils/time.js';
// import {isPlain} from '../../utils/obj';
// import {throttle, bind, UPDATE_REFRESH_INTERVAL} from '../../utils/fn.js';
// import './time-tooltip';

// Required children

/**
 * The component for controlling the volume level
 *
 * @extends Component
 */
class CuePointPreview extends Component {

  /**
   * Creates an instance of this class.
   *
   * @param {Player} player
   *        The `Player` that this class should be attached to.
   *
   * @param {Object} [options={}]
   *        The key/value store of player options.
   */
  constructor(player, options = {}) {
    // options.vertical = true;
    super(player, options);

    this.update = Fn.throttle(Fn.bind_(this, this.update), Fn.UPDATE_REFRESH_INTERVAL);

    // this.throttledHandleMouseMove = throttle(bind(this, this.handleMouseMove), UPDATE_REFRESH_INTERVAL);

    this.on('mouseover', this.handlerMouseOver);

    this.on('click', this.handlerClick);

    // this.player_.on('timeupdate', this.handleUpdate);

    // this.on('mousedown', this.handleMouseDown);
    // this.on('touchstart', this.handleMouseDown);

    // var img = new Component(player,options);
    // this.addChild(img);

    // let spanTime = Dom.createEl('span',{
    //   className: 'cue-point-preview-time',
    //   innerHTML: `${'88:88'}`
    // });
    // this.addChild(spanTime);
  }

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    // const orientationClass = 'vjs-next-vertical';

    // if (this.options_.vertical) {
    //   orientationClass = 'vjs-volume-vertical';
    // }

    // https://p2.img.cctvpic.com/apple3g/www/upload/image/20191224/1577173114282005386.jpg
    // 下集url
    // <div class="next-title">${this.localize('Next')}</div>

    return super.createEl('div', {
      className: 'cue-point-preview vjs-hidden',
      // http://10.246.0.12:8080/api/getVideoSnap.do?guid=a982bb49fa7c4522b6a6b7839620782d&start_time=68
      // innerHTML: `<div class="cue-point-preview-image"><img src="${''}"/></div><div class="cue-point-preview-title">${'-'}</div><span class="cue-point-preview-time">${'88:88'}</span>`
      innerHTML: `<div class="cue-point-preview-image"></div><div class="cue-point-preview-title">${'-'}</div><span class="cue-point-preview-time">${'88:88'}</span>`
    });
  }

  // handleUpdate(event) {
  //   // this.player_.log('timeupdate:' + this.player_.currentTime());
  // }

  updateCue(index, imageGuid, title, time) {
    // this.player_.log(':::'+this.player_.options_.videoSnapUrl);
    const timeStr = formatTime(time, this.player_.duration());
    const imgurl = this.player_.httpPre_ + this.player_.options_.videoSnapUrl;

    if (this.player_.options_.videoSnapUrl !== undefined && this.player_.options_.videoSnapUrl !== '' && this.player_.options_.videoSnapUrl !== ' ') {
      this.el_.innerHTML = `<div class="cue-point-preview-image"><img src="${imgurl + imageGuid + '&start_time=' + time}"/></div><div class="cue-point-preview-title">${title}</div><div class="cue-point-preview-time" style="left:50px">${timeStr}</div>`;
    } else {
      this.el_.innerHTML = `<div class="cue-point-preview-image"><div class= "cue-point-preview-noimage"/></div><div class="cue-point-preview-title">${title}</div><div class="cue-point-preview-time" style="left:50px">${timeStr}</div>`;
    }
  }

  /**
   * Handle `mousedown` or `touchstart` events on the `VolumeControl`.
   *
   * @param {EventTarget~Event} event
   *        `mousedown` or `touchstart` event that triggered this function
   *
   * @listens mousedown
   * @listens touchstart
   */
  handleMouseDown(event) {
    // const doc = this.el_.ownerDocument;
    // this.on(doc, 'mousemove', this.throttledHandleMouseMove);
    // this.on(doc, 'touchmove', this.throttledHandleMouseMove);
    // this.on(doc, 'mouseup', this.handleMouseUp);
    // this.on(doc, 'touchend', this.handleMouseUp);
  }

  handlerMouseOver(event) {
    // this.player().log('[cue-point-preview] mouse over');
  }

  handlerClick(event) {
    // this.player().log('click');

    // seek();
  }

  /**
   * Handle `mouseup` or `touchend` events on the `VolumeControl`.
   *
   * @param {EventTarget~Event} event
   *        `mouseup` or `touchend` event that triggered this function.
   *
   * @listens touchend
   * @listens mouseup
   */
  handleMouseUp(event) {
    // const doc = this.el_.ownerDocument;

    // this.off(doc, 'mousemove', this.throttledHandleMouseMove);
    // this.off(doc, 'touchmove', this.throttledHandleMouseMove);
    // this.off(doc, 'mouseup', this.handleMouseUp);
    // this.off(doc, 'touchend', this.handleMouseUp);
  }

  /**
   * Handle `mousedown` or `touchstart` events on the `VolumeControl`.
   *
   * @param {EventTarget~Event} event
   *        `mousedown` or `touchstart` event that triggered this function
   *
   * @listens mousedown
   * @listens touchstart
   */
  handleMouseMove(event) {
    // this.volumeBar.handleMouseMove(event);
  }

  /**
   * Enqueues updates to its own DOM as well as the DOM of its
   * {@link TimeTooltip} child.
   *
   * @param {Object} seekBarRect
   *        The `ClientRect` for the {@link SeekBar} element.
   *
   * @param {number} seekBarPoint
   *        A number from 0 to 1, representing a horizontal reference point
   *        from the left edge of the {@link SeekBar}
   */
  update(seekBarRect, seekBarPoint) {
    // const time = seekBarPoint * this.player_.duration();

    // 宽146
    let left = seekBarRect.width * seekBarPoint + 10 - 146 / 2;

    if (left < 10) {
      left = 10;
    } else if (left > (seekBarRect.width + 10 - 146)) {
      left = seekBarRect.width + 10 - 146;
    }
    this.el_.style.left = `${left}px`;

    // this.getChild('timeTooltip').updateTime(seekBarRect, seekBarPoint, time, () => {
    // });

  }
}

/**
 * Default options for the `CuePointPreview`
 *
 * @type {Object}
 * @private
 */
CuePointPreview.prototype.options_ = {
  children: [
    // 'timeTooltip'
  ]
};

Component.registerComponent('CuePointPreview', CuePointPreview);
export default CuePointPreview;
