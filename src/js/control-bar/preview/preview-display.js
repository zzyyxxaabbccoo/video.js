/**
 * @file next-control.js
 */
import Component from '../../component.js';
import * as Dom from '../../utils/dom.js';
import './preview-close-button';
// import PreviewButton from './preview-button.js';
// import {isPlain} from '../utils/obj';
// import * as Events from '../utils/events.js';
// import * as Fn from '../utils/fn.js';
// import keycode from 'keycode';
// import document from 'global/document';
// import window from 'global/window';

/**
 * A Component to contain the MuteToggle and VolumeControl so that
 * they can work together.
 *
 * @extends Component
 */
class PreviewDisplay extends Component {

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
    // if (typeof options.inline !== 'undefined') {
    //   options.inline = options.inline;
    // } else {
    //   options.inline = true;
    // }

    // options.inline = false;

    // pass the inline option down to the VolumeControl as vertical if
    // the VolumeControl is on.

    // if (typeof options.volumeControl === 'undefined' || isPlain(options.volumeControl)) {
    //   options.volumeControl = options.volumeControl || {};
    //   options.volumeControl.vertical = !options.inline;
    // }

    // let str1 = '';
    // let str2 = '';
    // let str3 = '';

    // if(options.previewHintText.indexOf(options.previewHintClickText) < 0){
    //   //不分段

    // }else{

    // }

    // let previewButton = new PreviewButton(player,options);

    // this.previewButton =

    super(player, options);

    // this.on(player, ['loadstart'], this.volumePanelState_);

    // this.on('click', this.handlerClick);
    // this.on('mouseover', this.handleMouseOver);
    // this.on('mouseout', this.handleMouseOut);

    this.previewCloseButton = this.getChild('PreviewCloseButton');
    this.on(this.previewCloseButton, 'click', this.handlerClick);

    if (!this.player_.options_.previewTipText) {
      this.hide();
    }

  }

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    // if (!this.options_.inline) {
    //   orientationClass = 'vjs-volume-panel-vertical';
    // }

    const strAll = this.player_.options_.previewTipText;
    let clickStr = this.player_.options_.previewTipClickText;

    let index = strAll.indexOf(clickStr);

    if (index < 0) {
      index = 0;
      clickStr = '';
    }
    const str1 = strAll.slice(0, index);
    const str2 = clickStr;
    const str3 = strAll.slice(index + clickStr.length);

    // window.console.log(strAll);
    // window.console.log(str1);
    // window.console.log(str2);
    // window.console.log(str3);

    const el = super.createEl('div', {
      className: 'preview'
    });

    this.labelEl1_ = Dom.createEl('div', {
      className: 'preview-value',
      innerHTML: str1
    });

    this.labelEl2_ = Dom.createEl('div', {
      className: 'preview-value',
      innerHTML: '<a class="preview-button" href="javascript:void(0);" rel="external nofollow" onclick="loginstatus()">' + str2 + '</a>'
      // id: 'h5vod-preview-value-hide'
    });

    this.labelEl3_ = Dom.createEl('div', {
      className: 'preview-value',
      innerHTML: str3
    });

    el.appendChild(this.labelEl1_);
    el.appendChild(this.labelEl2_);
    el.appendChild(this.labelEl3_);

    return el;

    // return super.createEl('div', {
    //   className: `preview`
    // });
  }

  handlerClick(event) {
    this.hide();
    // event.stopPropagation();
  }

  /**
   * Dispose of the `volume-panel` and all child components.
   */
  dispose() {
    super.dispose();
  }

}

/**
 * Default options for the `VolumeControl`
 *
 * @type {Object}
 * @private
 */
PreviewDisplay.prototype.options_ = {
  children: [
    'PreviewCloseButton'
  ]
};

Component.registerComponent('PreviewDisplay', PreviewDisplay);
export default PreviewDisplay;
