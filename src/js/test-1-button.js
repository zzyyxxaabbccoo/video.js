/**
 * @file test-1-button.js
 */
import Button from './button.js';
import Component from './component.js';
import {isPromise, silencePromise} from './utils/promise';

/**
 * The initial play button that shows before the video has played. The hiding of the
 * `Test1Button` get done via CSS and `Player` states.
 *
 * @extends Button
 */
class Test1Button extends Button {
  constructor(player, options) {
    super(player, options);

    this.mouseused_ = false;

    this.on('mousedown', this.handleMouseDown);
  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object. Always returns 'vjs-big-play-button'.
   */
  buildCSSClass() {
    return 'vjs-test-1-button';
  }

  /**
   * This gets called when a `Test1Button` "clicked". See {@link ClickableComponent}
   * for more detailed information on what a click can be.
   *
   * @param {EventTarget~Event} event
   *        The `keydown`, `tap`, or `click` event that caused this function to be
   *        called.
   *
   * @listens tap
   * @listens click
   */
  handleClick(event) {
    const playPromise = this.player_.play();

    // exit early if clicked via the mouse
    if (this.mouseused_ && event.clientX && event.clientY) {
      silencePromise(playPromise);
      if (this.player_.tech(true)) {
        this.player_.tech(true).focus();
      }
      return;
    }

    const cb = this.player_.getChild('controlBar');
    const playToggle = cb && cb.getChild('playToggle');

    if (!playToggle) {
      this.player_.tech(true).focus();
      return;
    }

    const playFocus = () => playToggle.focus();

    if (isPromise(playPromise)) {
      playPromise.then(playFocus, () => {});
    } else {
      this.setTimeout(playFocus, 1);
    }
  }

  handleKeyDown(event) {
    this.mouseused_ = false;

    super.handleKeyDown(event);
  }

  handleMouseDown(event) {
    this.mouseused_ = true;
  }
}

/**
 * The text that should display over the `Test1Button`s controls. Added to for localization.
 *
 * @type {string}
 * @private
 */
Test1Button.prototype.controlText_ = 'Test 1 Button Play Video';

Component.registerComponent('Test1Button', Test1Button);
export default Test1Button;
