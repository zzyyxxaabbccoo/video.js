/**
 * @file pause-ad-content.js
 */
// import document from 'global/document';
import window from 'global/window';
import Component from '../component.js';
// import Xhr from '@videojs/xhr';
// import http from 'http';
// import * as Dom from '../utils/dom.js';
// import SkipADDisplay from './skip-ad-display.js';
// import './ads-mute-toggle.js';
// import './ads-fullscreen-toggle.js';
// import './pause-ad-close-button';
import jsonpImg from '../utils/jsonpImg';

/**
 * Displays time information about the video
 *
 * @extends Component
 */
class BannerAdContent extends Component {

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
    // options.name = 'BannerAdContent';
    super(player, options);

    // if (player.options().pauseAdClickUrl !== undefined) {
    //   this.adLink = player.options().pauseAdClickUrl;
    // }

    // const imgEl = this.el().getElementsByTagName('img')[0];
    // imgEl.on('click', this.handleClick);
    this.on('click', this.handleClick);

    // this.name_ = 'BannerAdContent';

    // this.hide();
    // this.on(player, ['timeupdate', 'ended'], this.updateContent);

    // const closeBtn = this.getChild('pauseAdCloseButton');
    // this.on(closeBtn, 'click', this.hideAd);
  }

  setAdData(bannerAdData) {
    // responseBody;
    // [{
    // "url":"https://p1.img.cctvpic.com/fmspic/pd/54070ceshi1202.jpg",
    // "clickUrl":"https://galaxy.bjcathay.com/c?z=cathay&la=0&si=1&cg=86&c=1285&ci=2&or=382&l=4712&bg=4712&b=8379&u=http://www.cntv.cn/",
    // "eventExposure":"",
    // "eventExposure1":""
    // }]

    // this.player_.log('setAdData()');

    this.adLink = bannerAdData.clickUrl;
    // this.adLink = 'http://www.baidu.com';
    this.eventExposure = bannerAdData.eventExposure;
    this.eventExposure1 = bannerAdData.eventExposure1;
    this.imgUrl = bannerAdData.url;
    // this.imgWidth = bannerAdData.width;
    // this.imgHeight = bannerAdData.height;

    this.monitor = bannerAdData.monitor;
    this.impression = bannerAdData.impression;

    // this.el().getElementsByTagName('img').url = this.imgUrl;

    // this.player_.log(bannerAdData);

    // this.el().innerHTML = `<img class="pause-ad-img" role="presentation" src="${this.imgUrl}" style="width:'${this.imgWidth}px'; height:'${this.imgHeight}px'" onload=''></img>`;

    // this.player_.log(this.imgUrl);

    const imgEl = this.el().getElementsByTagName('img')[0];

    imgEl.src = this.imgUrl;

    imgEl.style.width = 540 + 'px';
    imgEl.style.height = 70 + 'px';

    this.el().style.width = 540 + 'px';
    this.el().style.height = 70 + 'px';

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
      className: `${className}banner-ad-content`,
      // innerHTML: `<a href="javascript:void(0);" > <img class="pause-ad-img" role="presentation" src="${imageUrl}" ></img> </a>`
      innerHTML: '<img class="banner-ad-img" role="presentation" src="" ></img>'
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
    if (window !== undefined && this.adLink !== undefined) {
      window.open(this.adLink, '_blank');

      // this.eventExposure = bannerAdData.eventExposure;
      // this.eventExposure1 = bannerAdData.eventExposure1;

      if (this.monitor && this.monitor.length > 0) {
        for (let i = 0; i < this.monitor.length; i++) {
          this.player().log('pause ad monitor:' + this.monitor[i]);
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
// BannerAdContent.prototype.labelText_ = 'AD';

/**
 * The text that should display over the `TimeDisplay`s controls. Added to for localization.
 *
 * @type {string}
 * @private
 *
 * @deprecated in v7; controlText_ is not used in non-active display Components
 */
// PauseAdsContent.prototype.controlText_ = 'AD Label';

BannerAdContent.prototype.options_ = {
  children: [
    // 'adsMuteToggle',
    // 'adsFullscreenToggle'
    'BannerAdCloseButton'
  ]
};

Component.registerComponent('BannerAdContent', BannerAdContent);
export default BannerAdContent;
