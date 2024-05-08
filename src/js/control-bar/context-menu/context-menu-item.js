/**
 * @file context-menu-item.js
 */
import MenuItem from '../../menu/menu-item.js';
import Component from '../../component.js';

import document from 'global/document';

/**
 * The specific menu item type for selecting a contextMenu.
 *
 * @extends MenuItem
 */
class ContextMenuItem extends MenuItem {

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
    const label = options.content;

    // Modify options for parent MenuItem class's init.
    options.label = label;
    options.selectable = false;
    options.multiSelectable = false;

    super(player, options);

    this.label = label;

    this.on('mouseover', this.handleMouseOver);
    this.on('mouseout', this.handleMouseOut);
  }

  /**
   * This gets called when an `ContextMenuItem` is "clicked". See
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
    if (event.shiftKey === true) {

      const copyStr = this.player_.getDebugInfo();
      const oInput = document.createElement('textarea');

      oInput.value = copyStr;
      document.body.appendChild(oInput);
      // oInput.value.split('\n;').join('--');
      oInput.select();
      const copyResult = document.execCommand('copy');

      document.body.removeChild(oInput);
      if (copyResult) {
        this.player_.log('[CMI] debug info has copied');
      } else {
        this.player_.warn('[CMI] copy failed!');
      }

      // 支持换行的
      // var Url2=document.getElementById("biao1").innerText;
      // var oInput = document.createElement('input');
      // oInput.value = Url2;
      // document.body.appendChild(oInput);
      // oInput.select(); // 选择对象
      // document.execCommand("Copy"); // 执行浏览器复制命令
      // oInput.className = 'oInput';
      // oInput.style.display='none';
      // alert('复制成功');
    }

    // this.trigger('mouseleave');

    super.handleClick();
  }

  handleMouseOver(event) {
    // this.player_.log('[context menu item] mouseover');
  }

  handleMouseOut(event) {
    // this.player_.log('[context menu item] mouseout');
    this.selected(false);
  }

  // handleCopyDDL = record =>{
  //   // 获取需要复制的文字
  //   const copyStr = record.ddl_str
  //   // 创建input标签存放需要复制的文字
  //   const oInput = document.createElement('input');
  //   // 把文字放进input中，供复制
  //   oInput.value = copyStr;
  //   document.body.appendChild(oInput);
  //   // 选中创建的input
  //   oInput.select();
  //   // 执行复制方法， 该方法返回bool类型的结果，告诉我们是否复制成功
  //   const copyResult = document.execCommand('copy')
  //   // 操作中完成后 从Dom中删除创建的input
  //   document.body.removeChild(oInput)
  //   // 根据返回的复制结果 给用户不同的提示
  //   if (copyResult) {
  //     message.success('DDL已复制到粘贴板')
  //   } else {
  //     message.error('复制失败')
  //   }
  // }

  /**
   * Update the ContextMenuItem when the playbackrate changes.
   *
   * @param {EventTarget~Event} [event]
   *        The `ratechange` event that caused this function to run.
   *
   * @listens Player#ratechange
   */
  // update(event) {
  // this.selected(this.player().playbackRate() === this.rate);
  // }

}

/**
 * The text that should display over the `ContextMenuItem`s controls. Added for localization.
 *
 * @type {string}
 * @private
 */
ContextMenuItem.prototype.contentElType = 'button';

Component.registerComponent('ContextMenuItem', ContextMenuItem);
export default ContextMenuItem;
