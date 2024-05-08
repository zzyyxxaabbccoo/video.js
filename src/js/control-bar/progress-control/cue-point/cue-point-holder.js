/**
 * @file progress-control.js
 */
import Component from '../../../component.js';
// import * as Dom from '../../utils/dom.js';

/**
 * The Progress Control component contains the seek bar, load progress,
 * and play progress.
 *
 * @extends Component
 */
class CuePointHolder extends Component {

  /**
   * Creates an instance of this class.
   *
   * @param { import('../../player').default } player
   *        The `Player` that this class should be attached to.
   *
   * @param {Object} [options]
   *        The key/value store of player options.
   */
  constructor(player, options) {
    super(player, options);
  }

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    return super.createEl('div', {
      className: 'cue-point-holder'
    });
  }
}

Component.registerComponent('CuePointHolder', CuePointHolder);
export default CuePointHolder;
