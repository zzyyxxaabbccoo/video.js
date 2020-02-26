/**
 * @file adLabel.js
 */
import document from 'global/document';
import Component from '../component.js';
import * as Dom from '../utils/dom.js';

/**
 * Displays time information about the video
 *
 * @extends Component
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

    this.adLink = 'http://www.cctv.com';

    this.on('click', this.handleClick);
    // this.on(player, ['timeupdate', 'ended'], this.updateContent);
  }

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    const className = this.buildCSSClass();
    const el = super.createEl('div', {
      className: `${className}vjs-adLabel`
    //   innerHTML: `<span class="vjs-adLabel-text" role="presentation">${this.localize(this.labelText_)}\uff1a</span>`
    });

    this.contentEl_ = Dom.createEl('span', {
      className: 'vjs-adLabel-text'
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

  dispose() {
    this.contentEl_ = null;
    this.textNode_ = null;

    super.dispose();
  }

  /**
   *
   *
   *
   */
  updateTextNode(strLabel, adLink) {
    this.requestAnimationFrame(() => {
      if (!this.contentEl_) {
        return;
      }

      if (adLink !== undefined) {
        this.adLink = adLink;
      }

      const oldNode = this.textNode_;

      let arr = strLabel.split('/');

      // this.player_.log(''+arr[0]);

      //解析strLabel （1/4）:    第1个广告，共4个 &middot www.515fun.com

      // this.textNode_ = document.createTextNode('' + this.localize(this.labelText_) + '' + strLabel); //原

      this.player_.log('==' + this.player_.language());

      if(this.player_.language() === 'zh-cn'){
        this.textNode_ = document.createTextNode('第 ' + arr[0] + ' 个广告，共 ' + arr[1] + ' 个');
      } else {
        this.textNode_ = document.createTextNode('ad: ' + arr[0] + ' of ' + arr[1] + '');
      }
      // \uff1a

      if (!this.textNode_) {
        return;
      }

      if (oldNode) {
        this.contentEl_.replaceChild(this.textNode_, oldNode);
      } else {
        this.contentEl_.appendChild(this.textNode_);
      }
    });
  }

  handleClick() {
    // if (window !== undefined) {
    //   window.open(this.adLink, '_blank');
    // }
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
 * The text that is added to the `TimeDisplay` for screen reader users.
 *
 * @type {string}
 * @private
 */
AdLabel.prototype.labelText_ = 'AD';

/**
 * The text that should display over the `TimeDisplay`s controls. Added to for localization.
 *
 * @type {string}
 * @private
 *
 * @deprecated in v7; controlText_ is not used in non-active display Components
 */
AdLabel.prototype.controlText_ = 'AD Label';

Component.registerComponent('AdLabel', AdLabel);
export default AdLabel;
