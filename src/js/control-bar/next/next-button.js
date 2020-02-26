/**
 * @file next-button.js
 */
import Button from '../../button.js';
import Component from '../../component.js';
// import log from '../utils/log.js';

/**
 * Button to trigger next video.
 *
 * @extends Button
 */
class NextButton extends Button {

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
    super(player, options);

    // show or hide next icon
    options.next = options.next === undefined || options.next;

    // this.on(player, 'play', this.handlePlay);
    // this.on(player, 'pause', this.handlePause);
    this.on('mouseover', this.handleMouseOver);
    this.on('mouseout', this.handleMouseOut);

    // if (options.replay) {
    //   this.on(player, 'ended', this.handleEnded);
    // }
  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object.
   */
  buildCSSClass() {
    return `vjs-next-control ${super.buildCSSClass()}`;
  }

  /**
   * This gets called when an `PlayToggle` is "clicked". See
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
    // if (this.player_.paused()) {
    //   this.player_.play();
    // } else {
    //   this.player_.pause();
    // }
  }

  /**
   * This gets called when a `VolumePanel` gains hover via a `mouseover` event.
   * Turns on listening for `mouseover` event. When they happen it
   * calls `this.handleMouseOver`.
   *
   * @param {EventTarget~Event} event
   *        The `mouseover` event that caused this function to be called.
   *
   * @listens mouseover
   */
  handleMouseOver(event) {
    // this.addClass('vjs-hover');
    // Events.on(document, 'keyup', Fn.bind(this, this.handleKeyPress));
    // this.player().log('[nextButton] mouse over');
  }

  /**
   * This gets called when a `VolumePanel` gains hover via a `mouseout` event.
   * Turns on listening for `mouseout` event. When they happen it
   * calls `this.handleMouseOut`.
   *
   * @param {EventTarget~Event} event
   *        The `mouseout` event that caused this function to be called.
   *
   * @listens mouseout
   */
  handleMouseOut(event) {
    // this.removeClass('vjs-hover');
    // Events.off(document, 'keyup', Fn.bind(this, this.handleKeyPress));
    // this.player().log('[nextButton] mouse out');
  }

  /**
   * Handles `keyup` event on the document or `keydown` event on the `VolumePanel`,
   * looking for ESC, which hides the `VolumeControl`.
   *
   * @param {EventTarget~Event} event
   *        The keypress that triggered this event.
   *
   * @listens keydown | keyup
   */
  handleKeyPress(event) {
    // if (keycode.isEventKey(event, 'Esc')) {
    //   this.handleMouseOut();
    // }
  }

  /**
   * Add the vjs-playing class to the element so it can change appearance.
   *
   * @param {EventTarget~Event} [event]
   *        The event that caused this function to run.
   *
   * @listens Player#play
   */
  handlePlay(event) {
    this.removeClass('vjs-ended');
    this.removeClass('vjs-paused');
    this.addClass('vjs-playing');
    // change the button text to "Pause"
    this.controlText('Next');
  }

  /**
   * Add the vjs-paused class to the element so it can change appearance.
   *
   * @param {EventTarget~Event} [event]
   *        The event that caused this function to run.
   *
   * @listens Player#pause
   */
  handlePause(event) {
    this.removeClass('vjs-playing');
    this.addClass('vjs-paused');
    // change the button text to "Play"
    this.controlText('Next');
  }

  /**
   * Add the vjs-ended class to the element so it can change appearance
   *
   * @param {EventTarget~Event} [event]
   *        The event that caused this function to run.
   *
   * @listens Player#ended
   */
  handleEnded(event) {
    this.removeClass('vjs-playing');
    this.addClass('vjs-ended');
    // change the button text to "Replay"
    this.controlText('Next');

    // on the next seek remove the replay button
    // this.one(this.player_, 'seeked', this.handleSeeked);
  }
}

/**
 * The text that should display over the `PlayToggle`s controls. Added for localization.
 *
 * @type {string}
 * @private
 */
NextButton.prototype.controlText_ = 'Next';

Component.registerComponent('NextButton', NextButton);
export default NextButton;
