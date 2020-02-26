/**
 * @file webfullscreen-toggle.js
 */
import Button from '../button.js';
import Component from '../component.js';
import document from 'global/document';

/**
 * Toggle webfullscreen video
 *
 * @extends Button
 */
class WebfullscreenToggle extends Button {
  
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
    this.on(player, 'webfullscreenchange', this.handleWebfullscreenChange);

    if (document[player.fsApi_.webfullscreenEnabled] === false) {
      this.disable();
    }
  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object.
   */
  buildCSSClass() {
    return `vjs-webfullscreen-control ${super.buildCSSClass()}`;
  }

  /**
   * Handles webfullscreenchange on the player and change control text accordingly.
   *
   * @param {EventTarget~Event} [event]
   *        The {@link Player#webfullscreenchange} event that caused this function to be
   *        called.
   *
   * @listens Player#webfullscreenchange
   */
  handleWebfullscreenChange(event) {
    if (this.player_.isWebfullscreen()) {
      this.controlText('Non-Webfullscreen');
    } else {
      this.controlText('Webfullscreen');
    }
  }

  /**
   * This gets called when an `WebfullscreenToggle` is "clicked". See
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
    if (!this.player_.isWebfullscreen()) {
      this.player_.requestWebfullscreen();
    } else {
      this.player_.exitWebfullscreen();
    }
  }

}

/**
 * The text that should display over the `WebfullscreenToggle`s controls. Added for localization.
 *
 * @type {string}
 * @private
 */
WebfullscreenToggle.prototype.controlText_ = 'Webfullscreen';

Component.registerComponent('WebfullscreenToggle', WebfullscreenToggle);
export default WebfullscreenToggle;
