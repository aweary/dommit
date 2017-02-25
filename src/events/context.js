// @flow

import { InternalDOMMITError } from '../internal';
import { NONE_EVENT_PHASE } from './index';


/**
 * Event objects only have a single own property,
 * isTrused. We need to track event state without attaching
 * it to the prototype (which is shared) and without attaching
 * it to the instance. To do that we use a WeakMap that associates
 * the event instance with an internal state object.
 */
export const EventInstanceContext = new WeakMap();

/**
 * Initializes an internal context object with flags used
 * to track the state of the event instance.
 * @param {object} instance event instance
 * @param {string} type event type
 * @param {Object} eventInitDict event options
 */
export const initializeContext = (instance, type, eventInitDict = {}) => {
  EventInstanceContext.set(instance, {
      // The event type, e.g., "click" or "keydown"
      type: String(type),
      /**
       * Whether the event has been initialized. When creating events
       * with the Event constructor this should be set to true immediately.
       * When creating events with document.createEvent(...) (deprecated) this
       * must be set to false unit event.initEvent(...) is called. We do not support
       * document.createEvent right now (you shouldnt use it anyways) so
       * we always set to true.
       */
      initialized: true,
      // Whether the event should participate in the bubble phase.
      bubbles: !!eventInitDict.bubbles,
      // Whether the event is cancelable with preventDefault()
      cancelable: !!eventInitDict.bubbles,
      // The element this event was dispatched from
      target: null,
      // The current element in the capture or bubble phase.
      dispatch: false,
      currentTarget: null,
      propagationStopped: false,
      immediatePropagationStopped: false,
      canceled: false,
      composed: false,
      inPassiveListener: false,
      eventPhase: NONE_EVENT_PHASE,
      // event detail, only allowed for instances of CustomEvent
      detail: eventInitDict.detail,
      /**
       * The DOM living standard states that the timeStamp should
       * be the number of milliseconds from the epoch, but currently not
       * all browsers are compliant. Chrome, for example, returns
       * the number of milliseconds since page load (performance.now())
       * @see https://dom.spec.whatwg.org/#dom-event-timestamp
       */
      timeStamp: Date.now()
    });
}

/**
 * Get an internal context attribute value. If no context
 * object exists an internal error is thrown.
 * @param {object} instance event instance
 * @param {string} attribute internal context attribute name
 * @returns {any} attribute value
 */
export const getContextAttribute = (instance, attribute) => {
  if (isCalledFromPrototypeReference(instance)) {
    throw new TypeError("Illegal Invocation");
  }
  const context = EventInstanceContext.get(instance);
  if (!context) {
    throw new InternalDOMMITError(
      `No internal state found for Event instance when accessing [instance].${attribute}`
    );
  }
  return context[attribute];
};

/**
 * Set the value of an internal context attribute. If no context
 * exists an internal error is thrown. If the context does not
 * have the property being set, an internal error is thrown.  
 * @param {object} instance event instance
 * @param {string} attribute internal context attribute name
 * @param {any} value internal context attribute value
 * @returns {any} attribute value
 */
export const setContextAttribute = (instance, attribute, value) => {
  // @TODO make this more sound, i.e., support classes that extend CustomEvent or just dont warn at all
  if (attribute === 'detail' && instance.constructor.name !== 'CustomEvent') {
    console.warn(`
      Warning: the 'detail' event option is meant only for CustomEvent and interaces
      that extend it, not ${instance.constructor.name}. Remove the property from the eventInitDict.
    `)
    return;
  }
  if (isCalledFromPrototypeReference(instance)) {
    throw new TypeError("Illegal Invocation");
  }
  const context = EventInstanceContext.get(instance);
  if (!context) {
    throw new InternalDOMMITError(
      `No internal state found for Event instance when accessing [instance].${attribute}`
    );
  }
  if (!Object.hasOwnProperty.call(context, attribute)) {
    throw new InternalDOMMITError(
      `Cannot set property "${attribute}" on event instance context, as it does not exist. All
      internal context attributes must be initialized when the event is constructed.`
    );
  }
  context[attribute] = value;
}

/**
 * This protects against accessing the type getter from
 * the Event instance's prototype:
 * 
 * @example 
 * var event = new Event('click');
 * var eventPrototype = Object.getPrototypeOf(event);
 * eventPrototype.type // <= should throw Illegal invocation error
 * 
 * The prototype's prototype for an instance would be the global Object
 * prototype. The prototype's prototype for the Event prototype itself
 * will be null.
 */
function isCalledFromPrototypeReference(context) {
  return Object.getPrototypeOf(Object.getPrototypeOf(context)) == null;
};