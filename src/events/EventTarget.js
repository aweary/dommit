// @flow
import type { DOMString } from "../core";
import Event from "./Event";

export type EventListenerOptions = {
  capture: boolean
};

export type EventListener = (event: Event) => void;

export type $EventTarget = {
  addEventListener: (
    type: DOMString,
    callback?: EventListener,
    options?: EventListenerOptions
  ) => void,
  removeEventListener: (
    type: DOMString,
    callback?: EventListener,
    options?: EventListenerOptions
  ) => void,
  dispatchEvent: (event: Event) => void,
};

/**
 * EventTarget is an abstract interface/class that still
 * exists as a global function. It can not be used directly
 * and should throw if invoked or constructed.
 */
export default class EventTarget {
  constructor() {
    throw new TypeError("Illegal constructor");
  }
}
