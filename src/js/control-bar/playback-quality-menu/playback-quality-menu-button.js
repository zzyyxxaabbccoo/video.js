/**
 * @file playback-quality-menu-button.js
 */
import MenuButton from '../../menu/menu-button.js';
import Menu from '../../menu/menu.js';
import PlaybackQualityMenuItem from './playback-quality-menu-item.js';
import Component from '../../component.js';
import * as Dom from '../../utils/dom.js';

/**
 * The component for controlling the playback quality.
 *
 * @extends MenuButton
 */
class PlaybackQualityMenuButton extends MenuButton {

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

    this.updateVisibility();
    this.updateLabel();

    this.on(player, 'loadstart', this.updateVisibility);
    // this.on(player, 'ratechange', this.updateLabel);
    this.on(player, 'loadedmetadata', this.updateMenu);
    this.on(player, 'qualitychange', this.updateLabel);

    const qualityLevels = this.player_.qualityLevels();

    this.on(qualityLevels, 'change', this.updateLabel);
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
      className: 'vjs-playback-quality-value',
      innerHTML: 'HD'
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
    return `vjs-playback-quality ${super.buildCSSClass()}`;
  }

  buildWrapperCSSClass() {
    return `vjs-playback-quality ${super.buildWrapperCSSClass()}`;
  }

  /**
   * Create the playback quality menu
   *
   * @return {Menu}
   *         Menu object populated with {@link PlaybackQualityMenuItem}s
   */
  createMenu() {
    const menu = new Menu(this.player());
    // const qualities = this.playbackQualities();
    const qualities = ['HD-'];

    if (qualities) {
      for (let i = qualities.length - 1; i >= 0; i--) {
        menu.addChild(new PlaybackQualityMenuItem(this.player(), {quality: '' + qualities[i]}));
      }
    }
    return menu;
  }

  updateMenu() {
    // console.log('[playeback-quality-menu-button] updateMenu');

    const qualityLevelsLength = this.player_.qualityLevels().length;
    // clear all

    this.player_.clearPlaybackQualityLevel();

    for (let i = 0; i < qualityLevelsLength; i++) {
      this.player_.addPlaybackQualityLevel(this.player_.qualityLevels()[i], i);
    }
    const qualities = this.playbackQualities();
    const _menu = this.menu;
    let menuItem;

    while (_menu.children_.length > 0) {
      menuItem = _menu.children_[0];
      _menu.removeChild(menuItem);
    }

    if (qualities) {
      for (let i = qualities.length - 1; i >= 0; i--) {
        _menu.addChild(new PlaybackQualityMenuItem(this.player(), {quality: '' + qualities[i]}));
      }
    }

    // default quality
    // videojs.log('default quality logic');
    const indexs = this.playbackQualityIndexs();
    let currentIndexInlevels;
    let currentQualitySymb = 'HD';

    if (qualities.indexOf(currentQualitySymb) >= 0) {
      // videojs.log('has ' + currentQualitySymb + ',index in levels:' + indexs[qualities.indexOf(currentQualitySymb)]);
      currentIndexInlevels = indexs[qualities.indexOf(currentQualitySymb)];
    } else {
      currentIndexInlevels = 0;
      currentQualitySymb = qualities[currentIndexInlevels];
    }
    for (let i = 0; i < qualityLevelsLength; i++) {
      if (currentIndexInlevels === i) {
        this.player_.qualityLevels()[i].enabled = true;
      } else {
        this.player_.qualityLevels()[i].enabled = false;
      }
    }
  }

  /**
   * Updates ARIA accessibility attributes
   */
  updateARIAAttributes() {
    // Current playback quality,#?
    this.el().setAttribute('aria-valuenow', this.player().playbackQuality());
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
    const currentQuality = this.player().playbackQuality();
    const qualities = this.playbackQualities();

    // this will select first one if the last one currently selected
    let newQuality = qualities[0];

    for (let i = 0; i < qualities.length; i++) {
      if (qualities[i] > currentQuality) {
        newQuality = qualities[i];
        break;
      }
    }
    this.player().playbackQuality(newQuality);
    // videojs.log('click');
  }

  /**
   * Get possible playback qualities
   *
   * @return {Array}
   *         All possible playback qualities
   */
  playbackQualities() {
    return this.options_.playbackQualities || (this.options_.playerOptions && this.options_.playerOptions.playbackQualities);
  }

  playbackQualityIndexs() {
    return this.options_.playbackQualityIndex || (this.options_.playerOptions && this.options_.playerOptions.playbackQualityIndex);
  }

  /**
   * Get whether playback quality is supported by the tech
   * and an array of playback quality exists
   *
   * @return {boolean}
   *         Whether changing playback quality is supported
   */
  playbackQualitySupported() {
    return this.player().tech_ &&
      this.player().tech_.featuresPlaybackQuality &&
      this.playbackQualities() &&
      this.playbackQualities().length > 0
    ;
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
    if (this.playbackQualitySupported()) {
      this.removeClass('vjs-hidden');
    } else {
      this.addClass('vjs-hidden');
    }
  }

  /**
   * Update button label when quality changed
   *
   * @param {EventTarget~Event} [event]
   *        The event that caused this function to run.
   *
   * @listens Player#qualitychange
   */
  updateLabel(event) {
    // videojs.log('' + this.player_.getCurentQuality());
    // videojs.log('' + this.localize(this.player_.getCurentQuality()));
    this.labelEl_.innerHTML = '' + this.localize(this.player_.getCurentQuality());
  }
}

/**
 * The text that should display over the `PlaybackQualityMenuButton`s controls. Added for localization.
 *
 * @type {string}
 * @private
 */
PlaybackQualityMenuButton.prototype.controlText_ = 'Playback Quality';

Component.registerComponent('PlaybackQualityMenuButton', PlaybackQualityMenuButton);
export default PlaybackQualityMenuButton;
