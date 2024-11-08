/**
 * @file pause-ad-close-button.js
 */
import Button from '../button';
import Component from '../component';
// import * as Dom from '../utils/dom.js';
// import checkMuteSupport from '../control-bar/volume-control/check-mute-support';
// import * as browser from '../utils/browser.js';
import {createEl} from '../utils/dom.js';

/**
 * A button component for muting the audio.
 *
 * @extends Button
 */
class PauseAdCloseButton extends Button {

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

    this.on(player, 'playerresize', this.playerResize);
  }

  createEl(tag, props = {}, attributes = {}) {
    const el = super.createEl(tag, props, attributes);

    el.appendChild(createEl('span', {
      className: 'ad-label',
      textContent: this.localize('close Ad')
    }));
    return el;
  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object.
   */
  buildCSSClass() {
    return `pause-ad-close ${super.buildCSSClass()}`;
  }

  /**
   * This gets called when an `MuteToggle` is "clicked". See
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
  }

  playerResize() {
  }
}

Component.registerComponent('PauseAdCloseButton', PauseAdCloseButton);
export default PauseAdCloseButton;
