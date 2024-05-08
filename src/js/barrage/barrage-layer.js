/**
 * @file barrage-layer.js
 */
import Component from '../component';
import * as Fn from '../utils/fn.js';
// import * as Dom from '../utils/dom.js';
import log from '../utils/log.js';
import window from 'global/window';

import { isCrossOrigin } from '../utils/url.js';
import XHR from '@videojs/xhr';
import BarrageDisplay from './barrage-display';

// 静态变量
// 表情数组，读取配置
const emoList = [];
// 是否加载了配置，避免重复加载
let configLoaded = false;
// 图片地址，读取配置
let picUrl_;

const parseEmoConfig = function(srcContent, container) {
  // data = srcContent;
  container.emoJSON(JSON.parse(srcContent));

  // window.console.log('[barrage-layer] parseEmoConfig');
  container.onEmoConfigLoaded();
  // window.console.log(track.emoJSON());
};

const loadEmoConfig = function(src, container) {
  // window.console.log('[barrage-layer] loadEmoConfig:' + src);
  const opts = {
    uri: src
  };
  const crossOrigin = isCrossOrigin(src);

  if (crossOrigin) {
    opts.cors = crossOrigin;
  }

  XHR(opts, Fn.bind_(this, function(err, response, responseBody) {
    if (err) {
      return log.error(err, response);
    }
    parseEmoConfig(responseBody, container);
  }));
};

const loadComments = function(src, container) {
  // window.console.log(this);
  // window.console.log('[barrage-layer] load comment at ' + container.currentTimeInSecond() + 'S');

  const opts = {
    uri: src
  };
  const crossOrigin = isCrossOrigin(src);

  if (crossOrigin) {
    opts.cors = crossOrigin;
  }
  // window.console.log(''+this);

  XHR(opts, Fn.bind_(this, function(err, response, responseBody) {
    if (err) {
      return log.error(err, response);
    }
    container.commentLoaded(responseBody);
  }));
};

/**
 * The component for displaying text track cues.
 *
 * @extends Component
 */
class BarrageLayer extends Component {

  /**
   * Creates an instance of this class.
   *
   * @param {Player} player
   *        The `Player` that this class should be attached to.
   *
   * @param {Object} [options]
   *        The key/value store of player options.
   *
   * @param {Component~ReadyCallback} [ready]
   *        The function to call when `TextTrackDisplay` is ready.
   */
  constructor(player, options, ready) {
    super(player, options, ready);

    // true点播弹幕  false直播弹幕
    this.isVod = this.player_.options_.barrageVod;

    if (this.isVod) {
      // 点播弹幕加载间隔
      this.BARRAGE_TIME_INTERVAL = 300;
    } else {
      // 直播播弹幕加载间隔
      this.BARRAGE_TIME_INTERVAL = 60;
      // 直播弹幕显示时间
      // this.liveBarrageTimer = 0;
      // 直播弹幕加载时间
      this.liveBarrageLoadCounter = -1;
      // 开启timer；
      if (this.player_.options_.barrageItemId !== undefined) {
        this.liveBarrageLoadTimer = this.setInterval(this.liveBarrageLoadTimerHandler, 1000);
      }
    }

    // 弹幕显示时间(ms) 10 * 1000
    this.SHOW_TIME = 10000;

    // 当true时跟随播速
    this.FOLLOW_RATE = true;

    // id计数器
    this.narrageIdCounter = 1;

    //
    this.commentData = [];
    // 弹幕管理
    this.barrageDisplay = [];

    const updateDisplayHandler = Fn.bind_(this, this.updateDisplay);

    player.on('timeupdate', Fn.bind_(this, this.timeUpdateHandler));

    player.on('seeking', Fn.bind_(this, this.seeking));

    player.on('loadstart', Fn.bind_(this, this.toggleDisplay));

    player.on('texttrackchange', updateDisplayHandler);

    this.on(player, 'play', this.play);
    this.on(player, 'pause', this.pause);

    // player.on('loadedmetadata', Fn.bind_(this, this.preselectTrack));

    // This used to be called during player init, but was causing an error
    // if a track should show by default and the display hadn't loaded yet.
    // Should probably be moved to an external track loader when we support
    // tracks that don't need a display.
    player.ready(Fn.bind_(this, function() {
      if (player.tech_ && player.tech_.featuresNativeTextTracks) {
        this.hide();
        return;
      }

      player.on('fullscreenchange', updateDisplayHandler);
      player.on('playerresize', updateDisplayHandler);

      window.addEventListener('orientationchange', updateDisplayHandler);
      player.on('dispose', () => window.removeEventListener('orientationchange', updateDisplayHandler));

    }));

    // this.player_.log('[barrage-layer] hasBarrage:' + this.player_.options_.hasBarrage);
    // this.player_.log('[barrage-layer] barrageVod:' + this.player_.options_.barrageVod);
    // this.player_.log('[barrage-layer] barrageApp:' + this.player_.options_.barrageApp);
    // this.player_.log('[barrage-layer] barrageItemId:' + this.player_.options_.barrageItemId);
    // this.player_.log('[barrage-layer] barrageConfigUrl:' + this.player_.options_.barrageConfigUrl);
    // this.player_.log('[barrage-layer] barrageContentUrl:' + this.player_.options_.barrageContentUrl);

    if (this.player_.options_.hasBarrage === true && !configLoaded) {
      // 加载配置文件
      loadEmoConfig(this.player_.httpPre_ + this.player_.options_.barrageConfigUrl, this);
    }

    this.currentTimeInSecond_ = -1;
    this.loadCommentTimeInSecond_ = -1;

    // window.requestAnimationFrame = function () {

    // }

    this.lastTime = -1;
    this.totalTime = 0;
    this.counter = 0;

    this.paused = true;

    const layer = this;

    window.requestAnimationFrame(function() {
      layer.updateAnimation();
    });

  }

