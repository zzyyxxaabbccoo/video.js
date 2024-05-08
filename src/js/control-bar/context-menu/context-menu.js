/**
 * @file context-menu.js
 */
// import MenuButton from '../../menu/menu-button.js';
import Menu from '../../menu/menu.js';
// import ContextMenuItem from './context-menu-item.js';
import Component from '../../component.js';
import * as Dom from '../../utils/dom.js';

// import {version} from '../../../../package.json';

/**
 * The component for controlling the contextMenu.
 *
 * @extends Menu
 */
class ContextMenu extends Menu {

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

    this.update();

    // this.updateVisibility();
    // this.updateLabel();

    // this.on(player, 'loadstart', this.updateVisibility);
    // this.on(player, 'ratechange', this.updateLabel);
  }

  update() {
    const menu = this.createMenu();

    if (this.menu) {
      this.menu.dispose();
      this.removeChild(this.menu);
    }

    this.menu = menu;
    this.addChild(menu);

    /**
     * Track the state of the menu button
     *
     * @type {Boolean}
     * @private
     */
    this.buttonPressed_ = false;
    this.menuButton_.el_.setAttribute('aria-expanded', 'false');

    if (this.items && this.items.length <= this.hideThreshold_) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  //   createEl() {
  //     const el = super.createEl();

  //     this.labelEl_ = Dom.createEl('div', {
  //       className: 'vjs-context-menu',
  //       innerHTML: 'context-menu'
  //     });

  //     el.appendChild(this.labelEl_);

  //     return el;
  //   }

  //   dispose() {
  //     this.labelEl_ = null;

  //     super.dispose();
  //   }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object.
   */
  buildCSSClass() {
    return `context-menu ${super.buildCSSClass()}`;
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
  //   createMenu() {
  //     // const menu = new Menu(this.player());
  //     // const rates = this.playbackRates();

  //     // if (rates) {
  //     //   for (let i = rates.length - 1; i >= 0; i--) {
  //     //     menu.addChild(new ContextMenuItem(this.player(), {rate: rates[i] + 'x'}));
  //     //   }
  //     // }

  //     this.addChild(new ContextMenuItem(this.player(), {rate: 'core:' + version}));

  //     this.addChild(new ContextMenuItem(this.player(), {rate: 'v:1.3.0.alpha'}));

  //     return menu;
  //   }

  /**
   * Create the menu and add all items to it.
   *
   * @return {Menu}
   *         The constructed menu
   */
  createMenu() {
    const menu = new Menu(this.player_, { menuButton: this });

    /**
     * Hide the menu if the number of items is less than or equal to this threshold. This defaults
     * to 0 and whenever we add items which can be hidden to the menu we'll increment it. We list
     * it here because every time we run `createMenu` we need to reset the value.
     *
     * @protected
     * @type {Number}
     */
    this.hideThreshold_ = 0;

    // Add a title list item to the top
    if (this.options_.title) {
      const titleEl = Dom.createEl('li', {
        className: 'vjs-menu-title',
        innerHTML: this.options_.title,
        tabIndex: -1
      });

      this.hideThreshold_ += 1;

      const titleComponent = new Component(this.player_, {el: titleEl});

      menu.addItem(titleComponent);
    }

    this.items = this.createItems();

    if (this.items) {
      // Add menu items to the menu
      for (let i = 0; i < this.items.length; i++) {
        menu.addItem(this.items[i]);
      }
    }

    return menu;
  }

  /**
   * Create the list of menu items. Specific to each subclass.
   *
   * @abstract
   */
  createItems() {}

  /**
   * Updates ARIA accessibility attributes
   */
  //   updateARIAAttributes() {
  //     // Current playback rate
  //     this.el().setAttribute('aria-valuenow', this.player().playbackRate());
  //   }

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
    // select next rate option
    // const currentRate = this.player().playbackRate();
    // const rates = this.playbackRates();

    // this will select first one if the last one currently selected
    // let newRate = rates[0];

    // for (let i = 0; i < rates.length; i++) {
    //   if (rates[i] > currentRate) {
    //     newRate = rates[i];
    //     break;
    //   }
    // }
    // this.player().playbackRate(newRate);
  }

  /**
   * Get possible playback rates
   *
   * @return {Array}
   *         All possible playback rates
   */
  //   playbackRates() {
  //     return this.options_.playbackRates || (this.options_.playerOptions && this.options_.playerOptions.playbackRates);
  //   }

  /**
   * Get whether playback rates is supported by the tech
   * and an array of playback rates exists
   *
   * @return {boolean}
   *         Whether changing playback rate is supported
   */
  //   playbackRateSupported() {
  //     return this.player().tech_ &&
  //       this.player().tech_.featuresPlaybackRate &&
  //       this.playbackRates() &&
  //       this.playbackRates().length > 0
  //     ;
  //   }

  /**
   * Hide playback rate controls when they're no playback rate options to select
   *
   * @param {EventTarget~Event} [event]
   *        The event that caused this function to run.
   *
   * @listens Player#loadstart
   */
  updateVisibility(event) {
    if (this.playbackRateSupported()) {
      this.removeClass('vjs-hidden');
    } else {
      this.addClass('vjs-hidden');
    }
  }

  /**
   * Update button label when rate changed
   *
   * @param {EventTarget~Event} [event]
   *        The event that caused this function to run.
   *
   * @listens Player#ratechange
   */
  updateLabel(event) {
    if (this.playbackRateSupported()) {
      if (this.player().language() === 'en') {
        this.labelEl_.innerHTML = '' + this.player().playbackRate() + 'x';
      } else {
        this.labelEl_.innerHTML = '播速';
      }
    }
    // videojs.log('updateLabel');
  }

}

/**
 * The text that should display over the `ContextMenuButton`s controls. Added for localization.
 *
 * @type {string}
 * @private
 */
ContextMenu.prototype.controlText_ = '';

Component.registerComponent('ContextMenu', ContextMenu);
export default ContextMenu;
