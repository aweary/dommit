// @flow
/**
 * @todo abstract this into a utility that can be used to track
 * context data on any instance, e.g., createContextManagementSystem(...)
 */
import { InternalDOMMITError } from "../internal";

export const NodeInstanceContext = new WeakMap();

/**
 * Initializes an internal context object with flags used
 * to track the state of the event instance.
 * @param {object} instance node instance
 * @param {string} type event type
 * @param {Object} eventInitDict event options
 */
export const initializeContext = (instance, state) => {
  NodeInstanceContext.set(
    instance,
    // Use Object.assign so we do not mutate the initialization state
    Object.assign({}, state)
  );
};

/**
 * Get an internal context attribute value. If no context
 * object exists an internal error is thrown.
 * @param {object} instance node instance
 * @param {string} attribute internal context attribute name
 * @returns {any} attribute value
 */
export const getContextAttribute = (instance, attribute) => {
  if (isCalledFromPrototypeReference(instance)) {
    throw new TypeError("Illegal Invocation");
  }
  const context = NodeInstanceContext.get(instance);
  if (!context) {
    throw new InternalDOMMITError(
      `No internal state found for Node instance when accessing [instance].${attribute}`
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
  if (attribute === "detail" && instance.constructor.name !== "CustomEvent") {
    console.warn(
      `
      Warning: the 'detail' event option is meant only for CustomEvent and interaces
      that extend it, not ${instance.constructor.name}. Remove the property from the eventInitDict.
    `
    );
    return;
  }
  if (isCalledFromPrototypeReference(instance)) {
    throw new TypeError("Illegal Invocation");
  }
  const context = NodeInstanceContext.get(instance);
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
};

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
 * 
 * @todo move this into a shared utility file
 */
function isCalledFromPrototypeReference(context) {
  return Object.getPrototypeOf(Object.getPrototypeOf(context)) == null;
}
