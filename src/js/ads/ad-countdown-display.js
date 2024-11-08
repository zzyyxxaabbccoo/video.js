/**
 * @file skip-ad-display.js
 */
import document from 'global/document';
import TimeDisplay from '../control-bar/time-controls/time-display';
import Component from '../component.js';
import * as Dom from '../../js/utils/dom.js';

/**
 * Displays the time left in the video
 *
 * @extends Component
 */
class ADCountdownDisplay extends TimeDisplay {

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
    this.on('click', this.handleClick);

    this.remainAdTime_ = '';
  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object.
   */
  buildCSSClass() {
    return 'ad-countdown-time';
  }

  /**
   * Create the `Component`'s DOM element with the "minus" characted prepend to the time
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    const el = super.createEl();

    if (this.player().options().paymentRequiresTips) {
      el.appendChild(Dom.createEl('span', {className: 'ad-vip-can-skip', innerHTML: ' | ' + this.localize('Activate Video Card to skip ADs')}), this.contentEl_);
    } else {
      el.appendChild(Dom.createEl('span', {className: 'ad-vip-can-skip', innerHTML: ' | ' + this.localize('AD')}), this.contentEl_);
    }

    // el.appendChild(Dom.createEl('span', {className: 'ad-discount1',innerHTML: ' ' + this.localize('preferential')}), this.contentEl_);
    // el.appendChild(Dom.createEl('span', {className: 'ad-discount1',innerHTML: ' '}), this.contentEl_);

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
    // this.player().log('[ADCountdownDisplay] updateContent' + this.player_.duration());

    // 解决广告切换时 时长不准的问题
    if (this.player_.duration() <= 0) {
      return;
    }

    if (typeof this.player_.duration() !== 'number') {
      return;
    }

    let time;

    // @deprecated We should only use remainingTimeDisplay
    // as of video.js 7
    if (this.player_.ended()) {
      time = 0;
    } else if (this.player_.remainingTimeDisplay) {
      time = this.player_.remainingTimeDisplay();
    } else {
      time = this.player_.remainingTimeDisplay();
    }

    // #解决会闪现当前视频时间的问题,单片广告不能超过60秒
    if (time > 60 || this.remainAdTime_ === '') {
      this.updateTextNodeNew_(' ');
    } else {
      const adTime = '' + (time + this.remainAdTime_);

      this.updateTextNodeNew_(adTime);
    }
  }

  updateRemainAdTime(time) {
    // this.player().log('[ADCountdownDisplay] updateRemainAdTime' + time);
    this.remainAdTime_ = time;
  }

  // replace updateTextNode_
  updateTextNodeNew_(time = 0) {
    // this.player().log('[ADCountdownDisplay] updateTextNodeNew_' + time);
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

  //

  // 打开广告链接
  handleClick(event) {
    // this.player().log('vipstatus');
    this.player().trigger('vipstatus');
    event.stopPropagation();
  }

}

/**
 * The text that is added to the `RemainingTimeDisplay` for screen reader users.
 *
 * @type {string}
 * @private
 */
ADCountdownDisplay.prototype.labelText_ = 'ADCountdown Time';

/**
 * The text that should display over the `RemainingTimeDisplay`s controls. Added to for localization.
 *
 * @type {string}
 * @private
 *
 * @deprecated in v7; controlText_ is not used in non-active display Components
 */
ADCountdownDisplay.prototype.controlText_ = 'ADCountdown Time';

Component.registerComponent('ADCountdownDisplay', ADCountdownDisplay);
export default ADCountdownDisplay;
