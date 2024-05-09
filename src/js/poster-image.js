/**
 * @file poster-image.js
 */
import ClickableComponent from './clickable-component.js';
import Component from './component.js';
import * as Dom from './utils/dom.js';
import {silencePromise} from './utils/promise';
import videojs from './video.js';

/**
 * A `ClickableComponent` that handles showing the poster image for the player.
 *
 * @extends ClickableComponent
 */
class PosterImage extends ClickableComponent {

  /**
   * Create an instance of this class.
   *
   * @param { import('./player').default } player
   *        The `Player` that this class should attach to.
   *
   * @param {Object} [options]
   *        The key/value store of player options.
   */
  constructor(player, options) {
    super(player, options);

    // 解决safari 前置广告问题
    // 如果浏览器是safari，只有在canplaythrough事件后才可以点击海报图
    if (videojs.browser.IS_SAFARI) {
      this.canplayStart(false);
      this.on(player, 'canplaythrough', this.canplaythroughHandler);
    } else {
      this.canplayStart(true);
    }

    // 起播海报默认改为隐藏，延迟200ms后显示，解决图片有缓存是会立即显示导致闪现的问题
    this.hide();

    // block context menu on touch devices
    Dom.blockContextMenu(this.el());

    this.update();

    this.update_ = (e) => this.update(e);
    player.on('posterchange', this.update_);
  }

  /**
   * Handle `canplaythrough` events on the player and start the poster image
   * fading in if the video is playing.
   *
   * @param {EventTarget~Event} event
   *        The `canplaythrough` event that caused this to run.
   *
   * @listens Player#canplaythrough
   */
  canplaythroughHandler() {
    this.canplayStart(true);
  }

  /**
   * 是否允许播放
   *
   * @param {boolean} [value]
   *        The value to set the canplayStart to.
   *
   * @return {boolean}
   *         - The current canplayStart value of the `Player` when getting.
   *         - undefined when setting
   */
  canplayStart(value) {
    if (value !== undefined) {
      this.canplay_ = value;
    }
    return this.canplay_;
  }

  /**
   * Clean up and dispose of the `PosterImage`.
   */
  dispose() {
    this.player().off('posterchange', this.update_);
    super.dispose();
  }

  /**
   * Create the `PosterImage`s DOM element.
   *
   * @return {Element}
   *         The element that gets created.
   */
  createEl() {
    // The el is an empty div to keep position in the DOM
    // A picture and img el will be inserted when a source is set
    return Dom.createEl('div', { className: 'vjs-poster'});
  }

  /**
   * Get or set the `PosterImage`'s crossOrigin option.
   *
   * @param {string|null} [value]
   *        The value to set the crossOrigin to. If an argument is
   *        given, must be one of `'anonymous'` or `'use-credentials'`, or 'null'.
   *
   * @return {string|null}
   *         - The current crossOrigin value of the `Player` when getting.
   *         - undefined when setting
   */
  crossOrigin(value) {
    // `null` can be set to unset a value
    if (typeof value === 'undefined') {
      if (this.$('img')) {
        // If the poster's element exists, give its value
        return this.$('img').crossOrigin;
      } else if (this.player_.tech_ && this.player_.tech_.isReady_) {
        // If not but the tech is ready, query the tech
        return this.player_.crossOrigin();
      }
      // Otherwise check options as the  poster is usually set before the state of crossorigin
      // can be retrieved by the getter
      return this.player_.options_.crossOrigin || this.player_.options_.crossorigin || null;

    }

    if (value !== null && value !== 'anonymous' && value !== 'use-credentials') {
      this.player_.log.warn(`crossOrigin must be null,  "anonymous" or "use-credentials", given "${value}"`);
      return;
    }

    if (this.$('img')) {
      this.$('img').crossOrigin = value;
    }

    return;
  }

  /**
   * An {@link EventTarget~EventListener} for {@link Player#posterchange} events.
   *
   * @listens Player#posterchange
   *
   * @param {Event} [event]
   *        The `Player#posterchange` event that triggered this function.
   */
  update(event) {
    const url = this.player().poster();

    this.setSrc(url);

    // If there's no poster source we should display:none on this component
    // so it's not still clickable or right-clickable
    if (url) {
      // this.show();
      this.setTimeout(this.show, 200);
    } else {
      this.hide();
    }
  }

  show() {
    // this.player().log('[postimage] show');
    super.show();
  }

  /**
   * Set the source of the `PosterImage` depending on the display method. (Re)creates
   * the inner picture and img elementss when needed.
   *
   * @param {string} [url]
   *        The URL to the source for the `PosterImage`. If not specified or falsy,
   *        any source and ant inner picture/img are removed.
   */
  setSrc(url) {
    if (!url) {
      this.el_.textContent = '';
      return;
    }

    if (!this.$('img')) {
      this.el_.appendChild(Dom.createEl(
        'picture', {
          className: 'vjs-poster',

          // Don't want poster to be tabbable.
          tabIndex: -1
        },
        {},
        Dom.createEl('img', {
          loading: 'lazy',
          crossOrigin: this.crossOrigin()
        }, {
          alt: ''
        })
      ));
    }

    this.$('img').src = url;
  }

  /**
   * An {@link EventTarget~EventListener} for clicks on the `PosterImage`. See
   * {@link ClickableComponent#handleClick} for instances where this will be triggered.
   *
   * @listens tap
   * @listens click
   * @listens keydown
   *
   * @param {Event} event
   +        The `click`, `tap` or `keydown` event that caused this function to be called.
   */
  handleClick(event) {
    // 如果canplay() 返回false 点击海报不开始播放
    if (this.canplayStart() !== true) {
      return;
    }

    // We don't want a click to trigger playback when controls are disabled
    if (!this.player_.controls()) {
      return;
    }

    if (this.player_.tech(true)) {
      this.player_.tech(true).focus();
    }

    if (this.player_.paused()) {
      silencePromise(this.player_.play());
    } else {
      this.player_.pause();
    }
  }

}

/**
 * Get or set the `PosterImage`'s crossorigin option. For the HTML5 player, this
 * sets the `crossOrigin` property on the `<img>` tag to control the CORS
 * behavior.
 *
 * @param {string|null} [value]
 *        The value to set the `PosterImages`'s crossorigin to. If an argument is
 *        given, must be one of `anonymous` or `use-credentials`.
 *
 * @return {string|null|undefined}
 *         - The current crossorigin value of the `Player` when getting.
 *         - undefined when setting
 */
PosterImage.prototype.crossorigin = PosterImage.prototype.crossOrigin;

Component.registerComponent('PosterImage', PosterImage);
export default PosterImage;
