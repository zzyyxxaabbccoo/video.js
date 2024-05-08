/**
 * @file refresh-button.js
 */
import Button from './button';
import Component from './component';
// import keycode from 'keycode';

/**
 * The `RefreshButton` is a `{@link Button}` that fires a `close` event when
 * it gets clicked.
 *
 * @extends Button
 */
class RefreshButton extends Button {
  /**
  * Creates an instance of the this class.
  *
  * @param  {Player} player
  *         The `Player` that this class should be attached to.
  *
  * @param  {Object} [options]
  *         The key/value store of player options.
  */
  constructor(player, options) {
    super(player, options);
    this.controlText(options && options.controlText || this.localize('Refresh Page'));
  }

  /**
  * Builds the default DOM `className`.
  *
  * @return {string}
  *         The DOM `className` for this object.
  */
  buildCSSClass() {
    return `vjs-refresh-button ${super.buildCSSClass()}`;
  }

  /**
   * This gets called when a `RefreshButton` gets clicked. See
   * {@link ClickableComponent#handleClick} for more information on when
   * this will be triggered
   *
   * @param {EventTarget~Event} event
   *        The `keydown`, `tap`, or `click` event that caused this function to be
   *        called.
   *
   * @listens tap
   * @listens click
   * @fires CloseButton#close
   */
  handleClick(event) {

    /**
     * Triggered when the a `RefreshButton` is clicked.
     *
     * @event CloseButton#close
     * @type {EventTarget~Event}
     *
     * @property {boolean} [bubbles=false]
     *           set to false so that the close event does not
     *           bubble up to parents if there is no listener
     */
    this.trigger({type: 'refresh', bubbles: false});

  }

  /**
   * Event handler that is called when a `CloseButton` receives a
   * `keydown` event.
   *
   * By default, if the key is Esc, it will trigger a `click` event.
   *
   * @param {EventTarget~Event} event
   *        The `keydown` event that caused this function to be called.
   *
   * @listens keydown
   */
//   handleKeyDown(event) {
//     // Esc button will trigger `click` event
//     if (keycode.isEventKey(event, 'Esc')) {
//       event.preventDefault();
//       event.stopPropagation();
//       this.trigger('click');
//     } else {
//       // Pass keypress handling up for unsupported keys
//       super.handleKeyDown(event);
//     }
//   }
}

Component.registerComponent('RefreshButton', RefreshButton);
export default RefreshButton;
