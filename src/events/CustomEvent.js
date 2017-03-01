// @flow
import type {EventInit} from './Event';
import {getContextPropertyValue, setContextPropertyValue} from './context';
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
    return getContextPropertyValue(this, "detail");
  }

  initCustomEvent(type, bubbles, cancelable, detail) {
    setContextPropertyValue(this, "type", type);
    setContextPropertyValue(this, "bubbles", bubbles);
    setContextPropertyValue(this, "cancelable", cancelable);
    setContextPropertyValue(this, "detail", detail);
  }
}
