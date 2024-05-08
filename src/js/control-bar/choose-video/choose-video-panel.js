/**
 * @file choose-video-panel.js
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
import PrevPageButton from './prev-page-button.js';
import NextPageButton from './next-page-button.js';

import ChooseVideoPage from './choose-video-page.js';

import ChooseVideoCloseButton from './choose-video-close-button.js';

/**
 * A Component to contain the MuteToggle and VolumeControl so that
 * they can work together.
 *
 * @extends Component
 */
class ChooseVideoPanel extends Component {

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

    this.on(player, 'playerresize', this.playerResize);

    // this.on(this.muteToggle, 'keyup', this.handleKeyPress);
    // this.on(this.volumeControl, 'keyup', this.handleVolumeControlKeyUp);

    // this.on('keydown', this.handleKeyPress);
    // this.on('mouseover', this.handleMouseOver);
    // this.on('mouseout', this.handleMouseOut);

    const left_ = new PrevPageButton(player, options);
    const right_ = new NextPageButton(player, options);

    this.leftBtn(left_);
    this.rightBtn(right_);

    const page_ = new ChooseVideoPage(player, options);

    this.page(page_);

    this.addChild(left_);
    this.addChild(page_);
    this.addChild(right_);

    const close = new ChooseVideoCloseButton(player, options);

    this.addChild(close);

    // this.pageNum(0);

    this.on(close, 'click', this.hide);

    // this.on(rightBtn, 'click', this.nextPage_);

    // while the slider is active (the mouse has been pressed down and
    // is dragging) we do not want to hide the VolumeBar
    // this.on(this.volumeControl, ['slideractive'], this.sliderActive_);
    // this.on(this.volumeControl, ['sliderinactive'], this.sliderInactive_);
  }

  leftBtn(btn) {
    if (btn === undefined) {
      return this.leftBtn_;
    }
    this.leftBtn_ = btn;

  }
  rightBtn(btn) {
    if (btn === undefined) {
      return this.rightBtn_;
    }
    this.rightBtn_ = btn;
  }

  page(page) {
    if (page === undefined) {
      return this.page_;
    }
    this.page_ = page;

  }

  pageNum(page) {
    if (page === undefined) {
      if (this.pageNum_ === undefined) {
        this.pageNum_ = 0;
      }
      return this.pageNum_;
    } else if (this.pageNum_ !== page) {
      this.pageNum_ = page;
      if (this.pageNum_ < 0) {
        this.pageNum_ = 0;
      }
      this.updatePage();
    }
  }

  playerResize() {
    this.updatePage();
  }

  prevPage_() {
    if (this.pageNum() <= 0) {
      return;
    }
    this.pageNum(this.pageNum() - 1);
  }

  nextPage_() {

    this.pageNum(this.pageNum() + 1);
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
      className: 'choose-video-panel vjs-hidden'
      // 866:478px
      // innerHTML: `<div class="choose-video-content">${this.pageNum()}</div>`
    });
  }

  hideToggle() {
    if (this.hasClass('vjs-hidden')) {
      this.show();
    } else {
      this.hide();
    }
  }

  hide() {
    if (!this.hasClass('vjs-hidden')) {
      this.addClass('vjs-hidden');
    }

    this.player().getChild('ControlBar').getChild('chooseVideoButton').updateButtonState();

    // this.player().log(getChild('ControlBar'));
  }

  show() {
    this.removeClass('vjs-hidden');

  }

  updatePage() {
    // this.player_.log('[panel]updatePage:' + this.pageNum());
    // const left = this.leftBtn();
    if (this.pageNum() <= 0) {
      this.leftBtn_.hide();
    } else {
      this.leftBtn_.show();
    }

    let pNumber = 8;

    if (this.player().currentHeight() >= 600) {
      pNumber = 12;
    }
    if (!this.player().options_.chooseVideoData) {
      return;
    }
    const maxPage = Math.ceil(this.player().options_.chooseVideoData.data.list.length / pNumber) - 1;

    if (this.pageNum() >= maxPage) {
      this.rightBtn_.hide();
    } else {
      this.rightBtn_.show();
    }

    this.page().updatePage(this.pageNum());
    // this.el().innerHTML = `<div class="choose-video-content">${this.pageNum()}</div>`;
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

Component.registerComponent('ChooseVideoPanel', ChooseVideoPanel);
export default ChooseVideoPanel;
