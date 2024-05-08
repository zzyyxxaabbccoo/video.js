/**
 * @file next-control.js
 */
import Component from '../../component.js';
import * as Dom from '../../utils/dom.js';
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
class PreviewButton extends Component {

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

    super(player, options);

    // this.on(player, ['loadstart'], this.volumePanelState_);

    // this.on('click', this.handlerClick);
    // this.on('mouseover', this.handleMouseOver);
    // this.on('mouseout', this.handleMouseOut);

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

    // const el = super.createEl('div', {
    //   className: 'preview'
    // });

    const el = Dom.createEl('div', {
      className: 'preview-button'
    });

    return el;

    // return super.createEl('div', {
    //   className: `preview`
    // });
  }

  // handlerClick(event) {
  //   window.console.log();

  //   event.stopPropagation();
  // }

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
PreviewButton.prototype.options_ = {
  children: [
  ]
};

Component.registerComponent('PreviewButton', PreviewButton);
export default PreviewButton;
