/**
 * @file pause-ads-overlay.js
 */
// import document from 'global/document';
import window from 'global/window';
import Component from '../component.js';
import './pause-ad-content.js';
import './pause-ad-close-button';
import XHR from '@videojs/xhr';
import { isCrossOrigin } from '../utils/url.js';
import * as Fn from '../utils/fn.js';
import * as Dom from '../../js/utils/dom.js';

/**
 * Displays time information about the video
 *
 * @extends Component
 */
class PauseAdOverLay extends Component {

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

    this.hide();
    // this.on(player, ['timeupdate', 'ended'], this.updateContent);

    this.isPlaying_ = false;

    this.on(player, 'pause', this.onPause);
    this.on(player, 'play', this.hideAd);
    this.on(player, 'ended', this.onEnded);

    // this.on(player, 'ended', this.onEnded);

    // this.on(player, 'playerresize', this.playerResize);

    const adContent = this.getChild('pauseAdContent');
    const closeButton = adContent.getChild('PauseAdCloseButton');

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
      className: `${className}pause-ad-overlay`
      // innerHTML: `<a href="javascript:void(0);" > <img class="" role="presentation" src="${imageUrl}" ></img> </a>`
    });

    const pl_ = this.player_;

    el.oncontextmenu = function(event) {
      if (event.target !== null) {
        if (!Dom.hasClass(event.target, 'pause-ad-overlay') && !Dom.hasClass(event.target, 'pause-ad-content') && !Dom.hasClass(event.target, 'pause-ad-img')) {
          // pl_.log(event.target);
          return false;
        }
      }
      if (event.ctrlKey === true && event.altKey) {
        pl_.showContextMenu(event, true);
      } else {
        pl_.showContextMenu(event, false);
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

  showAd(pauseData) {
    // responseBody;
    // [{
    //   "url":"",
    //   "clickUrl":"",
    //   "width":"",
    //   "height":"",
    //   "eventExposure":"",
    //   "eventExposure1":"",
    //   "sdks": [
    //       {"type": "minli",
    //       "adid":"89df926c-77f8-461d-a2a5-0c3ec89def14",
    //       "pr":"100"
    //       },
    //       {"type": "none",
    //       "adid":"",
    //       "pr":""
    //       },
    //       {"type": "none",
    //       "adid":"",
    //        "pr":""
    //       },
    //       {"type": "none",
    //       "adid":"",
    //       "pr":""
    //       },
    //       {"type": "none",
    //       "adid":"",
    //       "pr":""
    //       }
    //     ]
    // }]

    const parseAd = JSON.parse(pauseData);
    let pauseAdData;

    const this_ = this;

    // 判断是否是数组
    if (Object.prototype.toString.call(parseAd) === '[object Array]') {
      if (parseAd && parseAd[0] && !parseAd[0].url && parseAd[0].sdks) {
        // this.player().log('minli ad');
        if (typeof window.getAdDataFromOutside === 'function') {
          window.getAdDataFromOutside('pause', parseAd[0].sdks, function(adType, dataStr) {
            // this_.player().log('got minli ' + adType + ' ad data');
            // this_.player().log(dataStr);

            // var data = JSON.parse(dataStr);

            // adObj.url = data.url;
            // adObj.clickUrl = data.clickUrl;
            // adObj.width = data.width;
            // adObj.height = data.height;

            // adObj.eventExposure = data.eventExposure;
            // adObj.eventExposure1 = data.eventExposure1;
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
      pauseAdData = parseAd[0];
    } else {
      // minli ad
      pauseAdData = parseAd;
    }

    // this.player().log(pauseData);
    // this.player().log(pauseAd);

    const adContent = this.getChild('PauseAdContent');

    // this.player_.log(adContent);

    if (pauseAdData) {
      adContent.setAdData(pauseAdData);

      this.adWidth = pauseAdData.width;
      this.adHeight = pauseAdData.height;

      // // 2020.8.3 移除resize后对暂停广告的隐藏判断
      // // 大于播放器尺寸80%的广告不显示
      // if (this.adWidth > this.player_.currentWidth() * 0.8 || this.adHeight > this.player_.currentHeight() * 0.8) {
      //   this.hide();
      //   // this.player_.log('pause ad too big to show');
      // } else {
      this.show();
      adContent.showAd();
      //   // this.player_.log('[pause-ad-overlay] show');
      //   // const closeBtn = this.getChild('pauseAdCloseButton');
      //   // closeBtn.el().style.right = (this.player_.currentWidth() - this.adWidth) * 0.5 + 'px';
      //   // closeBtn.el().style.top = (this.player_.currentHeight() - this.adHeight) * 0.5 + 'px';
      // }
    }

    // // 大于播放器尺寸80%的广告不显示
    // if (this.adWidth > this.player_.currentWidth() * 0.8 || this.adHeight > this.player_.currentHeight() * 0.8) {
    //   this.hide();
    //   // this.player_.log('pause ad too big to show');
    // } else {
    //   this.show();
    //   // this.player_.log('[pause-ad-overlay] show');
    //   // const closeBtn = this.getChild('pauseAdCloseButton');
    //   // closeBtn.el().style.right = (this.player_.currentWidth() - this.adWidth) * 0.5 + 'px';
    //   // closeBtn.el().style.top = (this.player_.currentHeight() - this.adHeight) * 0.5 + 'px';
    // }
  }

  hideAd(e) {
    // this.player_.log('play');
    this.isPlaying_ = true;
    this.hide();

    const adContent = this.getChild('PauseAdContent');

    adContent.hideAd();

    // this.player_.log(e);
    e.stopPropagation();
    if (this.player_) {
      this.player_.focus();
    }
  }

  onPause() {
    // function myFunc(arg) {
    //   console.log(`arg was => ${arg}`);
    // }
    this.isPlaying_ = false;
    const _overlay = this;

    setTimeout(this.getAdData, 300, _overlay);
  }

  // 结束不再显示暂停广告
  onEnded() {
    this.isPlaying_ = true;
  }

  getAdData(_this) {
    // window.console.log('get pause ad data');
    if (_this.isPlaying_) {
      return;
    }
    if ((!_this.player_.ads || !_this.player_.ads.isInAdMode()) && _this.player_.options().pauseAd !== false && _this.player_.options().pauseAdUrl !== undefined && _this.player_.options().pauseAdUrl !== '') {
      // this.player_.log('[pause-ad-overlay] load pause ad');

      const opts = {
        uri: _this.player_.options().pauseAdUrl
      };
      const crossOrigin = isCrossOrigin(_this.player_.options().pauseAdUrl);

      if (crossOrigin) {
        opts.cors = crossOrigin;
      }

      XHR(opts, Fn.bind_(_this, function(err, response, responseBody) {
        if (err) {
          // return this.player_.warn.error(err, response);
          return false;
        }
        // window.console.log('loaded this:' + this + ' response:' + response + ' responseBody:' + responseBody);

        // window.console.log(responseBody);

        if (responseBody) {
          if (_this.isPlaying_ === false) {
            _this.showAd(responseBody);
          }
        }
      }));
    } else {
      // this.player_.log('[pause-ad-overlay] no pause ad');
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
// PauseAdOverLay.prototype.labelText_ = 'AD';

/**
 * The text that should display over the `TimeDisplay`s controls. Added to for localization.
 *
 * @type {string}
 * @private
 *
 * @deprecated in v7; controlText_ is not used in non-active display Components
 */
// PauseAdOverLay.prototype.controlText_ = 'AD Label';

PauseAdOverLay.prototype.options_ = {
  children: [
    'pauseAdContent'
    // 'pauseAdCloseButton'
    // 'adsFullscreenToggle'
  ]
};

Component.registerComponent('pauseAdOverLay', PauseAdOverLay);
export default PauseAdOverLay;
