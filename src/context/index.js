// @flow
import { InternalDOMMITError } from "../internal";
/** @todo should this live in the context module? **/
import { isCalledFromPrototypeReference } from "../utils";

export default function createContextManagementSystem() {
  const InternalInstanceContext = new WeakMap();

  /**
   * Returns the property value with the key `name` for
   * the provided instance.
   * @param {Object} instance
   * @param {String} name property name
   */
  const getContextPropertyValue = (instance, name) => {
    if (isCalledFromPrototypeReference(instance)) {
      throw new TypeError("Illegal Invocation");
    }
    const context = InternalInstanceContext.get(instance);
    if (!context) {
      throw new InternalDOMMITError(
        `No internal state found for Node instance when accessing [instance].${name}`
      );
    }
    return context[name];
  };
  /**
 * Set the value of an internal context property. If no context
 * exists an internal error is thrown. If the context does not
 * have the property being set, an internal error is thrown.  
 * @param {object} instance instance
 * @param {string} name internal context property name
 * @param {any} value internal context property value
 * @returns {any} attribute value
 */
  const setContextPropertyValue = (instance, name, value) => {
    if (isCalledFromPrototypeReference(instance)) {
      throw new TypeError("Illegal Invocation");
    }
    const context = InternalInstanceContext.get(instance);
    if (!context) {
      throw new InternalDOMMITError(
        `No internal state found for instance when accessing [instance].${name}`
      );
    }
    if (!Object.hasOwnProperty.call(context, name)) {
      throw new InternalDOMMITError(
        `Cannot set property "${name}" on event instance context, as it does not exist. All
      internal context properties must be initialized when the event is constructed.`
      );
    }
    context[name] = value;
  };

  const createContext = (instance, properties) => {
    InternalInstanceContext.set(instance, properties);
  }

  return {
    InternalInstanceContext,
    getContextPropertyValue,
    setContextPropertyValue,
    createContext
  };
}
