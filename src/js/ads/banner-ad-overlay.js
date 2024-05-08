/**
 * @file pause-ads-overlay.js
 */
// import document from 'global/document';
import window from 'global/window';
import Component from '../component.js';
// import * as Dom from '../utils/dom.js';
import './banner-ad-content.js';
import './banner-ad-close-button';
// import './ads-mute-toggle.js';
// import './ads-fullscreen-toggle.js';
import XHR from '@videojs/xhr';
import { isCrossOrigin } from '../utils/url.js';
import * as Fn from '../utils/fn.js';
// import './pause-ad-content.js';

/**
 * Displays time information about the video
 *
 * @extends Component
 */
class BannerAdOverLay extends Component {

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

    // this.adLink = 'https://www.cctv.com';
    // this.on('click', this.handleClick);

    this.player_.mainContentDuration_ = undefined;
    this.timer = undefined;

    this.bannerAd1Showed = false;
    this.bannerAd2Showed = false;

    this.hide();
    // this.on(player, ['timeupdate', 'ended'], this.updateContent);

    // this.isPlaying_ = false;

    // this.on(player, 'play', this.hideAd);

    this.on(player, 'timeupdate', this.timeUpdata);

    // this.on(player, 'ended', this.onEnded);

    // this.on(player, 'playerresize', this.playerResize);

    const adContent = this.getChild('bannerAdContent');
    const closeButton = adContent.getChild('BannerAdCloseButton');

    this.on(closeButton, 'click', this.hideAd);

