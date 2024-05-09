/**
 * @file big-play-button.js
 */
import Button from './button.js';
import Component from './component.js';
import {isPromise, silencePromise} from './utils/promise';
import * as Dom from './utils/dom.js';

/**
 * The initial play button that shows before the video has played. The hiding of the
 * `BigPlayButton` get done via CSS and `Player` states.
 *
 * @extends Button
 */
class BigPlayButton extends Button {
  constructor(player, options) {
    super(player, options);

    this.mouseused_ = false;

    this.setIcon('play');
    const delayShowBigButton = true;

    if (delayShowBigButton) {
      this.hide();
      this.one(player, 'canplay', this.beforeShow);
      this.one(player, 'canplaythrough', this.show);
    }

    // block context menu on touch devices
    Dom.blockContextMenu(this.el());

    this.on('mousedown', (e) => this.handleMouseDown(e));
  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object. Always returns 'vjs-big-play-button'.
   */
  buildCSSClass() {
    return 'vjs-big-play-button';
  }

  /**
   * 显示
   */
  show() {
    if (this.player().options().debug) {
      this.player().log('show-bigplaybutton');
    }
    // if (videojs.browser.IS_SAFARI) {
    //    this.player().log('super-bigplaybutton');
    // }
    super.show();
  }

  /**
   * 延迟0.1秒后显示
   */
  beforeShow() {
    // this.player().log('beforeShow');
    this.setTimeout(function() {
      this.show();
    }, 100);
  }

  /**
   * This gets called when a `BigPlayButton` "clicked". See {@link ClickableComponent}
   * for more detailed information on what a click can be.
   *
   * @param {KeyboardEvent|MouseEvent|TouchEvent} event
   *        The `keydown`, `tap`, or `click` event that caused this function to be
   *        called.
   *
   * @listens tap
   * @listens click
   */
  handleClick(event) {
    const playPromise = this.player_.play();

    // exit early if clicked via the mouse
    if (this.mouseused_ && 'clientX' in event && 'clientY' in event) {
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

  /**
   * Event handler that is called when a `BigPlayButton` receives a
   * `keydown` event.
   *
   * @param {KeyboardEvent} event
   *        The `keydown` event that caused this function to be called.
   *
   * @listens keydown
   */
  handleKeyDown(event) {
    this.mouseused_ = false;

    super.handleKeyDown(event);
  }

  /**
   * Handle `mousedown` events on the `BigPlayButton`.
   *
   * @param {MouseEvent} event
   *        `mousedown` or `touchstart` event that triggered this function
   *
   * @listens mousedown
   */
  handleMouseDown(event) {
    this.mouseused_ = true;
  }
}

/**
 * The text that should display over the `BigPlayButton`s controls. Added to for localization.
 *
 * @type {string}
 * @protected
 */
BigPlayButton.prototype.controlText_ = 'Play Video';

Component.registerComponent('BigPlayButton', BigPlayButton);
export default BigPlayButton;
