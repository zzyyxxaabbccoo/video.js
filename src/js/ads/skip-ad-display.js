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
    this.on('click', this.handleClick);
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
    return 'ad-skip-time';
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

    let _skipTime;

    // @deprecated We should only use remainingTimeDisplay
    // as of video.js 7
    if (this.player_.ended()) {
      time = 0;
    } else if (this.player_.remainingTimeDisplay) {
      time = this.player_.remainingTimeDisplay();
      _skipTime = this.player_.remainingTimeDisplay() - this.skipTime();
    } else {
      time = this.player_.remainingTimeDisplay();
      _skipTime = this.player_.remainingTime() - this.skipTime();
    }

    let label;

    if (_skipTime > 60 * 3) {
      label = '';
    } else if (_skipTime > 0) {
      if (this.hasClass('ad-skip-btn')) {
        this.removeClass('ad-skip-btn');
      }
      if (this.player_.language() === 'zh-cn') {
        // label = '' + this.localize('AD') + '' + time + this.localize('Sec') + '| 可在' + skipTime + this.localize('Sec') + '后' + this.localize('Skip');
        label = '' + time + this.localize('Sec') + ' | 可在' + _skipTime + this.localize('Sec') + '后' + this.localize('Skip');
      } else {
        // label = '' + this.localize('AD') + '' + time + this.localize('Sec') + '| ' + this.localize('Skip') + '' + skipTime + this.localize('Sec') + '';
        label = '' + time + this.localize('Sec') + ' | ' + this.localize('Skip') + ' in ' + _skipTime + this.localize(' Sec') + '';
      }
    } else {
      if (!this.hasClass('ad-skip-btn')) {
        this.addClass('ad-skip-btn');
      }
      // label = '' + this.localize('AD') + '' + time + this.localize('Sec') + '| ' + this.localize('SkipAD') + '';
      label = '' + time + this.localize('Sec') + ' | ' + this.localize('Skip This AD') + '';
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
    if (Dom.isSingleLeftClick(event)) {
      if (this.player_.ads && this.player_.remainingTimeDisplay() <= this.skipTime()) {
        // adended  ended 会导致循环时后置广告状态不触发循环
        // 改为0.02，0.01edge有问题
        // this.player_.trigger('ended');
        // this.player_.trigger('adended');
        this.player_.currentTime(this.player_.duration() - 0.1);
      }
    }
    // if (this.player_.ads) {
    event.stopPropagation();
    // return;
    // }
  }

  //
  handleClick(event) {
    // if(Dom.isSingleLeftClick(event)){
    //   if (this.player_.ads && this.player_.remainingTimeDisplay() <= this.skipTime()) {
    //     this.player_.trigger('adended');
    //   }
    // }
    // this.player().trigger('nextvideo');
    event.stopPropagation();
    // event
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
