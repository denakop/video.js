/**
 * @file button.js
 */
import ClickableComponent from './clickable-component.js';
import Component from './component';
import log from './utils/log.js';
import {assign} from './utils/obj';
import keycode from 'keycode';
import {createEl} from './utils/dom.js';

/**
 * Base class for all buttons.
 *
 * @extends ClickableComponent
 */
class Button extends ClickableComponent {

  /**
   * Create the `Button`s DOM element.
   *
   * @param {string} [tag="button"]
   *        The element's node type. This argument is IGNORED: no matter what
   *        is passed, it will always create a `button` element.
   *
   * @param {Object} [props={}]
   *        An object of properties that should be set on the element.
   *
   * @param {Object} [attributes={}]
   *        An object of attributes that should be set on the element.
   *
   * @return {Element}
   *         The element that gets created.
   */
  createEl(tag, props = {}, attributes = {}) {
    tag = 'button';

    props = assign({
      className: this.buildCSSClass()
    }, props);

    // Add attributes for button element
    attributes = assign({

      // Necessary since the default button type is "submit"
      type: 'button'
    }, attributes);

    const el = createEl(tag, props, attributes);

    el.appendChild(createEl('span', {
      className: 'dk-vjs-icon-placeholder'
    }, {
      'aria-hidden': true
    }));

    this.createControlTextEl(el);

    return el;
  }

  /**
   * Add a child `Component` inside of this `Button`.
   *
   * @param {string|Component} child
   *        The name or instance of a child to add.
   *
   * @param {Object} [options={}]
   *        The key/value store of options that will get passed to children of
   *        the child.
   *
   * @return {Component}
   *         The `Component` that gets added as a child. When using a string the
   *         `Component` will get created by this process.
   *
   * @deprecated since version 5
   */
  addChild(child, options = {}) {
    const className = this.constructor.name;

    log.warn(`Adding an actionable (user controllable) child to a Button (${className}) is not supported; use a ClickableComponent instead.`);

    // Avoid the error message generated by ClickableComponent's addChild method
    return Component.prototype.addChild.call(this, child, options);
  }

  /**
   * Enable the `Button` element so that it can be activated or clicked. Use this with
   * {@link Button#disable}.
   */
  enable() {
    super.enable();
    this.el_.removeAttribute('disabled');
  }

  /**
   * Disable the `Button` element so that it cannot be activated or clicked. Use this with
   * {@link Button#enable}.
   */
  disable() {
    super.disable();
    this.el_.setAttribute('disabled', 'disabled');
  }

  /**
   * This gets called when a `Button` has focus and `keydown` is triggered via a key
   * press.
   *
   * @param {EventTarget~Event} event
   *        The event that caused this function to get called.
   *
   * @listens keydown
   */
  handleKeyDown(event) {

    // Ignore Space or Enter key operation, which is handled by the browser for
    // a button - though not for its super class, ClickableComponent. Also,
    // prevent the event from propagating through the DOM and triggering Player
    // hotkeys. We do not preventDefault here because we _want_ the browser to
    // handle it.
    if (keycode.isEventKey(event, 'Space') || keycode.isEventKey(event, 'Enter')) {
      event.stopPropagation();
      return;
    }

    // Pass keypress handling up for unsupported keys
    super.handleKeyDown(event);
  }
}

Component.registerComponent('Button', Button);
export default Button;
