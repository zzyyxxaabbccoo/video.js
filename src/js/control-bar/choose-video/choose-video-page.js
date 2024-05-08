/**
 * @file choose-video-page.js
 */
import Component from '../../component.js';
// import {isPlain} from '../../utils/obj';
// import * as Events from '../../utils/events.js';
// import * as Fn from '../../utils/fn.js';
// import { isCrossOrigin } from '../../utils/url.js';
// import log from '../../utils/log.js';
// import keycode from 'keycode';
// import document from 'global/document';

// import XHR from '@videojs/xhr';

// Required children
// import '../volume-control/volume-control.js';
// import '../mute-toggle.js';
// import PrevPageButton from './prev-page-button.js';
// import NextPageButton from './next-page-button.js';

// const loadPageData = function(src, page) {
//   const opts = {
//     uri: src
//   };
//   const crossOrigin = isCrossOrigin(src);

//   if (crossOrigin) {
//     opts.cors = crossOrigin;
//   }
//   // window.console.log(''+this);

//   XHR(opts, Fn.bind_(this, function(err, response, responseBody) {
//     if (err) {
//     //   return log.error(err, response);
//       log.error(err, response);
//     }
//     page.updatePage();
//   }));
// };

/**
 * A Component to contain the MuteToggle and VolumeControl so that
 * they can work together.
 *
 * @extends Component
 */
class ChooseVideoPage extends Component {

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

    super(player, options);

    // this.on(player, ['loadstart'], this.panelState_);
    // this.on(this.muteToggle, 'keyup', this.handleKeyPress);
    // this.on(this.volumeControl, 'keyup', this.handleVolumeControlKeyUp);

    // this.on('keydown', this.handleKeyPress);
    // this.on('mouseover', this.handleMouseOver);
    // this.on('mouseout', this.handleMouseOut);

    // while the slider is active (the mouse has been pressed down and
    // is dragging) we do not want to hide the VolumeBar
    // this.on(this.volumeControl, ['slideractive'], this.sliderActive_);
    // this.on(this.volumeControl, ['sliderinactive'], this.sliderInactive_);
  }

  /**
   * Adds vjs-hidden or vjs-mute-toggle-only to the VolumePanel
   * depending on MuteToggle and VolumeControl state
   *
   * @listens Player#loadstart
   * @private
   */
  panelState_() {
    // hide volume panel if neither volume control or mute toggle
    // are displayed
    // if (this.volumeControl.hasClass('vjs-hidden') && this.muteToggle.hasClass('vjs-hidden')) {
    //   this.addClass('vjs-hidden');
    // }

    // // if only mute toggle is visible we don't want
    // // volume panel expanding when hovered or active
    // if (this.volumeControl.hasClass('vjs-hidden') && !this.muteToggle.hasClass('vjs-hidden')) {
    //   this.addClass('vjs-mute-toggle-only');
    // }

    // this.addClass('vjs-hidden');

  }

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    // const orientationClass = 'vjs-volume-panel-horizontal';

    return super.createEl('div', {
      // className: `choose-video-panel vjs-control ${orientationClass}`
      className: 'choose-video-content',
      // 866:478px
      //   innerHTML: `${this.pageNum()}`
      innerHTML: ''
    });
  }

  resetPage() {
    // let url = 'https://api.cntv.cn/apicommon/index?path=iphoneInterface/general/getVideoListByMulti.jsonp&videoAlbum_id=&vmsAlbum_id=&video_id=&sort=desc';
    // url += '&video_playid=' + this.player_.options_.videoId + '&page=' + 1 + '&pageSize=' + 8;
    // this.el().innerHTML = '';
    // loadPageData(url, this);

    // this.updatePage();
    // this.player_.log(this.el());
    // this.player_.log('[page]:' + pageNum + this.player_.options_.videoId);
    // this.el().innerHTML = `${pageNum}`;
  }

  updatePage(curentPage) {
    const videolist = this.player().options_.chooseVideoData.data.list;

    let pNumber = 8;

    // 最大12页
    if (curentPage > Math.ceil(videolist.length / pNumber) - 1) {
      curentPage = Math.ceil(videolist.length / pNumber) - 1;
    }

    if (this.player().currentHeight() >= 600) {
      pNumber = 12;
      // 每页12条时最大8页
      if (curentPage > Math.ceil(videolist.length / pNumber) - 1) {
        curentPage = Math.ceil(videolist.length / pNumber) - 1;
      }
    }

    // 返回数据小于96条时，避免超页
    if (curentPage > Math.ceil(videolist.length / pNumber) - 1) {
      curentPage = Math.ceil(videolist.length / pNumber) - 1;
    }

    this.el().innerHTML = '';
    let htmlStr = '<ul>';

    for (let i = 0; i < pNumber; i++) {
      if (videolist[curentPage * pNumber + i] !== undefined) {
        htmlStr += `<li><div class="choose-video-content-item"><a href="${videolist[curentPage * pNumber + i].url}" target="_blank"><img width="100%" src="${videolist[curentPage * pNumber + i].image}" /><div>${videolist[curentPage * pNumber + i].title}</div></a></div></li>`;
      }

      if (i === pNumber - 1) {
        htmlStr += '</ul>';
      }
    }
    this.el().innerHTML = htmlStr;

    // 更新顶部距离
    const itemHeight = this.player().currentWidth() * 0.23 / 16 * 9 + 40;
    // 关闭按钮占高 20px
    // 底部bar 50px

    this.el().style.top = (this.player().currentHeight() * 0.96 - 50 - 20 - itemHeight * (pNumber / 4)) / 2 + 20 + 'px';
  }

  /**
   * Dispose of the `volume-panel` and all child components.
   */
  dispose() {
    // this.handleMouseOut();
    super.dispose();
  }
}

/**
 * Default options for the `VolumeControl`
 *
 * @type {Object}
 * @private
 */
// ChooseVideoPanel.prototype.options_ = {
//   children: [
//     'muteToggle',
//     'volumeControl'
//   ]
// };

Component.registerComponent('ChooseVideoPage', ChooseVideoPage);
export default ChooseVideoPage;
