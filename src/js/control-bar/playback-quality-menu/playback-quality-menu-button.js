/**
 * @file playback-quality-menu-button.js
 */
import MenuButton from '../../menu/menu-button.js';
// import Menu from '../../menu/menu.js';
import PlaybackQualityMenuItem from './playback-quality-menu-item.js';
import Component from '../../component.js';
import * as Dom from '../../utils/dom.js';
// import log from '../../utils/log.js';
// import store from 'store/dist/store.modern';
// import Player from '../../../js/player.js';

/**
 * The component for controlling the playback quality.
 *
 * @extends MenuButton
 */
class PlaybackQualityMenuButton extends MenuButton {

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
    options.title = '画质';

    super(player, options);

    this.qualities_ = this.player().options().customQualityList;

    this.updateVisibility();
    // 重绘选项
    // this.updateLabel();

    this.showTargetQualityMenu = typeof this.player().options().showTargetQualityMenu === 'undefined' ? false : this.player().options().showTargetQualityMenu;

    // 直接显示初始化码率
    this.initLabel();

    // 重绘菜单项
    this.on(player, 'loadedmetadata', this.updateMenu);

    // 新加
    this.on(player, 'autoQualityChange', (e) => this.onAutoQualityChange(e));

    // 起始触发 解决起播码率与自寻码率相同时 不触发change 不刷新ui的问题
    // #todo 未来可删除
    // this.on(player, 'initQualitychange', this.updateLabel);

