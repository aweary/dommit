// @flow
import type { DOMString } from "../core";

import {
  getContextPropertyValue,
  setContextPropertyValue,
  createContext
} from "./context";

export type EventInit = {
  bubbles: boolean,
  cancelable: boolean,
  composed: boolean
};

/**
 * Event phases with *slightly* adjusted names
 * so that they can be imported in other contexts
 * without confusion.
 */
export const NONE_EVENT_PHASE = 0;
export const CAPTURING_EVENT_PHASE = 1;
export const AT_TARGET_EVENT_PHASE = 2;
export const BUBBLING_EVENT_PHASE = 3;

export default class Event {
  static NONES = NONE_EVENT_PHASE;
  static CAPTURING_PHASEZ = CAPTURING_EVENT_PHASE;
  static AT_TARGET = AT_TARGET_EVENT_PHASE;
  static BUBBLING_PHASE = BUBBLING_EVENT_PHASE;

  constructor(type, eventInitDict) {
    if (arguments.length === 0) {
      throw new TypeError(
        `Failed to construct '${this.constructor.name}': 1 argument required, but only 0 present.`
      );
    }
    createContext(this, { type, eventInitDict });
    /**
     * @todo actually when this should and should not be trusted.
     * This is the only enumerable own property the event should have.
     */
    this.isTrusted = true;
  }

  get target() {
    return getContextPropertyValue(this, "target");
  }

  get currentTarget() {
    return getContextPropertyValue(this, "currentTarget");
  }

  get type() {
    return getContextPropertyValue(this, "type");
  }

  get eventPhase() {
    return getContextPropertyValue(this, "eventPhase");
  }

  /**
   * Historical alias of stopPropagation
   */
  get cancelBubble() {
    // TODO calling stopPropagation() should not set the [instance].cancelBubble
    // property to true implicitly. Track this separately.
    return getContextPropertyValue(this, "propagationStopped");
  }

  set cancelBubble(value) {
    setContextPropertyValue(this, "propagationStopped", Boolean(value));
  }

  get bubbles() {
    return getContextPropertyValue(this, "bubbles");
  }

  get cancelable() {
    return getContextPropertyValue(this, "cancelable");
  }

  get defaultPrevented() {
    return getContextPropertyValue(this, "canceled");
  }

  get composed() {
    return getContextPropertyValue(this, "composed");
  }

  get timeStamp() {
    return getContextPropertyValue(this, "timestamp");
  }

  composedPath() {
    // @TODO implement composedPath per the spec:
    // https://dom.spec.whatwg.org/#dom-event-composedpath
  }

  stopPropagation() {
    setContextPropertyValue(this, "propagationStopped", true);
  }

  stopImmediatePropagation() {
    setContextPropertyValue(this, "propagationStopped", true);
    setContextPropertyValue(this, "immediatePropagationStopped", true);
  }

  /**
   * If invoked when the cancelable attribute value is true, and while executing a listener for
   * the event with passive set to false, signals to the operation that caused event to be dispatched
   * that it needs to be canceled.
   * @see https://dom.spec.whatwg.org/#dom-event-preventdefault
   */
  preventDefault() {
    const cancelable = this.cancelable;
    const inPassiveListener = getContextPropertyValue(this, "inPassiveListener");
    // @TODO is !inPassiveListener enough?
    if (cancelable && !inPassiveListener) {
      setContextPropertyValue(this, "canceled", true);
    }
  }
}
