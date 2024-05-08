/**
 * 改造自 jsonp
 * 实现广告曝光需求：跨域动态加载 且 返回的部分内容是图片格式
 */

import document from 'global/document';
import window from 'global/window';

// var debug = require('debug')('jsonp');

/**
 * Module exports.
 */

// module.exports = jsonpImg;

/**
 * Callback index.
 */

let count = 0;

/**
 * Noop function.
 */

function noop() {}

/**
 * JSONP handler
 *
 * Options:
 *  - param {String} qs parameter (`callback`)
 *  - prefix {String} qs parameter (`__jp`)
 *  - name {String} qs parameter (`prefix` + incr)
 *  - timeout {Number} how long after a timeout error is emitted (`60000`)
 *
 * @param {String} url
 * @param {Object|Function} optional options / callback
 * @param {Function} optional callback
 */

export const jsonpImg = function(url, opts, fn) {
  if (typeof opts === 'function') {
    fn = opts;
    opts = {};
  }
  if (!opts) {
    opts = {};
  }

  const prefix = opts.prefix || '__jp';

  // use the callback name that was passed if one was provided.
  // otherwise generate a unique name by incrementing our counter.
  const id = opts.name || (prefix + (count++) + Math.random());

  const param = opts.param || 'callback';
  const timeout = opts.timeout ? opts.timeout : 60000;
  const enc = encodeURIComponent;
  const target = document.getElementsByTagName('script')[0] || document.head;
  let imgTag;
  let timer;

  if (timeout) {
    timer = setTimeout(function() {
      cleanup();
      if (fn) {
        fn(new Error('Timeout'));
      }
    }, timeout);
  }

  function cleanup() {
    if (imgTag.parentNode) {
      imgTag.parentNode.removeChild(imgTag);
    }
    window[id] = noop;
    if (timer) {
      clearTimeout(timer);
    }
  }

  function cancel() {
    if (window[id]) {
      cleanup();
    }
  }

  window[id] = function(data) {
    // debug('jsonp got', data);
    cleanup();
    if (fn) {
      fn(null, data);
    }
  };

  // add qs component
  url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc(id);
  url = url.replace('?&', '?');

  //   debug('jsonp req "%s"', url);

  // create script
  imgTag = document.createElement('img');
  imgTag.src = url;
  // imgTag.width = 0;
  // imgTag.height = 0;
  imgTag.style.display = 'none';
  target.parentNode.insertBefore(imgTag, target);

  return cancel;
};

export default jsonpImg;
