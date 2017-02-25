

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