  updateAnimation() {
    this.counter++;
    const currTime = new Date().getTime();
    let elapsedTime = currTime - this.lastTime;
    // frist time

    if (this.lastTime === -1) {
      elapsedTime = 5;
    }
    this.totalTime += elapsedTime;

    this.lastTime = currTime;

    // this.player_.log('totalTime:' + this.totalTime + 'counter:' + this.counter);

    const barrageDisplayLength = this.barrageDisplay.length;
    let elDisplay;

    for (let i = barrageDisplayLength - 1; i >= 0; i--) {
      elDisplay = this.barrageDisplay[i].el();

      const timeScale = this.player().playbackRate();

      if (this.isVod) {
        if (!this.paused) {
          if (this.FOLLOW_RATE === true) {
            this.barrageDisplay[i].showTime += elapsedTime * timeScale;
          } else {
            this.barrageDisplay[i].showTime += elapsedTime;
          }
        }
      } else {
        // 直播不暂停
        this.barrageDisplay[i].showTime += elapsedTime;
      }

      // 0是左边框，-10px出框一点
      if ((elDisplay.offsetLeft + elDisplay.offsetWidth) > 0) {

        elDisplay.style.left = '' + (this.player_.currentWidth() - this.barrageDisplay[i].distance * this.barrageDisplay[i].showTime / this.SHOW_TIME) + 'px';

      } else {
        this.removeChild(this.barrageDisplay[i]);
        this.barrageDisplay.splice(i, 1);
      }
    }

    // 永远执行
    // !this.paused
    if (true) {
      const layer = this;

      window.requestAnimationFrame(function() {
        layer.updateAnimation();
      });
    }

  }

  play() {
    // this.player_.log('[barrage-layer] play' + this.name());
    this.paused = false;
    this.lastTime = -1;
    // const layer = this;

    // window.requestAnimationFrame(function() {
    //   layer.updateAnimation();
    // });
  }

  pause() {
    // this.player_.log('[barrage-layer] pause' + this);
    this.paused = true;
    this.lastTime = -1;
  }

  open() {

  }

  close() {

  }

  static getEmoList() {
    return emoList;
  }

  static emoPicUrlPre() {
    return picUrl_;
  }

  // this.currentTimeInSecond();

  currentTimeInSecond(value) {
    if (value === undefined) {
      return this.currentTimeInSecond_;
    }
    this.currentTimeInSecond_ = value;

  }

