// @flow
import type {EventInit} from './Event';
import {getContextAttribute, setContextAttribute} from './context';
import Event from "./Event";

export type CustomEventInit =
  & EventInit
  & {
    detail: any
  };

export default class CustomEvent extends Event {
  constructor(type, eventInitDict) {
    // If no arguments are provided to the CustomEvent constructor
    // then we want to pass none to super() so it throws the right error.
    if (arguments.length === 0) {
      super();
    }
    super(type, eventInitDict);
  }

  get detail() {
    return getContextAttribute(this, "detail");
  }

  initCustomEvent(type, bubbles, cancelable, detail) {
    setContextAttribute(this, "type", type);
    setContextAttribute(this, "bubbles", bubbles);
    setContextAttribute(this, "cancelable", cancelable);
    setContextAttribute(this, "detail", detail);
  }
}
