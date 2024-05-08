/**
 * @file skip-ad-display.js
 */
import document from 'global/document';
import TimeDisplay from '../control-bar/time-controls/time-display';
import Component from '../component.js';
// import * as Dom from '../../js/utils/dom.js';

/**
 * Displays the time left in the video
 *
 * @extends Component
 */
class ADDiscountDisplay extends TimeDisplay {

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
  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object.
   */
  buildCSSClass() {
    return 'ad-discount1';
  }

  /**
   * Create the `Component`'s DOM element with the "minus" characted prepend to the time
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    const el = super.createEl();

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
    // 首月限时特惠
    const label = '' + this.localize('preferential');

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

}

/**
 * The text that is added to the `RemainingTimeDisplay` for screen reader users.
 *
 * @type {string}
 * @private
 */
ADDiscountDisplay.prototype.labelText_ = 'ADDiscount';

/**
 * The text that should display over the `RemainingTimeDisplay`s controls. Added to for localization.
 *
 * @type {string}
 * @private
 *
 * @deprecated in v7; controlText_ is not used in non-active display Components
 */
ADDiscountDisplay.prototype.controlText_ = 'ADDiscount';

Component.registerComponent('ADDiscountDisplay', ADDiscountDisplay);
export default ADDiscountDisplay;