  //
  timeUpdateHandler() {
    if (!configLoaded) {
      return;
    }

    // 广告无弹幕
    if (this.player_.ads && this.player_.ads.isInAdMode() === true) {
      return;
    }

    // 整秒更新时才触发弹幕（降低性能消耗）
    const timeInSecond = Math.round(this.player_.currentTime());

    // 每秒 时间改变
    if (this.currentTimeInSecond() !== timeInSecond) {
      this.currentTimeInSecond(timeInSecond);
      // this.player_.log('[barrage-layer] ' + this.currentTimeInSecond());

      // 点播弹幕弹出逻辑
      if (this.isVod) {
        // 遍历已加载弹幕
        const comLength = this.commentData.length;

        for (let i = comLength - 1; i >= 0; i--) {
          // 达到时间 弹出, 超过5秒的不播放 && this.player_.currentTime()*1000 - this.commentData[i].relative_time > 5*1000
          if (this.commentData[i].relative_time <= this.player_.currentTime() * 1000) {
            // Math.floor(Math.random() * maxLine)
            this.addBarrage(this.commentData[i].message, false);
            this.commentData.splice(i, 1);
          }
        }
      }
      // else if(this.currentTimeInSecond() - this.liveBarrageTimer >= 4) {
      //   // 直播弹幕弹出逻辑
      //   this.liveBarrageTimer = this.currentTimeInSecond();
      //   // 开始一波弹幕，3条
      //   this.player_.log('live barrage' + this.liveBarrageTimer);
      // }
    }

    // 点播弹幕加载逻辑
    if (this.isVod) {
      // 加载点播评论
      if (this.currentTimeInSecond() < 0) {
        return;
      }
      // 未定义弹幕不加载
      if (this.player_.options_.hasBarrage !== true) {
        return;
      }
      if (this.loadCommentTimeInSecond_ === -1 || ((this.loadCommentTimeInSecond_ + this.BARRAGE_TIME_INTERVAL) <= this.currentTimeInSecond())) {

        this.loadCommentTimeInSecond_ = this.currentTimeInSecond();

        const barrageUrl = this.player_.httpPre_ + this.player_.options_.barrageContentUrl +
        'app=' + this.player_.options_.barrageApp +
        '&prepage=' + 1000 +
        '&itemid=' + this.player_.options_.barrageItemId +
        '&relative_time=' + this.loadCommentTimeInSecond_ * 1000 +
        '&relative_end_time=' + (this.loadCommentTimeInSecond_ + this.BARRAGE_TIME_INTERVAL) * 1000;

        loadComments(barrageUrl, this);
      }
    }
    // else {
    // 直播弹幕加载逻辑
    // this.player_.log('show live');
    // this.liveBarrageLoadTimer;
    // }
  }

  liveBarrageLoadTimerHandler() {
    this.liveBarrageLoadCounter++;
    if (this.liveBarrageLoadCounter % 4 === 0) {
      if (this.player().options().debug) {
        this.player_.log('show live');
      }
      if (this.commentData.length > 0) {
        this.addBarrage(this.commentData.pop().message, false, 0);
      }
      if (this.commentData.length > 0) {
        this.addBarrage(this.commentData.pop().message, false, 1);
      }
      if (this.commentData.length > 0) {
        this.addBarrage(this.commentData.pop().message, false, 2);
      }
    }
    if (this.liveBarrageLoadCounter >= 60 || this.liveBarrageLoadCounter === 0) {
      this.liveBarrageLoadCounter = 0;
      // load
      this.player_.log('loadComments live');
      // http://common.newcomment.cntv.cn/comment/list?app=icctv&itemid=cctvdhd2015101437171&prepage=45&nature=1
      const barrageUrl = this.player_.httpPre_ + this.player_.options_.barrageContentUrl +
        'app=' + this.player_.options_.barrageApp +
        '&prepage=' + 45 +
        '&itemid=' + this.player_.options_.barrageItemId +
        '&nature=1';

      loadComments(barrageUrl, this);
    }
  }

  seeking() {
    // 点播清理
    if (this.isVod) {
      // remove all
      this.commentData.length = 0;

      // 移除全部
      while (this.barrageDisplay.length > 0) {
        this.removeChild(this.barrageDisplay.pop());
      }

      // reset this.loadCommentTimeInSecond_
      this.loadCommentTimeInSecond_ = -1;
    } else {
      // 直播不清理
      // this.liveBarrageTimer = this.currentTimeInSecond();
    }
  }

  emoJSON(value) {
    if (value === undefined) {
      return this.emoJSON_;
    }
    this.emoJSON_ = value;
  }

  emoData() {
    return this.emoJSON().data;
  }

  onEmoConfigLoaded() {
    if (this.player().options().debug) {
      this.player_.log('[barrage-layer]  config loaded');
    }

    // this.player_.log(this.emoData());

    if (configLoaded === true) {
      return;
    }
    configLoaded = true;
    picUrl_ = this.emoJSON_.picUrl;
    const dataLength = this.emoData().length;

    for (let i = 0; i < dataLength; i++) {
      // this.player_.log('name:' + this.emoData()[i].name + ' tips:' + this.emoData()[i].tips + ' text:' + this.emoData()[i].text);
      emoList.push(this.emoData()[i]);
    }

    // this.player_.log('' + this.emoPicUrlPre() + '/' + this.emoData()[0]['name']);
    // http://p1.img.cctvpic.com/photoAlbum/templet/common/DEPA1560495072307131/bq04.png
    // 用text匹配
  }

