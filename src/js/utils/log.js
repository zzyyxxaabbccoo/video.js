/**
 * @file log.js
 * @module log
 */
import CreateLogger from './create-logger.js';
import {playerversion} from '../../../package.json';
import {updatedate} from '../../../package.json';
import window from 'global/window';

const log = CreateLogger('VIDEOJS');
const createLogger = log.createLogger;

window.console.log('%ccore:v' + '' + playerversion + '.' + updatedate, 'color: #1296db');

export default log;
export { createLogger };
