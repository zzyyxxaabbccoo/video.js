/**
 * @file barrage-display.js
 */
// import document from 'global/document';
import Component from '../component.js';
import * as Dom from '../utils/dom.js';
// import formatTime from '../utils/format-time.js';

import BarrageLayer from './barrage-layer.js';

/**
 * Displays time information about the video
 *
 * @extends Component
 */
class BarrageDisplay extends Component {
  /**
   * Creates an instance of this class.
   *
   * @param {Player} player
   *        The `Player` that this class should be attached to.
   *
   * @param {Object} [options]
   *        The key/value store of player options.
   *
   * @param {string} [contentData]
   *        弹幕数据 字符串格式
   *
   */
  constructor(player, options, contentData, barrageId, lineIndex, self) {
    // this.contentData = contentData;
    super(player, options);
    // this.on(player, ['timeupdate', 'ended'], this.updateContent);

    if (contentData === undefined) {
      contentData = '';
    }

    this.parseContent(contentData);

    this.barrageId = barrageId;

    let marginTop = 9;
    let lineHeight = 35;
    let colors = ['#ffffff', '#ff5353', '#42ebff', '#fad400', '#ff7f01', '#7ff75b'];

    let colorSelf = '#ffffff';
    // let bgColorSelf = '#ff5353';
    let paddingSelf = 10;
    let borderRadius = 40;

    if (this.options().playerOptions.config !== undefined) {
      marginTop = this.options().playerOptions.config.barrage.marginTop;
      lineHeight = this.options().playerOptions.config.barrage.lineHeight;
      colors = this.options().playerOptions.config.barrage.color;

      colorSelf = this.options().playerOptions.config.barrage.colorSelf;
      // bgColorSelf = this.options().playerOptions.config.barrage.bgColorSelf;
      paddingSelf = this.options().playerOptions.config.barrage.paddingSelf;
      borderRadius = this.options().playerOptions.config.barrage.borderRadius;
    }
    // 第几行 序号
    this.el().style.top = (lineIndex * lineHeight + marginTop) + 'px';
    this.el().style.color = colors[Math.floor(Math.random() * colors.length)];

    if (self === true) {
      this.el().style.color = colorSelf;
      this.el().style.paddingLeft = paddingSelf + 'px';
      this.el().style.paddingRight = paddingSelf + 'px';
      // this.el().style.background = bgColorSelf;
      // this.el().style.border = '1px solid ' + bgColorSelf;
      this.el().style['border-radius'] = borderRadius + 'px';

      this.addClass('selfBarrageBorder');
    }

    this.el().oncontextmenu = function(event) {
      // if (event.ctrlKey === true && event.altKey) {
      //   this_.showContextMenu(event, true);
      // } else {
      //   this_.showContextMenu(event, false);
      // }
      // player.log('右键');
      return false;
    };

    this.on(['tap', 'click'], this.handleClick);
  }

  handleClick() {
    this.player_.log('[barrage-display] click!' + this.barrageId);
  }

  parseContent(contentData) {
    // 初步判定有表情

    // && contentData.indexOf('[/') < contentData.indexOf(']') 移除防止]出现在
    if (contentData.indexOf('[/') !== -1 && contentData.indexOf(']') !== -1) {

      // this.player_.log('const:'+ BarrageLayer.getEmoList().length);

      // 遍历全部表情，
      // 1、有则增加表情图标，图标前面如果有文字增加文字，直到剩余全部文字加到最后结束循环；
      // 2、没有则直接增加文字
      const emoLength = BarrageLayer.getEmoList().length;
      let hasEmo = false;
      let tempContentStr;

      for (let i = 0; i < emoLength; i++) {
        const emoIndex = contentData.indexOf(BarrageLayer.getEmoList()[i].text);
        // 有当前任意表情

        if (emoIndex !== -1) {
          hasEmo = true;
          // this.player_.log('[barrage-display]: 有表情:' + BarrageLayer.getEmoList()[i].name);
          // 非起始表情
          if (emoIndex !== 0) {
            // 判断当前表情前面的文本是否也有表情,如果还有则跳过继续寻找
            const preStr = contentData.substring(0, emoIndex);

            if (this.strContainEmo(preStr)) {
              // this.player_.log('[barrage-display]: 表情无效继续寻找');
              continue;
            } else {
              // this.player_.log('[barrage-display]: 添加表情前文本，添加表情' + BarrageLayer.getEmoList()[i].name);
              this.addContent(preStr);
              this.addEmo(BarrageLayer.getEmoList()[i].name);
            }
          } else {
            // 起始表情
            this.addEmo(BarrageLayer.getEmoList()[i].name);
          }

          // 剩余文本
          tempContentStr = contentData.substr(emoIndex + BarrageLayer.getEmoList()[i].text.length);

          // 跳出循环
          break;
        }
      }

      // 有任意表情时递归剩余文本
      if (hasEmo) {
        this.parseContent(tempContentStr);
      } else {
        // 没有匹配表情，将全部文本加入弹幕最后
        this.addContent(contentData);
      }

    } else {
      // 粗选没有表情，将全部文本加入弹幕最后
      this.addContent(contentData);
    }
  }

