/**
 * @file setup-menu-item.js
 */
import MenuItem from '../../menu/menu-item.js';
import Component from '../../component.js';
import {assign} from '../../utils/obj';

/**
 * The specific menu item type for selecting a playback rate.
 *
 * @extends MenuItem
 */
class SetupMenuItemAutoNext extends MenuItem {

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
    const content = options.content;
    // const label_cn = options.content;
    // const rate = parseFloat(label, 10);

    // Modify options for parent MenuItem class's init.
    // options.label = label;
    // options.selected = rate === 1;
    // options.selectable = true;
    options.multiSelectable = false;

    super(player, options);

    this.label = content;
    // this.label_en = label_en;
    // this.rate = rate;

    

    // super.createEl('li', assign({
    //   className: 'vjs-menu-item',
    //   innerHTML: `<span class="vjs-menu-item-text">${this.localize(this.options_.label)}</span>`,
    //   tabIndex: -1
    // }, props), attrs);

    // this.on(player, 'ratechange', this.update);

    this.on(player, 'autonextchange', this.update);
  }

  /**
   * Create the `MenuItem's DOM element
   *
   * @param {string} [type=li]
   *        Element's node type, not actually used, always set to `li`.
   *
   * @param {Object} [props={}]
   *        An object of properties that should be set on the element
   *
   * @param {Object} [attrs={}]
   *        An object of attributes that should be set on the element
   *
   * @return {Element}
   *         The element that gets created.
   */
  createEl(type, props, attrs) {
    // The control is textual, not just an icon
    this.nonIconControl = true;
    
    return super.createEl('li', assign({
      className: 'vjs-menu-item',
      innerHTML: `<span class="vjs-menu-item-text">${this.localize(this.options_.content)}</span> <div class="vjs-menu-item-selector"> <div class="vjs-menu-item-selector-mask"> </div> </div>`,
      tabIndex: -1
    }, props), attrs);
  }

  /**
   * This gets called when an `PlaybackRateMenuItem` is "clicked". See
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
    this.player().log('auto click');
    if(this.player().autoNext() === true){
      this.player().autoNext(false);
      this.removeClass('selectorOn');
      this.addClass('selectorOff');
    }else{
      this.player().autoNext(true);
      this.player().loop(false);
      this.removeClass('selectorOff');
      this.addClass('selectorOn');
    }
  }

  /**
   * Update the PlaybackRateMenuItem when the playbackrate changes.
   *
   * @param {EventTarget~Event} [event]
   *        The `ratechange` event that caused this function to run.
   *
   * @listens Player#ratechange
   */
  update(event) {
    // this.selected(this.player().playbackRate() === this.rate);
    this.player().log(this.el_);
    // this.player().log('[AUTO]'+this.player().autoNext());
  }

}

/**
 * The text that should display over the `PlaybackRateMenuItem`s controls. Added for localization.
 *
 * @type {string}
 * @private
 */
SetupMenuItemAutoNext.prototype.contentElType = 'button';

Component.registerComponent('SetupMenuItemAutoNext', SetupMenuItemAutoNext);
export default SetupMenuItemAutoNext;