    // 不再根据实际 qualityLevels 改变
    if (this.showTargetQualityMenu) {
      this.on(player, 'targetLevelChange', this.onTargetLevelChange);
    } else {
      const qualityLevels = this.player().qualityLevels();

      this.on(qualityLevels, 'change', this.onChange);
    }
  }

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    const el = super.createEl();

    this.labelEl_ = Dom.createEl('div', {
      className: 'vjs-playback-quality-value',
      innerHTML: 'HD'
      // 高清
    });

    el.appendChild(this.labelEl_);

    return el;
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
    return `vjs-playback-quality ${super.buildCSSClass()}`;
  }

  buildWrapperCSSClass() {
    return `vjs-playback-quality ${super.buildWrapperCSSClass()}`;
  }

  updateMenu() {
    this.update();
  }

  /**
   * Create the list of menu items. Specific to each subclass.
   *
   */
  createItems() {
    const qualities = this.qualities_;

    if (!qualities) {
      return [];
    }
    // 是否有提示，任意码率有提示则 使用加宽样式
    let _hasPermitHint = false;

    for (let i = qualities.length - 1; i >= 0; i--) {
      if (qualities[i].permition > 0) {
        _hasPermitHint = true;
        break;
      }
    }

    // 如果有码率不允许变为宽版背景
    if (_hasPermitHint) {
      this.addClass('vjs-playback-quality-wide');
    }

    // 显示解析度时，宽版背景
    if (this.player().options().showResolution) {
      this.addClass('vjs-playback-quality-wide');
    }

    // 是否支持自动码率
    const _hasAutoQuality = this.player().options().autoQuality;

    // 是否显示码率分辨率
    const _showResolution = false;

    const items = [];

    for (let i = qualities.length - 1; i >= 0; i--) {
      if (!qualities[i].enabled) {
        continue;
      }
      items.push(new PlaybackQualityMenuItem(this.player(), {label: this.localize(qualities[i].label) + (_showResolution ? ' ' + qualities[i].height + 'p' : ''), levelIndex: i, permit: qualities[i].permition}, _hasPermitHint));
    }

    // 显示自动码率
    if (_hasAutoQuality) {
      items.push(new PlaybackQualityMenuItem(this.player(), {label: 'auto', levelIndex: -1, permit: 0, autoLabels: this.qualities_}, false));
    }

    return items;
  }

  /**
   *
   */
  onAutoQualityChange(event) {
    // this.player_.log('[PlaybackQualityMenuButton] onAutoQualityChange, autoQuality:' + this.player_.autoQuality());
    this.onChange(null);
  }

  /**
   * Updates ARIA accessibility attributes
   */
  updateARIAAttributes() {
    // Current playback quality,#?
    this.el().setAttribute('aria-valuenow', this.player().playbackQuality());
  }

  /**
   * This gets called when an `PlaybackQualityMenuButton` is "clicked". See
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
    // // select next quality option
    // const currentQuality = this.player().playbackQuality();
    // const qualities = this.playbackQualities();

    // // this will select first one if the last one currently selected
    // let newQuality = qualities[0];

    // for (let i = 0; i < qualities.length; i++) {
    //   if (qualities[i] > currentQuality) {
    //     newQuality = qualities[i];
    //     break;
    //   }
    // }
    // this.player().playbackQuality(newQuality);

    // // this.player().log('click11');
  }

  handleMouseEnter() {
    // this.player().log('mouseenter');
    // this.player().log('click11');
    this.player().trigger('analyticALI.play.1.14');
  }

  /**
   * Get possible playback qualities
   *
   * @return {Array}
   *         All possible playback qualities
   */
  playbackQualities() {
    return this.options_.playbackQualities || (this.options_.playerOptions && this.options_.playerOptions.playbackQualities);
  }

  // playbackQualityIndexs() {
  //   return this.options_.playbackQualityIndex || (this.options_.playerOptions && this.options_.playerOptions.playbackQualityIndex);
  // }

  /**
   * Get whether playback quality is supported by the tech
   * and an array of playback quality exists
   *
   * @return {boolean}
   *         Whether changing playback quality is supported
   */
  playbackQualitySupported() {
    return this.player().tech_ && this.player().tech_.featuresPlaybackQuality;

    // 不再依赖 playbackQualities
    // &&
    // this.playbackQualities() &&
    // this.playbackQualities().length > 0
  }

  /**
   * Hide playback quality controls when they're no playback qualty options to select
   *
   * @param {EventTarget~Event} [event]
   *        The event that caused this function to run.
   *
   * @listens Player#loadstart
   */
  updateVisibility(event) {
    if (this.playbackQualitySupported()) {
      this.removeClass('vjs-hidden');
    } else {
      this.addClass('vjs-hidden');
    }
  }

  /**
   * Update button label when quality changed
   *
   * @param {EventTarget~Event} [event]
   *        The event that caused this function to run.
   *
   * @listens Player#qualitychange
   */
  initLabel(event) {
    if (this.player().options().customDefaultQualityIndex > -1) {
      const customDefaultQuality = this.player().options().customQualityList[this.player().options().customDefaultQualityIndex].label;

      this.labelEl_.innerHTML = '' + this.localize(customDefaultQuality);
    }
  }

  /**
   * Update button label when quality changed
   *
   * @param {EventTarget~Event} [event]
   *        The event that caused this function to run.
   *
   * @listens Player#qualitychange
   */
  updateLabel(label) {
    if (label === undefined) {
      return;
    }
    this.labelEl_.innerHTML = '' + this.localize(label);
  }

  /**
   * 改变码率状态
   * #todo 需要增加 this.qualities_ 未定义时的处理方案
   */
  onChange(event) {
    // this.player_.log('[PlaybackQualityMenuButton] onChange, autoQuality:' + this.player_.autoQuality());

    // this.player_.log(this.qualities_);
    if (this.player_.autoQuality()) {
      this.updateLabel('auto');
    } else if (this.qualities_) {
      const selectedIndex = this.player_.qualityLevels().selectedIndex;

      this.updateLabel('' + this.qualities_[selectedIndex].label);
    }
  }

  onTargetLevelChange(event) {
    if (this.qualities_) {
      const selectedIndex = event.targetLevel;

      this.updateLabel('' + this.qualities_[selectedIndex].label);
    }
  }
}

/**
 * The text that should display over the `PlaybackQualityMenuButton`s controls. Added for localization.
 *
 * @type {string}
 * @private
 */
PlaybackQualityMenuButton.prototype.controlText_ = 'Playback Quality';

Component.registerComponent('PlaybackQualityMenuButton', PlaybackQualityMenuButton);
export default PlaybackQualityMenuButton;