  // 文本是否有表情图标
  strContainEmo(contentStr) {
    let hasEmo = false;
    const emoLength = BarrageLayer.getEmoList().length;

    for (let i = 0; i < emoLength; i++) {
      // 有当前任意表情
      if (contentStr.indexOf(BarrageLayer.getEmoList()[i].text) !== -1) {
        hasEmo = true;
        break;
      }
    }
    return hasEmo;
  }

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    // const className = this.buildCSSClass();
    const el = super.createEl('div', {
      className: 'barrage-display'
      // innerHTML: `<span class="vjs-control-text" role="presentation">${this.localize(this.labelText_)}\u00a0</span>`
    });

    // 17px 字体
    let fontSize = 17;
    // 行高
    let lineHeight = 35;
    // 边框
    // let borderRadius = 40;

    // this.player_.log(this.options().playerOptions.config);

    if (this.options().playerOptions.config !== undefined) {
      fontSize = this.options().playerOptions.config.barrage.fontSize;
      lineHeight = this.options().playerOptions.config.barrage.lineHeight;
    }

    el.style['font-size'] = fontSize + 'px';
    el.style.height = (lineHeight) + 'px';
    el.style['line-height'] = (lineHeight) + 'px';
    el.style.left = this.player_.currentWidth() + 'px';

    return el;

    // , {
    //   // tell screen readers not to automatically read the time as it changes
    //   'aria-live': 'off',
    //   // span elements have no implicit role, but some screen readers (notably VoiceOver)
    //   // treat them as a break between items in the DOM when using arrow keys
    //   // (or left-to-right swipes on iOS) to read contents of a page. Using
    //   // role='presentation' causes VoiceOver to NOT treat this span as a break.
    //   'role': 'presentation'
    // }
  }

  addEmo(imgsrc) {
    // this.player_.log("--"+imgsrc + "-" + BarrageLayer.emoPicUrlPre());
    this.emoEl_ = Dom.createEl('img', {
      className: 'barrage-emo',
      src: `${BarrageLayer.emoPicUrlPre() + '/' + imgsrc}`
    });

    this.el().appendChild(this.emoEl_);
  }

  addContent(contentTxt) {
    this.contentEl_ = Dom.createEl('span', {
      className: 'barrage-content',
      innerHTML: '' + contentTxt
    });
    this.el().appendChild(Dom.createEl('span', {
      className: 'barrage-content',
      innerHTML: '' + contentTxt
    }));
  }

  dispose() {
    this.contentEl_ = null;
    this.textNode_ = null;

    super.dispose();
  }

  /**
   * To be filled out in the child class, should update the displayed time
   * in accordance with the fact that the current time has changed.
   *
   * @param {EventTarget~Event} [event]
   *        The `timeupdate`  event that caused this to run.
   *
   * @listens Player#timeupdate
   */
  // updateContent(event) {}
}

/**
 * The text that is added to the `TimeDisplay` for screen reader users.
 *
 * @type {string}
 * @private
 */
BarrageDisplay.prototype.labelText_ = '';

/**
 * The text that should display over the `TimeDisplay`s controls. Added to for localization.
 *
 * @type {string}
 * @private
 *
 * @deprecated in v7; controlText_ is not used in non-active display Components
 */
BarrageDisplay.prototype.controlText_ = '';

Component.registerComponent('BarrageDisplay', BarrageDisplay);
export default BarrageDisplay;
