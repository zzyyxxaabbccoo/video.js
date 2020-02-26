/**
 * @file skip-ad-display.js
 */
import document from 'global/document';
import TimeDisplay from './time-display';
import Component from '../../component.js';

/**
 * Displays the time left in the video
 *
 * @extends Component
 */
class SkipADDisplay extends TimeDisplay {

  /**
   * Creates an instance of this class.
   *
   * @param {Player} player
   *        The `Player` that this class should be attached to.
   *
   * @param {Object} [options]
   *        The key/value store of player options.
   */
  constructor(player, options) {
    super(player, options);

    this.on(player, 'durationchange', this.updateContent);
    this.on('mousedown', this.handleMouseDown);
  }

  /**
   * 广告可跳过剩余时间
   *
   */
  skipTime() {
    return 5;
  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object.
   */
  buildCSSClass() {
    return 'vjs-ad-skip-time';
  }

  /**
   * Create the `Component`'s DOM element with the "minus" characted prepend to the time
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    const el = super.createEl();

    // el.insertBefore(Dom.createEl('span', {}, {'aria-hidden': true}, '广告'), this.contentEl_);
    // el.insertBefore(Dom.createEl('span', {}, {'aria-hidden': true}, '（'), this.contentEl_);
    // el.appendChild(Dom.createEl('span', {}, {'aria-hidden': true}, '秒后可跳过）'), this.contentEl_);
    // const skipBtn = Dom.createEl('button', {}, {'aria-hidden': true}, '跳过');
    // el.appendChild(skipBtn, this.contentEl_);
    return el;
  }

  /**
   * Update remaining time display.
   *
   * @param {EventTarget~Event} [event]
   *        The `timeupdate` or `durationchange` event that caused this to run.
   *
   * @listens Player#timeupdate
   * @listens Player#durationchange
   */
  updateContent(event) {
    if (typeof this.player_.duration() !== 'number') {
      return;
    }

    let time;

    let skipTime;

    // @deprecated We should only use remainingTimeDisplay
    // as of video.js 7
    if (this.player_.ended()) {
      time = 0;
    } else if (this.player_.remainingTimeDisplay) {
      time = this.player_.remainingTimeDisplay();
      skipTime = this.player_.remainingTimeDisplay() - this.skipTime();
    } else {
      time = this.player_.remainingTimeDisplay();
      skipTime = this.player_.remainingTime() - this.skipTime();
    }

    let label;

    if (skipTime > 60*3) {
      label = '';
    } else if(skipTime > 0) {
      if(this.player_.language() == 'zh-cn'){
        label = '' + this.localize('AD') + '（' + time + this.localize('Sec') + '）| 可在（' + skipTime + this.localize('Sec') + '）后' + this.localize('Skip');
      }else{
        label = '' + this.localize('AD') + '（' + time + this.localize('Sec') + '）| （' + skipTime + this.localize('Sec') + '）Can ' + this.localize('Skip');
      }
    } else {
      label = '' + this.localize('AD') + '（' + time + this.localize('Sec') + '）| ' + this.localize('Skip');
    }

    // this.updateTextNode_(time);
    // this.updateTextNodeNew_(time);
    this.updateTextNodeNew_(label);
  }

  // replace updateTextNode_
  updateTextNodeNew_(time = 0) {
    // time = formatTime(time);

    if (this.formattedTime_ === time) {
      return;
    }

    this.formattedTime_ = time;

    this.requestAnimationFrame(() => {
      if (!this.contentEl_) {
        return;
      }

      const oldNode = this.textNode_;

      this.textNode_ = document.createTextNode(this.formattedTime_);

      if (!this.textNode_) {
        return;
      }

      if (oldNode) {
        this.contentEl_.replaceChild(this.textNode_, oldNode);
      } else {
        this.contentEl_.appendChild(this.textNode_);
      }
    });
  }

  // 5s can skip
  handleMouseDown(event) {
    if (this.player_.ads && this.player_.remainingTimeDisplay() <= this.skipTime()) {
      this.player_.trigger('adended');
    }
    if (this.player_.ads) {
      return;
    }
  }
}

/**
 * The text that is added to the `RemainingTimeDisplay` for screen reader users.
 *
 * @type {string}
 * @private
 */
SkipADDisplay.prototype.labelText_ = 'Skip Time';

/**
 * The text that should display over the `RemainingTimeDisplay`s controls. Added to for localization.
 *
 * @type {string}
 * @private
 *
 * @deprecated in v7; controlText_ is not used in non-active display Components
 */
SkipADDisplay.prototype.controlText_ = 'Skip Time';

Component.registerComponent('SkipADDisplay', SkipADDisplay);
export default SkipADDisplay;
