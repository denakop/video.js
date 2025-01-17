/**
 * @file volume-control.js
 */
import Component from '../../component.js';
import checkVolumeSupport from './check-volume-support';
import {isPlain} from '../../utils/obj';
import {throttle, bind, UPDATE_REFRESH_INTERVAL} from '../../utils/fn.js';

// Required children
import './volume-bar.js';

/**
 * The component for controlling the volume level
 *
 * @extends Component
 */
class VolumeControl extends Component {

  /**
   * Creates an instance of this class.
   *
   * @param {Player} player
   *        The `Player` that this class should be attached to.
   *
   * @param {Object} [options={}]
   *        The key/value store of player options.
   */
  constructor(player, options = {}) {
    options.vertical = options.vertical || false;

    // Pass the vertical option down to the VolumeBar if
    // the VolumeBar is turned on.
    if (typeof options.volumeBar === 'undefined' || isPlain(options.volumeBar)) {
      options.volumeBar = options.volumeBar || {};
      options.volumeBar.vertical = options.vertical;
    }

    super(player, options);

    // hide this control if volume support is missing
    checkVolumeSupport(this, player);

    this.throttledHandleMouseMove = throttle(bind(this, this.handleMouseMove), UPDATE_REFRESH_INTERVAL);
    this.handleMouseUpHandler_ = (e) => this.handleMouseUp(e);

    this.on('mousedown', (e) => this.handleMouseDown(e));
    this.on('touchstart', (e) => this.handleMouseDown(e));
    this.on('mousemove', (e) => this.handleMouseMove(e));

    // while the slider is active (the mouse has been pressed down and
    // is dragging) or in focus we do not want to hide the VolumeBar
    this.on(this.volumeBar, ['focus', 'slideractive'], () => {
      this.volumeBar.addClass('dk-vjs-slider-active');
      this.addClass('dk-vjs-slider-active');
      this.trigger('slideractive');
    });

    this.on(this.volumeBar, ['blur', 'sliderinactive'], () => {
      this.volumeBar.removeClass('dk-vjs-slider-active');
      this.removeClass('dk-vjs-slider-active');
      this.trigger('sliderinactive');
    });
  }

  /**
   * Create the `Component`'s DOM element
   *
   * @return {Element}
   *         The element that was created.
   */
  createEl() {
    let orientationClass = 'dk-vjs-volume-horizontal';

    if (this.options_.vertical) {
      orientationClass = 'dk-vjs-volume-vertical';
    }

    return super.createEl('div', {
      className: `dk-vjs-volume-control dk-vjs-control ${orientationClass}`
    });
  }

  /**
   * Handle `mousedown` or `touchstart` events on the `VolumeControl`.
   *
   * @param {EventTarget~Event} event
   *        `mousedown` or `touchstart` event that triggered this function
   *
   * @listens mousedown
   * @listens touchstart
   */
  handleMouseDown(event) {
    const doc = this.el_.ownerDocument;

    this.on(doc, 'mousemove', this.throttledHandleMouseMove);
    this.on(doc, 'touchmove', this.throttledHandleMouseMove);
    this.on(doc, 'mouseup', this.handleMouseUpHandler_);
    this.on(doc, 'touchend', this.handleMouseUpHandler_);
  }

  /**
   * Handle `mouseup` or `touchend` events on the `VolumeControl`.
   *
   * @param {EventTarget~Event} event
   *        `mouseup` or `touchend` event that triggered this function.
   *
   * @listens touchend
   * @listens mouseup
   */
  handleMouseUp(event) {
    const doc = this.el_.ownerDocument;

    this.off(doc, 'mousemove', this.throttledHandleMouseMove);
    this.off(doc, 'touchmove', this.throttledHandleMouseMove);
    this.off(doc, 'mouseup', this.handleMouseUpHandler_);
    this.off(doc, 'touchend', this.handleMouseUpHandler_);
  }

  /**
   * Handle `mousedown` or `touchstart` events on the `VolumeControl`.
   *
   * @param {EventTarget~Event} event
   *        `mousedown` or `touchstart` event that triggered this function
   *
   * @listens mousedown
   * @listens touchstart
   */
  handleMouseMove(event) {
    this.volumeBar.handleMouseMove(event);
  }
}

/**
 * Default options for the `VolumeControl`
 *
 * @type {Object}
 * @private
 */
VolumeControl.prototype.options_ = {
  children: [
    'volumeBar'
  ]
};

Component.registerComponent('VolumeControl', VolumeControl);
export default VolumeControl;
