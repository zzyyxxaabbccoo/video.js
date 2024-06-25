/**
 * @file pause-ad-close-button.js
 */
import Component from '../component';
// import { textContent } from '../utils/dom';
// import * as Dom from '../utils/dom.js';
// import checkMuteSupport from '../control-bar/volume-control/check-mute-support';
// import * as browser from '../utils/browser.js';

/**
 *
 */
class AdLabel extends Component {

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

    // hide this control if volume support is missing

    // this.on(player, 'playerresize', this.playerResize);
  }

  createEl() {
    const className = this.buildCSSClass();
    // const imageUrl = 'https://p4.img.cctvpic.com/apple3g/www/upload/image/20200403/1585905693250062668.jpg'; // 'https://p1.img.cctvpic.com/fmspic/pd/660900930dad.jpg'; //https://p4.img.cctvpic.com/apple3g/www/upload/image/20200403/1585905693250062668.jpg
    const el = super.createEl('div', {
      className: `${className}ad-label`,
      textContent: this.localize('Ad')
    });

    return el;
  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object.
   */
  buildCSSClass() {
    return `${super.buildCSSClass()}`;
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
    // const vol = this.player_.volume();
    // const lastVolume = this.player_.lastVolume_();

    // if (vol === 0) {
    //   const volumeToSet = lastVolume < 0.1 ? 0.1 : lastVolume;

    //   this.player_.volume(volumeToSet);
    //   this.player_.muted(false);
    // } else {
    //   this.player_.muted(this.player_.muted() ? false : true);
    // }

    // event.stopPropagation();
  }
}

Component.registerComponent('AdLabel', AdLabel);
export default AdLabel;
