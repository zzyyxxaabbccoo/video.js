/**
 * @file pause-ad-content.js
 */
// import document from 'global/document';
import window from 'global/window';
import Component from '../component.js';
// import XHR from '@videojs/xhr';
// import { isCrossOrigin } from '../utils/url.js';
import jsonpImg from '../utils/jsonpImg';
// import http from 'http';
// import * as Dom from '../utils/dom.js';
// import SkipADDisplay from './skip-ad-display.js';
// import './ads-mute-toggle.js';
// import './ads-fullscreen-toggle.js';
// import './pause-ad-close-button';

/**
 * Displays time information about the video
 *
 * @extends Component
 */
class PauseAdContent extends Component {

  /**
   * Creates an instance of this class.
   *
   * @param {Player} player
   *        The `Player` that this class should be attached to.
   *
   * @param {Object} [options]
   *        The key/value store of player options.
   */
  constructor(player, options, pauseData) {
    // options.name = 'PauseAdContent';
    super(player, options);

    // if (player.options().pauseAdClickUrl !== undefined) {
    //   this.adLink = player.options().pauseAdClickUrl;
    // }

    // const imgEl = this.el().getElementsByTagName('img')[0];
    // imgEl.on('click', this.handleClick);
    this.on('click', this.handleClick);

    // this.name_ = 'PauseAdContent';

    // this.hide();
    // this.on(player, ['timeupdate', 'ended'], this.updateContent);

    // const closeBtn = this.getChild('pauseAdCloseButton');
    // this.on(closeBtn, 'click', this.hideAd);
  }

  setAdData(pauseAdData) {
    // [{
    //   "url":"https://p1.img.cctvpic.com/fmspic/pd/300250ysxw20160101.jpg",
    //   "clickUrl":"https://galaxy.bjcathay.com/c?z=cathay&la=0&si=1&cg=86&c=1283&ci=2&or=382&l=4714&bg=4714&b=8381&u=https://c.gridsumdissector.com/r/?gid=gad_199_kv6rgec3",
    //   "width":"300",
    //   "height":"250",
    //   "eventExposure":"https://i.gridsumdissector.com/v/?gscmd=impress&gid=gad_199_kv6rgec3",
    //   "eventExposure1":""
    // }]
    this.adLink = pauseAdData.clickUrl;
    this.eventExposure = pauseAdData.eventExposure;
    this.eventExposure1 = pauseAdData.eventExposure1;
    this.imgUrl = pauseAdData.url;
    this.imgWidth = pauseAdData.width;
    this.imgHeight = pauseAdData.height;

    // this.el().getElementsByTagName('img').url = this.imgUrl;
    this.monitor = pauseAdData.monitor;
    this.impression = pauseAdData.impression;

    // this.player_.log(pauseAdData);

    // this.el().innerHTML = `<img class="pause-ad-img" role="presentation" src="${this.imgUrl}" style="width:'${this.imgWidth}px'; height:'${this.imgHeight}px'" onload=''></img>`;

    const imgEl = this.el().getElementsByTagName('img')[0];

    imgEl.src = this.imgUrl;

    imgEl.style.width = this.imgWidth + 'px';
    imgEl.style.height = this.imgHeight + 'px';

    this.el().style.width = this.imgWidth + 'px';
    this.el().style.height = this.imgHeight + 'px';

    // 曝光
    if (this.impression && this.impression.length > 0) {
      for (let i = 0; i < this.impression.length; i++) {
        // this.player().log('pread impression:' + this.impression[i]);
        const opts = {
          param: 'impressionCb',
          timeout: 6000,
          prefix: '__jpImg'
        };

        jsonpImg(this.impression[i], opts);
      }
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
    // const imageUrl = this.player_.options().pauseAdImageUrl;
    const el = super.createEl('div', {
      className: `${className}pause-ad-content`,
      // innerHTML: `<a href="javascript:void(0);" > <img class="pause-ad-img" role="presentation" src="${imageUrl}" ></img> </a>`
      innerHTML: '<img class="pause-ad-img" role="presentation" src="" onload=\'\'></img>'
    });

    // console.log('111')

    // this.textNode_ = 'ads';
    // Dom.blockContextMenu(el);
    // this.player_.log('this: ------------createEl'+ this.el_ );
    // this.player_.log('ads-createEl');

    return el;
  }

  dispose() {
    this.contentTextEl_ = null;
    this.contentEl_ = null;
    this.textNode_ = null;

    super.dispose();
  }

  showAd() {
    this.show();
  }

  hideAd() {
    this.hide();
    const imgEl = this.el().getElementsByTagName('img')[0];

    if (imgEl) {
      imgEl.src = '';
    }
  }

  // 打开广告链接
  handleClick(e) {
    // this.player_.log(e);
    // this.player_.log('handleClick11');
    if (window !== undefined && this.adLink !== undefined) {
      window.open(this.adLink, '_blank');

      // this.eventExposure = pauseAdData.eventExposure;
      // this.eventExposure1 = pauseAdData.eventExposure1;

      if (this.monitor && this.monitor.length > 0) {
        for (let i = 0; i < this.monitor.length; i++) {
          // this.player().log('pause ad monitor:' + this.monitor[i]);
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
// PauseAdContent.prototype.labelText_ = 'AD';

/**
 * The text that should display over the `TimeDisplay`s controls. Added to for localization.
 *
 * @type {string}
 * @private
 *
 * @deprecated in v7; controlText_ is not used in non-active display Components
 */
// PauseAdsContent.prototype.controlText_ = 'AD Label';

PauseAdContent.prototype.options_ = {
  children: [
    // 'adsMuteToggle',
    // 'adsFullscreenToggle'
    'PauseAdCloseButton'
  ]
};

Component.registerComponent('pauseAdContent', PauseAdContent);
export default PauseAdContent;
