/**
 * @file audio-track-button.js
 */
import TrackButton from '../track-button.js';
import Component from '../../component.js';
import AudioModeMenuItem from './audio-mode-menu-item.js';
import * as Dom from '../../utils/dom.js';
// import { each } from '../../utils/obj.js';

/**
 * The base class for buttons that toggle specific {@link AudioTrack} types.
 *
 * @extends TrackButton
 */
class AudioModeButton extends TrackButton {

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
    // options.tracks = player.audioTracks();

    super(player, options);

    // this.onplayerchangeAudioMode
    this.on(player, 'changeAudioMode', this.onChange);

    this.show();
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
      className: 'vjs-audio-button-value',
      innerHTML: `${this.localize('original')}`
    });

    el.appendChild(this.labelEl_);

    return el;
  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object.
   */
  buildCSSClass() {
    return `vjs-audio-button ${super.buildCSSClass()}`;
  }

  buildWrapperCSSClass() {
    return `vjs-audio-button ${super.buildWrapperCSSClass()}`;
  }

  /**
   * Create a menu item for each audio track
   *
   * @param {AudioTrackMenuItem[]} [items=[]]
   *        An array of existing menu items to use.
   *
   * @return {AudioTrackMenuItem[]}
   *         An array of menu items
   */
  createItems(items = []) {
    // if there's only one audio track, there no point in showing it
    // this.hideThreshold_ = 1;

    // const tracks = this.player_.audioTracks();

    // for (let i = 0; i < tracks.length; i++) {
    //   const track = tracks[i];

    //   items.push(new AudioTrackMenuItem(this.player_, {
    //     track,
    //     // MenuItem is selectable
    //     selectable: true,
    //     // MenuItem is NOT multiSelectable (i.e. only one can be marked "selected" at a time)
    //     multiSelectable: false
    //   }));
    // }

    items.push(new AudioModeMenuItem(this.player_, {
      audioModeIndex: 0,
      audioLabel: 'original',
      selectable: true,
      multiSelectable: false
    }));
    items.push(new AudioModeMenuItem(this.player_, {
      audioModeIndex: 1,
      audioLabel: 'earphone',
      selectable: true,
      multiSelectable: false
    }));
    items.push(new AudioModeMenuItem(this.player_, {
      audioModeIndex: 2,
      audioLabel: 'soundbox',
      selectable: true,
      multiSelectable: false
    }));

    items[0].selected(true);

    return items;
  }

  onChange(event) {
    // this.player().log(event);
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].selected(false);
    }
    this.items[event.audioMode].selected(true);
    this.labelEl_.innerHTML = '' + this.localize(this.items[event.audioMode].options_.audioLabel);
  }

}

/**
 * The text that should display over the `AudioModeButton`s controls. Added for localization.
 *
 * @type {string}
 * @private
 */
AudioModeButton.prototype.controlText_ = 'audio mode';
Component.registerComponent('AudioModeButton', AudioModeButton);
export default AudioModeButton;
