/**
 * @file choose-video-item.js
 */
import Component from '../../component.js';
// import {isPlain} from '../../utils/obj';
// import * as Events from '../../utils/events.js';
// import * as Fn from '../../utils/fn.js';
// import keycode from 'keycode';
// import document from 'global/document';

// Required children
// import '../volume-control/volume-control.js';
// import '../mute-toggle.js';
// import PrevPageButton from './prev-page-button.js';
// import NextPageButton from './next-page-button.js';

/**
 * A Component to contain the MuteToggle and VolumeControl so that
 * they can work together.
 *
 * @extends Component
 */
class ChooseVideoItem extends Component {

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
      innerHTML: '<li></li>'
    });
  }

  resetItem(link, imgSrc, title) {
    // let url = 'http://api.cntv.cn/apicommon/index?path=iphoneInterface/general/getVideoListByMulti.jsonp&videoAlbum_id=&vmsAlbum_id=&video_id=&sort=desc&callback=jsonp2';
    // url += '&video_playid=' + video_playid + '&page=' + page + '&pageSize=' + pageSize;

    // this.player_.log(this.el());
    // this.player_.log('[page]:' + pageNum);
    // this.el().innerHTML = `${pageNum}`;
    this.el().innerHTML = `<li><div class="choose-video-content-item"><a href="${link}" target="_blank" data-spm-anchor-id="C98970.PHLx9PuE6jyI.S02120.1"><img src="${imgSrc}" alt=""><div>${title}</div></a></div></li>`;
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

Component.registerComponent('ChooseVideoItem', ChooseVideoItem);
export default ChooseVideoItem;