  /**
   * 点播弹幕加载完成
   *
   * @param {*} data
   */
  commentLoaded(data) {
    // 点播解析
    if (this.isVod) {
      if (this.commentData === undefined) {
        return;
      }
      this.commentData.length = 0;

      const commondata_ = JSON.parse(data);
      let commentLength = 0;

      commentLength = commondata_.data.content.length;

      // this.player_.log('[barrage-layer]  commondata_: :' + commondata_);

      for (let i = 0; i < commentLength; i++) {
        // this.player_.log('[barrage-layer] commontsLoaded() message:' + commondata_.data.content[i].message + 'relative_time:' + commondata_.data.content[i].relative_time);
        this.commentData.push(commondata_.data.content[i]);
      }
    } else {
      // 直播解析
      if (this.commentData === undefined) {
        return;
      }
      this.commentData.length = 0;
      const commondata_ = JSON.parse(data);

      let commentLength = 0;

      if (commondata_.data && commondata_.data.content) {
        commentLength = commondata_.data.content.length;
      } else {
        this.player_.log.warn('no live comment data!');
      }

      // this.player_.log('[barrage-layer]  commondata_: :' + commondata_);

      for (let i = 0; i < commentLength; i++) {
        // this.player_.log('[barrage-layer] commontsLoaded() message:' + commondata_.data.content[i].message);
        this.commentData.push(commondata_.data.content[i]);
      }

    }

  }

  showBarrage(massege) {
    if (this.player_.ads && this.player_.ads.isInAdMode() === true) {
      return;
    }
    this.addBarrage(massege, true);
  }

  addBarrage(message, self, line) {
    // if (this.barrageDisplay.length > 0) {
    //   return;
    // }
    // this.player_.log('[barrage-layer] 弹幕：' + message);
    this.narrageIdCounter++;

    // 最大行数
    const maxLine = 3;

    // if (this.options().playerOptions.config !== undefined) {
    //   maxLine = this.options().playerOptions.config.barrage.maxlines;
    // }

    if (line === undefined) {
      line = Math.floor(Math.random() * maxLine);
    }

    const display = new BarrageDisplay(this.player_, this.options_, message, 'b' + this.narrageIdCounter, line, self);

    this.addChild(display);

    // COLORS[0];

    // 每毫秒速度，(播放器宽度 + 字符长度*字符大小) / 行走时间t / 1000
    // display.velocity = (this.player_.currentWidth() + message.length*13)/ 10 /1000;
    // 匀速的，10秒走完

    display.velocity = (this.player_.currentWidth() + display.width()) / this.SHOW_TIME;
    display.distance = this.player_.currentWidth() + display.width();
    display.showTime = 0;

    // this.player_.log('[' + message + ']速度：' + display.velocity + '距离：' + display.distance);

    // 根据字符数判断速度
    // message.length;

    this.barrageDisplay.push(display);
  }

  /**
   * Turn display of {@link TextTrack}'s from the current state into the other state.
   * There are only two states:
   * - 'shown'
   * - 'hidden'
   *
   * @listens Player#loadstart
   */
  toggleDisplay() {
    if (this.player_.tech_ && this.player_.tech_.featuresNativeTextTracks) {
      // this.player_.log('[barrage-layer] toggleDisplay hide()');
      this.hide();
    } else {
      // this.player_.log('[barrage-layer] toggleDisplay show()');
      this.show();
    }
  }

  /**
   * Create the {@link Component}'s DOM element.
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    // return super.createEl('div', {
    //   className: 'vjs-barrage-display'
    // }, {
    //   'aria-live': 'off',
    //   'aria-atomic': 'true'
    // });
    return super.createEl('div', {
      className: 'vjs-barrage-layer'
    });
  }

  /**
   * Update the displayed TextTrack when a either a {@link Player#texttrackchange} or
   * a {@link Player#fullscreenchange} is fired.
   *
   * @listens Player#texttrackchange
   * @listens Player#fullscreenchange
   */
  updateDisplay() {

  }

}

Component.registerComponent('BarrageLayer', BarrageLayer);
export default BarrageLayer;

