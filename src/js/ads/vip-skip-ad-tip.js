/**
 * @file skip-ad-display.js
 */
import document from 'global/document';
import TimeDisplay from '../control-bar/time-controls/time-display';
import Component from '../component.js';
// import window from 'global/window';
// import * as Dom from '../../js/utils/dom.js';

/**
 * Displays the time left in the video
 *
 * @extends Component
 */
class VipSkipAdTip extends TimeDisplay {

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
    this.off(player, ['timeupdate', 'ended'], this.updateContent);

    this.showActivity_ = true;
    this.played_ = false;

    if (this.player().options().skipAdTip === true) {
      this.hide();
      this.on(player, 'play', this.firstplay);
    } else {
      this.addClass('ad-vip-skip-hint-hide');
    }

    // .ad-vip-skip-hint-hide

  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object.
   */
  buildCSSClass() {
    return 'ad-vip-skip-hint';
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
    this.updateTextNodeNew_();
  }

  firstplay(event) {
    if (!this.played_) {
      this.played_ = true;
      // this.player().log('first play');

      this.show();

      let showTimeout;

      // 显示3s
      this.setInterval(function() {
        if (!this.showActivity_) {
          return;
        }
        this.showActivity_ = false;
        this.clearTimeout(showTimeout);
        const timeout = 3000;

        showTimeout = this.setTimeout(function() {
          this.addClass('ad-vip-skip-hint-close');
        }, timeout);
      }, 250);
    } else {
      return;
    }
  }

  // replace updateTextNode_
  updateTextNodeNew_() {
    // time = formatTime(time);

    this.label_ = this.localize('ADs have been skipped');

    if (!this.contentEl_) {
      return;
    }

    const oldNode = this.textNode_;

    this.textNode_ = document.createTextNode(this.label_);

    if (!this.textNode_) {
      return;
    }

    if (oldNode) {
      this.contentEl_.replaceChild(this.textNode_, oldNode);
    } else {
      this.contentEl_.appendChild(this.textNode_);
    }

  }

}

/**
 * The text that is added to the `RemainingTimeDisplay` for screen reader users.
 *
 * @type {string}
 * @private
 */
VipSkipAdTip.prototype.labelText_ = '';

/**
 * The text that should display over the `RemainingTimeDisplay`s controls. Added to for localization.
 *
 * @type {string}
 * @private
 *
 * @deprecated in v7; controlText_ is not used in non-active display Components
 */
VipSkipAdTip.prototype.controlText_ = '';

Component.registerComponent('VipSkipAdTip', VipSkipAdTip);
export default VipSkipAdTip;
