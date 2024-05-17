/**
 * @file error-display.js
 */
import Component from './component';
import ModalDialog from './modal-dialog';

/**
 * A display that indicates an error has occurred. This means that the video
 * is unplayable.
 *
 * @extends ModalDialog
 */
class ErrorDisplay extends ModalDialog {

  /**
   * Creates an instance of this class.
   *
   * @param  { import('./player').default } player
   *         The `Player` that this class should be attached to.
   *
   * @param  {Object} [options]
   *         The key/value store of player options.
   */
  constructor(player, options) {
    super(player, options);
    this.on(player, 'error', (e) => {
      this.close();
      this.open(e);
    });

    const player_ = player;

    // 增加右键菜单
    this.el().oncontextmenu = function(event) {
      if (event.ctrlKey === true && event.altKey) {
        player_.showContextMenu(event, true);
      } else if (event.ctrlKey === true) {
        player_.showContextMenu(event, false);
      }
      return false;
    };
  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object.
   *
   * @deprecated Since version 5.
   */
  buildCSSClass() {
    return `vjs-error-display ${super.buildCSSClass()}`;
  }

  /**
   * Gets the localized error message based on the `Player`s error.
   *
   * @return {string}
   *         The `Player`s error message localized or an empty string.
   */
  content() {
    const error = this.player().error();

    // return error ? this.localize(error.message) : '';
    // return 'error:' + (error ? error.code + ' ' + this.localize(error.message) : '无法继续播放');
    return '' + (error ? '' + this.localize(error.message) : '无法继续播放');
  }

  fill() {
    super.fill();
    // let refresh = this.getChild('refreshButton');
    // if(!refresh){
    //   refresh = this.addChild('refreshButton', {controlText: 'Refresh Button'});
    //   this.on(refresh, 'refresh', this.refresh);
    // }
  }

  description() {
    const desc = '';

    // if (this.refreshable()) {
    //   desc += ' ' + this.localize('Refresh page');
    // }
    return desc;
  }
}

/**
 * The default options for an `ErrorDisplay`.
 *
 * @private
 */
ErrorDisplay.prototype.options_ = Object.assign({}, ModalDialog.prototype.options_, {
  pauseOnOpen: true,
  fillAlways: true,
  temporary: false,
  uncloseable: true
});

Component.registerComponent('ErrorDisplay', ErrorDisplay);
export default ErrorDisplay;
