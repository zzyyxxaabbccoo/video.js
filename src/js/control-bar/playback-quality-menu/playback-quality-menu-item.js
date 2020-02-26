/**
 * @file playback-quality-menu-item.js
 */
import MenuItem from '../../menu/menu-item.js';
import Component from '../../component.js';

/**
 * The specific menu item type for selecting a playback quality.
 *
 * @extends MenuItem
 */
class PlaybackQualityMenuItem extends MenuItem {

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
    const label = options.quality;
    // const quality = parseFloat(label, 10);
    const quality = options.quality;

    // Modify options for parent MenuItem class's init.
    options.label = label;
    options.selected = quality === 1;
    options.selectable = true;
    options.multiSelectable = false;

    super(player, options);

    this.label = label;
    this.quality = quality;

    // this.on(player, 'ratechange', this.update);
    this.on(player, 'qualitychange', this.update);
    const qualityLevels = this.player_.qualityLevels();

    this.on(qualityLevels, 'change', this.update);
  }

  /**
   * This gets called when an `PlaybackQualityMenuItem` is "clicked". See
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
    super.handleClick();
    // this.player().playbackQuality(this.quality);
    this.player().switchQuality(this.label, this.quality);
    // videojs.log('click item');
  }

  /**
   * Update the PlaybackQualityMenuItem when the playbackquality changes.
   *
   * @param {EventTarget~Event} [event]
   *        The `qualitychange` event that caused this function to run.
   *
   * @listens Player#qualitychange
   */
  update(event) {
    this.selected(this.player().getCurentQuality() === this.quality);
    // videojs.log('[playbackqualitymenuitem] this.quality:'+this.quality);
  }

  playbackQualities() {
    return this.options_.playbackQualities || (this.options_.playerOptions && this.options_.playerOptions.playbackQualities);
  }

  playbackQualityIndexs() {
    return this.options_.playbackQualityIndex || (this.options_.playerOptions && this.options_.playerOptions.playbackQualityIndex);
  }

}

/**
 * The text that should display over the `PlaybackQualityMenuItem`s controls. Added for localization.
 *
 * @type {string}
 * @private
 */
PlaybackQualityMenuItem.prototype.contentElType = 'Playback Quality';

Component.registerComponent('PlaybackQualityMenuItem', PlaybackQualityMenuItem);
export default PlaybackQualityMenuItem;
