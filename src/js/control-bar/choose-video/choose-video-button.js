/**
 * @file playback-quality-menu-button.js
 */
import MenuButton from '../../menu/menu-button.js';
import Menu from '../../menu/menu.js';
// import PlaybackQualityMenuItem from '../playback-quality-menu/playback-quality-menu-item.js';
import Component from '../../component.js';
import * as Dom from '../../utils/dom.js';
// import Player from '../../../js/player.js';

/**
 * The component for controlling the playback quality.
 *
 * @extends MenuButton
 */
class ChooseVideoButton extends MenuButton {
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

    // this.updateVisibility();
    this.updateLabel();

    this.on(player, 'choosevideochange', this.updateLabel);
  }

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    const el = super.createEl();

    this.labelEl_ = Dom.createEl('div', {
      className: 'choose-video-value',
      innerHTML: 'videos'
      // 高清
    });

    el.appendChild(this.labelEl_);

    return el;
  }

  dispose() {
    this.labelEl_ = null;
    super.dispose();
  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object.
   */
  buildCSSClass() {
    return `choose-video ${super.buildCSSClass()}`;
  }

  buildWrapperCSSClass() {
    return `choose-video ${super.buildWrapperCSSClass()}`;
  }

  /**
   * Create the playback quality menu
   *
   * @return {Menu}
   *         Menu object populated with {@link PlaybackQualityMenuItem}s
   */
  createMenu() {
    // this.player_.log('quality create menu');
    const menu = new Menu(this.player());
    // const qualities = this.playbackQualities();
    // const qualities = ['HD-'];

    // if (qualities) {
    //   for (let i = qualities.length - 1; i >= 0; i--) {
    //     menu.addChild(new PlaybackQualityMenuItem(this.player(), {quality: '' + qualities[i]}));
    //     // this.player_.log('quality create menu:' + qualities[i]);
    //   }
    // }
    return menu;
  }

  updateMenu() {

  }

  /**
   * Updates ARIA accessibility attributes
   */
  updateARIAAttributes() {
    // Current playback quality,#?
    // this.el().setAttribute('aria-valuenow', this.player().playbackQuality());
  }

  /**
   * This gets called when an `PlaybackQualityMenuButton` is "clicked". See
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
    // select next quality option
    // const currentQuality = this.player().playbackQuality();
    // const qualities = this.playbackQualities();

    // // this will select first one if the last one currently selected
    // let newQuality = qualities[0];

    // for (let i = 0; i < qualities.length; i++) {
    //   if (qualities[i] > currentQuality) {
    //     newQuality = qualities[i];
    //     break;
    //   }
    // }
    // this.player().playbackQuality(newQuality);

    // this.player().openChooseVideo();

    const panel = this.player().getChild('chooseVideoPanel');

    if (panel !== undefined) {
      panel.hideToggle();
      panel.updatePage();

      this.updateButtonState();
      // this.player().log(panel.pageNum());
    }

    // this.player().log('handleClick');
  }

  updateButtonState() {
    const panel = this.player().getChild('chooseVideoPanel');

    if (panel !== undefined) {
      if (!panel.hasClass('vjs-hidden')) {
        this.addClass('vjs-selected');
      } else {
        this.removeClass('vjs-selected');
      }
    }
  }

  handleMouseEnter() {
    // this.player().log('mouseenter');
    // this.player().log('click11');
    // this.player().trigger('analyticALI.play.1.14');
    // this.player().log('handleMouseEnter');
  }

  /**
   * Hide playback quality controls when they're no playback qualty options to select
   *
   * @param {EventTarget~Event} [event]
   *        The event that caused this function to run.
   *
   * @listens Player#loadstart
   */
  updateVisibility(event) {
    // if (this.playbackQualitySupported()) {
    //   this.removeClass('vjs-hidden');
    // } else {
    //   this.addClass('vjs-hidden');
    // }
  }

  /**
   * Update button label when quality changed
   *
   * @param {EventTarget~Event} [event]
   *        The event that caused this function to run.
   *
   */
  updateLabel(event) {
    // this.player_.log('updateLabel()');
    // this.labelEl_choose-video-value

    this.labelEl_.innerHTML = '' + this.localize('videos');
  }
}

/**
 * The text that should display over the `PlaybackQualityMenuButton`s controls. Added for localization.
 *
 * @type {string}
 * @private
 */
ChooseVideoButton.prototype.controlText_ = 'videos';

Component.registerComponent('ChooseVideoButton', ChooseVideoButton);
export default ChooseVideoButton;
