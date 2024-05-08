/**
 * @file ads-fullscreen-toggle.js
 */
import Button from '../button.js';
import Component from '../component.js';
// import document from 'global/document';
import * as Dom from '../utils/dom.js';

/**
 * vip跳过广告提示
 *
 * @extends Button
 */
class AdsSkipAdHintButton extends Button {

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
    // this.on(player, 'fullscreenchange', this.handleFullscreenChange);

    // const oldNode = this.textNode_;

    // this.on(player, ['loadstart', 'volumechange'], this.update);

    // this.textNode_ = document.createTextNode('vip会员跳过广告');

    // if (!this.textNode_) {
    //     return;
    // }

    // if (oldNode) {
    //     this.contentEl_.replaceChild(this.textNode_, oldNode);
    // } else {
    // this.contentEl_.appendChild(this.textNode_);
    // }

  }

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    const className = this.buildCSSClass();
    const el = super.createEl('div', {
      className: `${className}`
      //   innerHTML: `<span class="ads-overlay-text" role="presentation">${this.localize(this.labelText_)}\uff1a</span>`
    });

    // this.textNode_ = 'ads';

    this.contentTextEl_ = Dom.createEl('span', {
      className: 'ads-label-text',
      innerHTML: 'ad skip hint'
    }, {
      // tell screen readers not to automatically read the time as it changes
      'aria-live': 'off',
      // span elements have no implicit role, but some screen readers (notably VoiceOver)
      // treat them as a break between items in the DOM when using arrow keys
      // (or left-to-right swipes on iOS) to read contents of a page. Using
      // role='presentation' causes VoiceOver to NOT treat this span as a break.
      'role': 'presentation'
    });

    el.appendChild(this.contentTextEl_);

    Dom.blockContextMenu(el);

    const player_ = this.player();

    el.oncontextmenu = function(event) {
      // player_.log(event.target);
      if (event.target !== null) {
        if (!Dom.hasClass(event.target, 'ads-overlay')) {
          return false;
        }
      }
      if (event.ctrlKey === true && event.altKey) {
        player_.showContextMenu(event, true);
      } else {
        player_.showContextMenu(event, false);
      }
      return false;
    };

    // this.player_.log('this: ------------createEl'+ this.el_ );
    // this.player_.log('ads-createEl');
    return el;
  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object.
   */
  buildCSSClass() {
    return 'ad-skip-time-hint';
  }

  /**
   * Handles fullscreenchange on the player and change control text accordingly.
   *
   * @param {EventTarget~Event} [event]
   *        The {@link Player#fullscreenchange} event that caused this function to be
   *        called.
   *
   * @listens Player#fullscreenchange
   */
  //   handleFullscreenChange(event) {
  //     if (this.player_.isFullscreen()) {
  //       this.controlText('Non-Fullscreen');
  //     } else {
  //       this.controlText('Fullscreen');
  //     }
  //   }

  /**
   * This gets called when an `FullscreenToggle` is "clicked". See
   * {@link ClickableComponent} for more detailed information on what a click can be.
   *
   * @param {EventTarget~Event} [event]
   *        The `keydown`, `tap`, or `click` event that caused this function to be
   *        called.
   *
   * @listens tap
   * @listens click
   */
  handleClick(event) {
    if (!this.player_.isFullscreen()) {
      this.player_.requestFullscreen();
    } else {
      this.player_.exitFullscreen();
    }
    event.stopPropagation();
  }

}

/**
 * The text that should display over the `AdsSkipAdHintButton`s controls. Added for localization.
 *
 * @type {string}
 * @private
 */
AdsSkipAdHintButton.prototype.controlText_ = '';

Component.registerComponent('AdsSkipAdHintButton', AdsSkipAdHintButton);
export default AdsSkipAdHintButton;
