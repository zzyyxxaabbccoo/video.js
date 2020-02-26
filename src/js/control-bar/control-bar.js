/**
 * @file control-bar.js
 */
import Component from '../component.js';
import document from 'global/document';

// Required children
import './play-toggle.js';
// import './next-button.js';
import './next/next-panel.js';
import './time-controls/current-time-display.js';
import './time-controls/duration-display.js';
import './time-controls/time-divider.js';
import './time-controls/remaining-time-display.js';
import './live-display.js';
import './seek-to-live.js';
import './progress-control/progress-control.js';
import './picture-in-picture-toggle.js';
import './webfullscreen-toggle.js';
import './fullscreen-toggle.js';
import './volume-panel.js';
// import './setup-button.js';
import './setup-menu/Setup-menubutton.js'
import './text-track-controls/chapters-button.js';
import './text-track-controls/descriptions-button.js';
import './text-track-controls/subtitles-button.js';
import './text-track-controls/captions-button.js';
import './text-track-controls/subs-caps-button.js';
import './audio-track-controls/audio-track-button.js';
import './playback-rate-menu/playback-rate-menu-button.js';
import './playback-quality-menu/playback-quality-menu-button.js';
import './spacer-controls/custom-control-spacer.js';

/**
 * Container of main controls.
 *
 * @extends Component
 */
class ControlBar extends Component {

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    return super.createEl('div', {
      className: 'vjs-control-bar',
      dir: 'ltr'
    });
  }
}

/**
 * Default options for `ControlBar`
 *
 * @type {Object}
 * @private
 */
ControlBar.prototype.options_ = {
  children: [
    'playToggle',
    // 'nextButton',
    'nextPanel',
    // 'volumePanel',
    'currentTimeDisplay',
    'timeDivider',
    'durationDisplay',
    // 'progressControl',
    'liveDisplay',
    'seekToLive',
    'remainingTimeDisplay',
    'customControlSpacer',
    'playbackRateMenuButton',
    'playbackQualityMenuButton',
    'chaptersButton',
    'descriptionsButton',
    'subsCapsButton',
    'audioTrackButton',
    'setupMenuButton',
    'volumePanel',
    'webfullscreenToggle',
    'fullscreenToggle',
    'progressControl'
  ]
};

if ('exitPictureInPicture' in document) {
//   ControlBar.prototype.options_.children.splice(
//     ControlBar.prototype.options_.children.length - 1,
//     0,
//     'pictureInPictureToggle'
//   );
}

Component.registerComponent('ControlBar', ControlBar);
export default ControlBar;
