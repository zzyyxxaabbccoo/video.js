/**
 * @file playback-quality-menu-item.js
 */
import PlaybackQualityMenuPermit from './playback-quality-menu-permit';
import MenuItem from '../../menu/menu-item.js';
import Component from '../../component.js';
import {createEl} from '../../utils/dom.js';

import store from 'store/dist/store.modern';

/**
 * The specific menu item type for selecting a playback quality.
 *
 * @extends MenuItem
 */
class PlaybackQualityMenuItem extends MenuItem {

  /**
   * Creates an instance of this class.
   *
   * @param {Player} player
   *        The `Player` that this class should be attached to.
   *
   * @param {Object} [options]
   *        The key/value store of player options.
   */
  constructor(player, options, hasPermit) {
    // Modify options for parent MenuItem class's init.
    options.selected = false;
    options.selectable = true;
    options.multiSelectable = false;

    super(player, options);

    const qualityLevels = this.player_.qualityLevels();

    // 码率显示
    this.label_ = options.label;
    // 码率次序
    this.levelIndex_ = options.levelIndex;
    // 自动显示码率,(自动档即this.levelIndex_ < 0 时有效)
    if (this.levelIndex_ < 0) {
      this.autoLabels_ = options.autoLabels;
      // 自动码率的level
      this.autoLabelIndex = -1;
      const menuItemEl = createEl('span', {
        className: 'vjs-menu-item-text-small',
        textContent: this.localize('')
      });

      this.el().appendChild(menuItemEl);

      // If using SVG icons, the element with vjs-icon-placeholder will be added separately.
      // if (this.player_.options_.experimentalSvgIcons) {
      //   this.el().appendChild(menuItemEl);
      // } else {
      //   this.el().replaceChild(menuItemEl, this.el().querySelector('.vjs-icon-placeholder'));
      // }
    }
    // 许可级别
    this.permit_ = options.permit;

    // this.quality = options.quality;

    if (hasPermit) {
      const permitLabel = new PlaybackQualityMenuPermit(player, options);

      if ((typeof this.permit_) === undefined) {
        permitLabel.hide();
      }
      if (this.permit_ <= 0) {
        permitLabel.visible(false);
      }
      this.addChild(permitLabel);
    }

    // 目前看该事件只用于初始化后第一次设置码率，后续手动切换码率由qualityLevels的change事件触发
    // this.on(player, 'initQualitychange', this.update);

    // 非自动档（即this.levelIndex_ >= 0）时，当前选中的码率，是否是当前码率，
    this.currentLevelSelected_ = qualityLevels.selectedIndex === this.levelIndex_;
    // #此处不一定准，当有码率不可用时，autoLabelIndex 在autoLabels_中的索引，与qualityLevels.selectedIndex 的索引可能会有偏差
    // 以后要确保 autoLabels_ 包含完整qualityLevels 列表，即使某码率不会使用。
    this.autoLabelIndex = qualityLevels.selectedIndex;
    this.onAutoQualityChange(null);

    this.on(player, 'autoQualityChange', (e) => this.onAutoQualityChange(e));

    this.showTargetQualityMenu = typeof this.player().options().showTargetQualityMenu === 'undefined' ? false : this.player().options().showTargetQualityMenu;
    if (this.showTargetQualityMenu) {
      this.on(player, 'targetLevelChange', this.onTargetLevelChange);
    } else {
      this.on(qualityLevels, 'change', (e) => this.onChange(e));
    }
  }

  /**
   * This gets called when an `PlaybackQualityMenuItem` is "clicked". See
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
    // 0可播，其他为原因
    if (this.permit_ !== 0) {
      this.player().log('this.permit_:' + this.permit_);
      this.player().pause();
      this.player().trigger('loginstatus');
      store.set('h5vodlocaldata', {lastQuality: this.label_, lastVolume: this.player().volume()});
      return;
    }
    super.handleClick();
    this.player().switchQualityLevel(this.levelIndex_);
    // log('click item');
    this.player().trigger('analyticALI.play.1.13');
  }

  /**
   * Update the PlaybackQualityMenuItem when the playbackquality changes.
   *
   * @param {EventTarget~Event} [event]
   *        The `qualitychange` event that caused this function to run.
   *
   * @listens Player#qualitychange
   */
  update(event) {
    // this.player_.log('[PlaybackQualityMenuItem] 11:'+this.quality + ' current:' + this.player().getCurentQuality());
    this.selected(this.player().getCurentQuality() === this.quality);
  }

  /**
   * 是否改变自动码率设置
   */
  onAutoQualityChange(event) {
    // 自身是自动挡时
    if (this.levelIndex_ < 0) {
      // 自动档 按是否自动选中
      this.selected(this.player_.autoQuality());
      if (!this.player_.autoQuality()) {
        this.el().querySelector('.vjs-menu-item-text-small').innerText = '';
        this.el().querySelector('.vjs-menu-item-text-small').style.display = 'none';
      } else {
        // 自动
        this.el().querySelector('.vjs-menu-item-text-small').innerText = this.localize(this.autoLabels_[this.autoLabelIndex].label);
        this.el().querySelector('.vjs-menu-item-text-small').style.display = 'inline';
      }
    } else if (this.player_.autoQuality()) {
      // 自身非自动挡时，单码率挡 自动时不选中
      this.selected(false);
    } else if (!this.player_.autoQuality()) {
      // 自身非自动挡时，单码率挡 非自动时可选中
      this.selected(this.currentLevelSelected_);
    }
  }

  /**
   * 改变码率状态
   */
  onChange(event) {
    this.currentLevelSelected_ = event.selectedIndex === this.levelIndex_;
    this.autoLabelIndex = event.selectedIndex;
    this.onAutoQualityChange(null);
  }

  onTargetLevelChange(event) {
    this.currentLevelSelected_ = event.targetLevel === this.levelIndex_;
    this.onAutoQualityChange(null);
  }

  playbackQualities() {
    return this.options_.playbackQualities || (this.options_.playerOptions && this.options_.playerOptions.playbackQualities);
  }

  // playbackQualityIndexs() {
  //   return this.options_.playbackQualityIndex || (this.options_.playerOptions && this.options_.playerOptions.playbackQualityIndex);
  // }

}

/**
 * The text that should display over the `PlaybackQualityMenuItem`s controls. Added for localization.
 *
 * @type {string}
 * @private
 */
PlaybackQualityMenuItem.prototype.contentElType = 'Playback Quality';

Component.registerComponent('PlaybackQualityMenuItem', PlaybackQualityMenuItem);
export default PlaybackQualityMenuItem;
