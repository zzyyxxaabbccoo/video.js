/**
 * @file time-display.js
 */
// import document from 'global/document';
import Component from '../../component.js';
import * as Dom from '../../utils/dom.js';

/**
  * Displays time information about the video
  *
  * @extends Component
  */
class PlaybackQualityMenuPermit extends Component {

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
  }

  /**
    * Create the `Component`'s DOM element
    *
    * @return {Element}
    *         The element that was created.
    */
  createEl() {
    const className = 'vjs-quality-menu-permit';
    const el = super.createEl('span', {
      className: `${className}`
      // innerHTML: `${this.localize('登录看')}`
    });

    const _permitLabel = this.player().options().permitionLabels ? this.player().options().permitionLabels[this.options_.permit] : 'LOG IN';

    if (this.player().options().debug) {
      this.player().log('_permitLabel:' + _permitLabel);
    }

    this.contentEl_ = Dom.createEl('span', {
      className: `${className}-display`,
      innerHTML: `${this.localize(_permitLabel)}`
    }, {
      // tell screen readers not to automatically read the time as it changes
      'aria-live': 'off',
      // span elements have no implicit role, but some screen readers (notably VoiceOver)
      // treat them as a break between items in the DOM when using arrow keys
      // (or left-to-right swipes on iOS) to read contents of a page. Using
      // role='presentation' causes VoiceOver to NOT treat this span as a break.
      'role': 'presentation'
    });

    el.appendChild(this.contentEl_);
    return el;
  }

  visible(canVisible) {
    if (!canVisible) {
      this.addClass('opacity-0');
    } else {
      this.removeClass('opacity-0');
    }
  }

  dispose() {
    this.contentEl_ = null;
    this.textNode_ = null;

    super.dispose();
  }

  /**
    * To be filled out in the child class, should update the displayed time
    * in accordance with the fact that the current time has changed.
    *
    * @param {EventTarget~Event} [event]
    *        The `timeupdate`  event that caused this to run.
    *
    * @listens Player#timeupdate
    */
  updateContent(event) {}
}

/**
  * The text that is added to the `PlaybackQualityMenuPermit` for screen reader users.
  *
  * @type {string}
  * @private
  */
PlaybackQualityMenuPermit.prototype.labelText_ = 'Time';

/**
  * The text that should display over the `PlaybackQualityMenuPermit`s controls. Added to for localization.
  *
  * @type {string}
  * @private
  *
  * @deprecated in v7; controlText_ is not used in non-active display Components
  */
PlaybackQualityMenuPermit.prototype.controlText_ = 'PlaybackQualityMenuPermit';

Component.registerComponent('PlaybackQualityMenuPermit', PlaybackQualityMenuPermit);
export default PlaybackQualityMenuPermit;