    // 建立图像对象
    // this.image_ = new Image();
    // this.image_.onload = this.imgLoaded;
    // if (player.options().pauseAdImageUrl !== undefined && player.options().pauseAdImageUrl !== '') {
    //   this.image_.src = player.options().pauseAdImageUrl;
    //   // player.log('[pause ad] set src');
    // }
    // this.aspectRatio_ = 16 / 9;
  }

  imgLoaded() {
    // const ratio_ = this.width / this.height;
    // console.log('[pause ad overlay] imgloaded ratio_:' + ratio_);
  }

  playerResize() {
    // this.player_.log('[pauseadoverlay]playerResize');

    // 2020.8.3 移除resize后对暂停广告的隐藏判断
    // if (this.adWidth !== undefined && this.adHeight !== undefined) {
    //   if (this.adWidth > this.player_.currentWidth() * 0.8 || this.adHeight > this.player_.currentHeight() * 0.8) {
    //     this.hide();
    //     // this.player_.log('pause ad too big to show');
    //   }
    // }
  }

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    const className = this.buildCSSClass();
    // const imageUrl = 'https://p4.img.cctvpic.com/apple3g/www/upload/image/20200403/1585905693250062668.jpg'; // 'https://p1.img.cctvpic.com/fmspic/pd/660900930dad.jpg'; //https://p4.img.cctvpic.com/apple3g/www/upload/image/20200403/1585905693250062668.jpg
    const el = super.createEl('div', {
      className: `${className}banner-ad-overlay`
      // innerHTML: `<a href="javascript:void(0);" > <img class="" role="presentation" src="${imageUrl}" ></img> </a>`
    });

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

  showAd(bannerData) {

    // this.player_.log('show banner Ad');

    // responseBody;
    // [{
    // "url":"https://p1.img.cctvpic.com/fmspic/pd/54070ceshi1202.jpg",
    // "clickUrl":"https://galaxy.bjcathay.com/c?z=cathay&la=0&si=1&cg=86&c=1285&ci=2&or=382&l=4712&bg=4712&b=8379&u=http://www.cntv.cn/",
    // "eventExposure":"",
    // "eventExposure1":""
    // }]

    // [
    //   {
    //   url: "",
    //   clickUrl: "",
    //   eventExposure: "",
    //   eventExposure1: "",
    //   sdks: [
    //   {
    //   type: "minli",
    //   adid: "a2d57cd9-2e21-46ef-b7af-508c10ee4c6c",
    //   pr: "100"
    //   },
    //   {
    //   type: "none",
    //   adid: "",
    //   pr: ""
    //   },
    //   {
    //   type: "none",
    //   adid: "",
    //   pr: ""
    //   },
    //   {
    //   type: "none",
    //   adid: "",
    //   pr: ""
    //   },
    //   {
    //   type: "none",
    //   adid: "",
    //   pr: ""
    //   }
    //   ]
    //   }
    // ]

    const parseData = JSON.parse(bannerData);

    let bannerAdData;

    const this_ = this;

    if (Object.prototype.toString.call(parseData) === '[object Array]') {
      if (parseData && parseData[0] && !parseData[0].url && parseData[0].sdks) {
        // this.player().log('minli ad');
        if (typeof window.getAdDataFromOutside === 'function') {
          window.getAdDataFromOutside('banner', parseData[0].sdks, function(adType, dataStr) {
            // this_.player().log('got banner minli ' + adType + ' ad data');
            // this_.player().log(dataStr);
            if (dataStr) {
              this_.showAd(dataStr);
            }
          }, null, function(adType, errorMsg) {
            this_.player().log(errorMsg);
          }, null);
        } else {
          this.player().log('there is no getAdDataFromOutside function!');
        }
        return;
      }
      // 非敏力广告
      bannerAdData = parseData[0];
    } else {
      // minli ad
      bannerAdData = parseData;
    }

    const adContent = this.getChild('BannerAdContent');

    // this.player().log(bannerAdData);

    if (bannerAdData) {
      adContent.setAdData(bannerAdData);
      this.show();
      adContent.showAd();
      if (this.timer) {
        clearTimeout(this.timer);
      }
      // 10s
      this.timer = setTimeout(this.timeHide, 10 * 1000, this);
    }
  }

  timeHide(_this) {
    _this.hide();
  }

  hideAd(e) {
    clearTimeout(this.timer);
    // this.player_.log('play');
    // this.isPlaying_ = true;
    this.hide();
    const adContent = this.getChild('BannerAdContent');

    adContent.hideAd();
    // this.player_.log(e);
    e.stopPropagation();
  }

  timeUpdata() {
    // window.console.log(this.player_.currentTime());
    // 大于5分钟，进入3分钟
    if (!this.bannerAd2Showed && this.player_.mainContentDuration_ > 60 * 5 && this.player_.currentTime() >= 60 * 3) {
      this.bannerAd2Showed = true;
      this.getAdData();
      // window.console.log('show ad 3m');
    } else if (!this.bannerAd1Showed && this.player_.mainContentDuration_ > 60 * 5 && this.player_.currentTime() >= 60 * 1 && this.player_.currentTime() < 60 * 3) {
      // 大于5分钟，进入1分钟
      this.bannerAd1Showed = true;
      this.getAdData();
      // window.console.log('show ad 1m');
    } else if (!this.bannerAd1Showed && this.player_.mainContentDuration_ >= 60 * 1 && this.player_.mainContentDuration_ <= 60 * 5 && this.player_.currentTime() >= 60 * 1) {
      // 大于1分钟，进入1分钟
      this.bannerAd1Showed = true;
      this.getAdData();
      // window.console.log('show ad 1m 2');
    }
  }

  getAdData() {
    // window.console.log('[BannerAdOverLay] load banner ad');
    const _this = this;

    if ((!this.player_.ads || !this.player_.ads.isInAdMode()) && this.player_.options().bannerAd && this.player_.options().bannerAdUrl) {

      // const _overlay = this;

      const opts = {
        uri: this.player_.options().bannerAdUrl
      };
      const crossOrigin = isCrossOrigin(this.player_.options().bannerAdUrl);

      if (crossOrigin) {
        opts.cors = crossOrigin;
      }

      XHR(opts, Fn.bind_(this, function(err, response, responseBody) {
        if (err) {
          // return this.player_.warn.error(err, response);
          return false;
        }
        // window.console.log('loaded this:' + this + ' response:' + response + ' responseBody:' + responseBody);
        // window.console.log(responseBody);
        if (responseBody) {
        //   if (_this.isPlaying_ === false) {
          _this.showAd(responseBody);
        //   }
        }
      }));
    } else {
      // this.player_.log('[BannerAdOverLay] no banner ad');
    }
  }

  // 打开广告链接
  handleClick() {
    if (window !== undefined) {
      window.open(this.adLink, '_blank');
      // 需要增加统计

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
// BannerAdOverLay.prototype.labelText_ = 'AD';

/**
 * The text that should display over the `TimeDisplay`s controls. Added to for localization.
 *
 * @type {string}
 * @private
 *
 * @deprecated in v7; controlText_ is not used in non-active display Components
 */
// BannerAdOverLay.prototype.controlText_ = 'AD Label';

BannerAdOverLay.prototype.options_ = {
  children: [
    'bannerAdContent'
    // 'pauseAdCloseButton'
    // 'adsFullscreenToggle'
  ]
};

Component.registerComponent('bannerAdOverLay', BannerAdOverLay);
export default BannerAdOverLay;
