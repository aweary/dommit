

/**
 * Extend a target class with a source class, while also preserving
 * the constructor and allowing us to add additional accessor properties,
 * which are a common pattern with the abstract classes we define.
 */





export function inherits(TargetClass, SourceClass, propertiesObject) {
  Object.assign(propertiesObject, {
    constructor: {
      value: TargetClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  TargetClass.prototype = Object.create(
    SourceClass.prototype,
    propertiesObject
  );
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
 * 
 * @todo move this into a shared utility file
 */
export function isCalledFromPrototypeReference(context) {
  return Object.getPrototypeOf(Object.getPrototypeOf(context)) == null;
}
