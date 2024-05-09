/**
 * @file control-bar.js
 */
import Component from '../component.js';

// Required children
import './play-toggle.js';
import './time-controls/current-time-display.js';
import './time-controls/duration-display.js';
import './time-controls/time-divider.js';
import './time-controls/remaining-time-display.js';
import './live-display.js';
import './seek-to-live.js';
import './progress-control/progress-control.js';
import './picture-in-picture-toggle.js';
import './fullscreen-toggle.js';
import './volume-panel.js';
import './skip-buttons/skip-forward.js';
import './skip-buttons/skip-backward.js';
import './text-track-controls/chapters-button.js';
import './text-track-controls/descriptions-button.js';
import './text-track-controls/subtitles-button.js';
import './text-track-controls/captions-button.js';
import './text-track-controls/subs-caps-button.js';
import './audio-track-controls/audio-track-button.js';
import './playback-rate-menu/playback-rate-menu-button.js';
import './spacer-controls/custom-control-spacer.js';
import './next/next-panel.js';
import './webfullscreen-toggle.js';
import './setup-menu/setup-menubutton.js';
import './choose-video/choose-video-button.js';
import './audio-mode-controls/audio-mode-button.js';
import './playback-quality-menu/playback-quality-menu-button.js';
import './preview/preview-display.js';

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
    'skipBackward',
    'skipForward',
    'nextPanel',
    'currentTimeDisplay',
    'timeDivider',
    'durationDisplay',
    'liveDisplay',
    'seekToLive',
    'remainingTimeDisplay',
    'customControlSpacer',
    'chooseVideoButton',
    'audioModeButton',
    'playbackRateMenuButton',
    'playbackQualityMenuButton',
    'descriptionsButton',
    'subsCapsButton',
    'audioTrackButton',
    'pictureInPictureToggle',
    'setupMenuButton',
    'volumePanel',
    'webfullscreenToggle',
    'fullscreenToggle',
    'progressControl',
    'previewDisplay'
  ]
};

Component.registerComponent('ControlBar', ControlBar);
export default ControlBar;
