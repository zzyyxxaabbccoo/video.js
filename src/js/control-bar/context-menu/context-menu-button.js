/**
 * @file context-menu-button.js
 */
import MenuButton from '../../menu/menu-button.js';
import Menu from '../../menu/menu.js';
import ContextMenuItem from './context-menu-item.js';
import Component from '../../component.js';
// import * as Dom from '../../utils/dom.js';

// import {updatedate} from '../../../../package.json';
// import {playerversion} from '../../../../package.json';
// import {version} from '../../../../package.json';

/**
 * The component for controlling the contextMenu.
 *
 * @extends MenuButton
 */
class ContextMenuButton extends MenuButton {

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

    this.showDebug_ = false;

    // this.updateVisibility();
    // this.on(player, 'loadstart', this.updateVisibility);

    //
    // this.menu.hide();

  }

  // showDebug(value) {
  //   if (value !== undefined) {
  //     this.showDebug_ = value;
  //   }
  //   return this.showDebug_;
  // }

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    const el = super.createEl();

    // this.labelEl_ = Dom.createEl('div', {
    //   className: 'vjs-context-menu-button',
    //   innerHTML: '-'
    // });

    // el.appendChild(this.labelEl_);

    el.oncontextmenu = function() {
      return false;
    };

    return el;
  }

  moveAndShow(event, showDebug) {
    this.showDebug_ = showDebug;
    if (this.showDebug_) {
      this.player_.log('[player] show debug contextmenu');
      // this.player_.log(event);
    }
    this.update();
    // this.player_.log('[player]' + event);
    this.el().style.left = event.offsetX + 'px';
    this.el().style.top = event.offsetY + 'px';
    this.addClass('vjs-hover');
    this.menu.show();
  }

  dispose() {
    this.labelEl_ = null;

    super.dispose();
  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object.
   */
  buildCSSClass() {
    return `context-menu-button ${super.buildCSSClass()}`;
  }

  buildWrapperCSSClass() {
    return `context-menu ${super.buildWrapperCSSClass()}`;
  }

  /**
   * Create the playback rate menu
   *
   * @return {Menu}
   *         Menu object populated with {@link ContextMenuItem}s
   */
  createMenu() {
    const menu = new Menu(this.player());

    // this.player_.log(this.options().playerOptions['wrapperVersion']);

    const updatedateStr = String(this.player().updatedate).split('.').join('');

    const wrapperupdateStr = String(this.options().playerOptions.wrapperupdate).split('.').join('');

    menu.addChild(new ContextMenuItem(this.player(), {content: 'core: v' + this.player().playerversion + '.' + updatedateStr}));
    menu.addChild(new ContextMenuItem(this.player(), {content: 'wrapper: v' + this.options().playerOptions.wrapperVersion + '.' + wrapperupdateStr}));

    if (this.showDebug_) {
      // menu.addChild(new ContextMenuItem(this.player(), {content: 'debug:' + this.player_.version}));
      menu.addChild(new ContextMenuItem(this.player(), {content: 'Video Info... '}));
      menu.addChild(new ContextMenuItem(this.player(), {content: 'Debug Info... '}));
    }

    return menu;
  }

  /**
   * Updates ARIA accessibility attributes
   */
  updateARIAAttributes() {
    // Current playback rate
    this.el().setAttribute('aria-valuenow', this.player().playbackRate());
  }

  /**
   * This gets called when an `PlaybackRateMenuButton` is "clicked". See
   * {@link ClickableComponent} for more detailed information on what a click can be.
   *
   * @param {EventTarget~Event} [event]
   *        The `keydown`, `tap`, or `click` event that caused this function to be
   *        called.
   *
   * @listens tap
   * @listens click
   */
  handleClick(event) {
    return;
  }

}

/**
 * The text that should display over the `ContextMenuButton`s controls. Added for localization.
 *
 * @type {string}
 * @private
 */
ContextMenuButton.prototype.controlText_ = '';

Component.registerComponent('ContextMenuButton', ContextMenuButton);
export default ContextMenuButton;
