/**
 * @file volume-control.js
 */
import Component from '../../component.js';
// import checkVolumeSupport from './check-volume-support';
import {isPlain} from '../../utils/obj';
import {throttle, bind, UPDATE_REFRESH_INTERVAL} from '../../utils/fn.js';

// Required children
// import './volume-bar.js';

/**
 * The component for controlling the volume level
 *
 * @extends Component
 */
class NextControl extends Component {

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
    options.vertical = true;

    // Pass the vertical option down to the VolumeBar if
    // the VolumeBar is turned on.
    if (typeof options.volumeBar === 'undefined' || isPlain(options.volumeBar)) {
      options.volumeBar = options.volumeBar || {};
      options.volumeBar.vertical = options.vertical;
    }

    super(player, options);

    // hide this control if volume support is missing
    // checkVolumeSupport(this, player);

    this.throttledHandleMouseMove = throttle(bind(this, this.handleMouseMove), UPDATE_REFRESH_INTERVAL);


    this.on('mouseover',this.handlerMouseOver);

    this.on('click',this.handlerClick);

    // this.on('mousedown', this.handleMouseDown);
    this.on('touchstart', this.handleMouseDown);

    // while the slider is active (the mouse has been pressed down and
    // is dragging) or in focus we do not want to hide the VolumeBar
    // this.on(this.volumeBar, ['focus', 'slideractive'], () => {
    //   this.volumeBar.addClass('vjs-slider-active');
    //   this.addClass('vjs-slider-active');
    //   this.trigger('slideractive');
    // });

    // this.on(this.volumeBar, ['blur', 'sliderinactive'], () => {
    //   this.volumeBar.removeClass('vjs-slider-active');
    //   this.removeClass('vjs-slider-active');
    //   this.trigger('sliderinactive');
    // });
  }

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    // const orientationClass = 'vjs-next-vertical';

    // if (this.options_.vertical) {
    //   orientationClass = 'vjs-volume-vertical';
    // }

// https://p2.img.cctvpic.com/apple3g/www/upload/image/20191224/1577173114282005386.jpg
// 下集url
// <div class="next-title">${this.localize('Next')}</div>

    return super.createEl('div', {
      className: 'vjs-next-control-container',
      innerHTML: `<div class="next-image"><img src="${this.player().options_.nextImageUrl}"/></div><div class="next-title">${this.player().options_.nextTitle}</div>`
    });

    // return super.createEl('div', assign({
    //   className: 'vjs-next-control-container',
    //   innerHTML: `<div class="vjs-menu-item-text">${this.localize()}</div><div>啥的范德萨范德萨阿斯顿发生啊</div>`,
    //   tabIndex: -1
    // }, undefined), undefined);
  }

  /**
   * Handle `mousedown` or `touchstart` events on the `VolumeControl`.
   *
   * @param {EventTarget~Event} event
   *        `mousedown` or `touchstart` event that triggered this function
   *
   * @listens mousedown
   * @listens touchstart
   */
  handleMouseDown(event) {
    // const doc = this.el_.ownerDocument;

    // this.on(doc, 'mousemove', this.throttledHandleMouseMove);
    // this.on(doc, 'touchmove', this.throttledHandleMouseMove);
    // this.on(doc, 'mouseup', this.handleMouseUp);
    // this.on(doc, 'touchend', this.handleMouseUp);
  }

  handlerMouseOver(event) {
    this.player().log('mouse over');
  }

  handlerClick(event) {
    this.player().log('click');
    // 调用页面下一集方法
    NextVideo();
  }

  /**
   * Handle `mouseup` or `touchend` events on the `VolumeControl`.
   *
   * @param {EventTarget~Event} event
   *        `mouseup` or `touchend` event that triggered this function.
   *
   * @listens touchend
   * @listens mouseup
   */
  handleMouseUp(event) {
    // const doc = this.el_.ownerDocument;

    // this.off(doc, 'mousemove', this.throttledHandleMouseMove);
    // this.off(doc, 'touchmove', this.throttledHandleMouseMove);
    // this.off(doc, 'mouseup', this.handleMouseUp);
    // this.off(doc, 'touchend', this.handleMouseUp);
  }

  /**
   * Handle `mousedown` or `touchstart` events on the `VolumeControl`.
   *
   * @param {EventTarget~Event} event
   *        `mousedown` or `touchstart` event that triggered this function
   *
   * @listens mousedown
   * @listens touchstart
   */
  handleMouseMove(event) {
    // this.volumeBar.handleMouseMove(event);
  }
}

/**
 * Default options for the `VolumeControl`
 *
 * @type {Object}
 * @private
 */
NextControl.prototype.options_ = {
//   children: [
//     'volumeBar'
//   ]
};

Component.registerComponent('NextControl', NextControl);
export default NextControl;
