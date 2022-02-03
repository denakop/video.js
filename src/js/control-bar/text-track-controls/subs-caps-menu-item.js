/**
 * @file subs-caps-menu-item.js
 */
import TextTrackMenuItem from './text-track-menu-item.js';
import Component from '../../component.js';
import {createEl} from '../../utils/dom.js';

/**
 * SubsCapsMenuItem has an [cc] icon to distinguish captions from subtitles
 * in the SubsCapsMenu.
 *
 * @extends TextTrackMenuItem
 */
class SubsCapsMenuItem extends TextTrackMenuItem {

  createEl(type, props, attrs) {
    const el = super.createEl(type, props, attrs);
    const parentSpan = el.querySelector('.dk-vjs-menu-item-text');

    if (this.options_.track.kind === 'captions') {
      parentSpan.appendChild(createEl('span', {
        className: 'dk-vjs-icon-placeholder'
      }, {
        'aria-hidden': true
      }));
      parentSpan.appendChild(createEl('span', {
        className: 'dk-vjs-control-text',
        // space added as the text will visually flow with the
        // label
        textContent: ` ${this.localize('Captions')}`
      }));
    }

    return el;
  }
}

Component.registerComponent('SubsCapsMenuItem', SubsCapsMenuItem);
export default SubsCapsMenuItem;
