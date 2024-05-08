/**
 * @file skip-ad-display.js
 */
import document from 'global/document';
import TimeDisplay from '../control-bar/time-controls/time-display';
import Component from '../component.js';
import {formatTime} from '../utils/time';
// import window from 'global/window';
// import * as Dom from '../../js/utils/dom.js';

/**
 * Displays the time left in the video
 *
 * @extends Component
 */
class UserContinueTip extends TimeDisplay {

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
    // this.on(player, 'durationchange', this.updateContent);
    this.off(player, ['timeupdate', 'ended'], this.updateContent);

    this.showActivity_ = true;
    this.played_ = false;

    this.addClass('ad-vip-skip-hint-hide');
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

  showOnce(continueTime) {
    this.player().log('showOnce:' + continueTime);
    if (continueTime && (!isNaN(parseFloat(continueTime)) && isFinite(continueTime))) {
      this.fromUserContinuePosition = continueTime;
      this.updateTextNodeNew_();
      this.removeClass('ad-vip-skip-hint-hide');
      this.hide();
      this.firstplay();
    //   this.on(player, 'play', this.firstplay);
    }
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
      this.player().log('first play');

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

    // this.player().log('updateTextNodeNew_');

    this.label_ = this.localize('Playing from ');
    this.label_ += formatTime(this.fromUserContinuePosition, 600);
    // this.label_ += formatTime(12543,600);
    this.label_ += this.localize(' where you left off');

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
UserContinueTip.prototype.labelText_ = '';

/**
 * The text that should display over the `RemainingTimeDisplay`s controls. Added to for localization.
 *
 * @type {string}
 * @private
 *
 * @deprecated in v7; controlText_ is not used in non-active display Components
 */
UserContinueTip.prototype.controlText_ = '';

Component.registerComponent('UserContinueTip', UserContinueTip);
export default UserContinueTip;
