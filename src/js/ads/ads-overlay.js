/**
 * @file ads-overlay.js
 */
import document from 'global/document';
import window from 'global/window';
import Component from '../component.js';
import * as Dom from '../utils/dom.js';
import SkipADDisplay from './skip-ad-display.js';
import ADCountdownDisplay from './ad-countdown-display.js';
import jsonpImg from '../utils/jsonpImg';

// import XHR from '@videojs/xhr';
// import { isCrossOrigin } from '../utils/url.js';

import './ads-mute-toggle.js';
import './ads-fullscreen-toggle.js';

/**
 * Displays time information about the video
 *
 * @extends Component
 */
class AdsOverLay extends Component {

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

    this.adLink = 'https://www.cctv.com';

    this.monitor = [];

    this.impression = [];

    this.on('click', this.handleClick);
    // this.on(player, ['timeupdate', 'ended'], this.updateContent);

    if (this.player().options().newADType !== true) {
      const skipADDisplay = new SkipADDisplay(player, options);

      this.addChild(skipADDisplay);
    } else {
      const adCountdownDisplay = new ADCountdownDisplay(player, options);

      this.addChild(adCountdownDisplay);
      this.adCountdownDisplay = adCountdownDisplay;
    }

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
      className: `${className}ads-overlay`
    //   innerHTML: `<span class="ads-overlay-text" role="presentation">${this.localize(this.labelText_)}\uff1a</span>`
    });

    // this.textNode_ = 'ads';

    this.contentTextEl_ = Dom.createEl('span', {
      className: 'ads-label-text',
      innerHTML: ''
    }, {
      // tell screen readers not to automatically read the time as it changes
      'aria-live': 'off',
      // span elements have no implicit role, but some screen readers (notably VoiceOver)
      // treat them as a break between items in the DOM when using arrow keys
      // (or left-to-right swipes on iOS) to read contents of a page. Using
      // role='presentation' causes VoiceOver to NOT treat this span as a break.
      'role': 'presentation'
    });

    el.appendChild(this.contentTextEl_);

    Dom.blockContextMenu(el);

    const player_ = this.player();

    el.oncontextmenu = function(event) {
      // player_.log(event.target);
      if (event.target !== null) {
        if (!Dom.hasClass(event.target, 'ads-overlay')) {
          return false;
        }
      }
      if (event.ctrlKey === true && event.altKey) {
        player_.showContextMenu(event, true);
      } else {
        player_.showContextMenu(event, false);
      }
      return false;
    };

    return el;
  }

  dispose() {
    this.contentTextEl_ = null;
    this.contentEl_ = null;
    this.textNode_ = null;

    super.dispose();
  }

  /**
   *
   */
  updateTextNode(strLabel, adLink, remainDuraion, monitor, impression) {
    if (this.player().options().newADType === true) {
      this.adCountdownDisplay.updateRemainAdTime(remainDuraion);
    }

    this.requestAnimationFrame(() => {
      if (!this.contentTextEl_) {
        return;
      }

      if (adLink !== undefined) {
        this.adLink = adLink;
      }

      // if (monitor !== undefined) {
      this.monitor = monitor;
      // }

      // if (impression !== undefined) {
      this.impression = impression;
      // }

      // 曝光
      if (this.impression && this.impression.length > 0) {
        for (let i = 0; i < this.impression.length; i++) {
          this.player().log('pread impression:' + this.impression[i]);
          const opts = {
            param: 'impressionCb',
            timeout: 6000,
            prefix: '__jpImg'
          };

          jsonpImg(this.impression[i], opts);
        }
      }

      // VIP版 广告时不再显示
      if (this.player().options().newADType === true) {
        return;
      }

      const oldNode = this.textNode_;

      // this.player_.log('oldTextNode_:' + oldNode);

      const arr = strLabel.split('/');

      // 解析strLabel （1/4）:    第1个广告，共4个 &middot www.515fun.com
      // this.textNode_ = document.createTextNode('' + this.localize(this.labelText_) + '' + strLabel); //原
      // this.player_.log('==' + this.player_.language());

      if (this.player_.language() === 'zh-cn') {
        this.textNode_ = document.createTextNode('第 ' + arr[0] + ' 个广告 • 共 ' + arr[1] + ' 个');
      } else {
        this.textNode_ = document.createTextNode('AD: ' + arr[0] + ' of ' + arr[1] + '');
      }
      // \uff1a

      if (!this.textNode_) {
        return;
      }

      if (oldNode) {
        this.contentTextEl_.replaceChild(this.textNode_, oldNode);
      } else {
        this.contentTextEl_.appendChild(this.textNode_);
      }
    });
  }

  // 打开广告链接
  handleClick() {
    if (window !== undefined) {
      window.open(this.adLink, '_blank');
      //
      // this.player().log('pread' + this.monitor[0]);

      if (this.monitor && this.monitor.length > 0) {
        for (let i = 0; i < this.monitor.length; i++) {
          this.player().log('pread monitor:' + this.monitor[i]);
          const opts = {
            param: 'monitorCb',
            timeout: 6000,
            prefix: '__jpImg'
          };

          jsonpImg(this.monitor[i], opts);
        }
      }

    }
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
AdsOverLay.prototype.labelText_ = 'AD';

/**
 * The text that should display over the `TimeDisplay`s controls. Added to for localization.
 *
 * @type {string}
 * @private
 *
 * @deprecated in v7; controlText_ is not used in non-active display Components
 */
AdsOverLay.prototype.controlText_ = 'AD Label';

AdsOverLay.prototype.options_ = {
  children: [
    'adsMuteToggle',
    'adsFullscreenToggle'
  ]
};

Component.registerComponent('adsOverLay', AdsOverLay);
export default AdsOverLay;
