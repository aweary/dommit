import {
  createContext,
  getContextPropertyValue,
  setContextPropertyValue
} from "./context";

export default class NamedNodeMap {
  constructor() {
    createContext(this, {
      // A NamedNodeMap always has an associated element
      element: arguments[0],
      length: 0,
      _attributeNameIndexMap: {}
    });
  }
  /**
   * The length attribute’s getter must return the number ofattributes
   * in the attribute list.
   * @see https://dom.spec.whatwg.org/#dom-namednodemap-length
   */
  get length() {
    return getContextPropertyValue(this, "length");
  }
  /**
   * The item(index) method, when invoked, must run these steps:
   *  1. If index is equal to or greater than the number of attributes
   *     in the attribute list, return null.
   *  2. Otherwise, return the indexth attribute in the attribute list.
   * @see https://dom.spec.whatwg.org/#dom-namednodemap-item
   */
  item(index) {
    // Return null for out of bound indicies
    if (index < 0 || index > this.length) {
      return null;
    }
    return this[index] || null;
  }
  /**
   * The getNamedItem(qualifiedName) method, when invoked, must return the result
   * of getting an attribute given qualifiedName and element.
   * @see https://dom.spec.whatwg.org/#dom-namednodemap-getnameditem
   */
  getNamedItem(qualifiedName) {
    /**
     * @todo qualifiedName should only be cast to lowercase
     * if the element is using the HTML namespace.
     * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-name
     */
    qualifiedName = qualifiedName.toLowerCase();
    const attributeNameIndexMap = getContextPropertyValue(
      this,
      "_attributeNameIndexMap"
    );
    const index = attributeNameIndexMap[`::${qualifiedName}`];
    return this[index] || null;
  }
  /**
   * The getNamedItemNS(namespace, localName) method, when invoked, must return the
   * result of getting an attribute given namespace, localName, and element.
   * @see https://dom.spec.whatwg.org/#dom-namednodemap-getnameditemns
   */
  getNamedItemNS(namespace, localName) {
    if (namespace == "") {
      namespace = null;
    }
    // Just use getNameItem if the namespace is not provided.
    if (namespace == null) {
      return this.getNamedItem(localName);
    }
    /**
     * @todo this doesn't account for attributes that might have
     * the same name, but different namespace.
     */
    const _attributeNameIndexMap = getContextPropertyValue(
      this,
      "_attributeNameIndexMap"
    );
    const index = _attributeNameIndexMap[`${namespace || ""}::${localName}`];
    const item = this[index];
    return item
      ? this[index].namespaceURI === namespace ? this[index] : null
      : null;
  }
  /**
   * The setNamedItem(attr) method, when invoked, must return the result of setting an
   * attribute given attr and element. Rethrow any exceptions.
   * @see https://dom.spec.whatwg.org/#dom-namednodemap-setnameditem
   */
  setNamedItem(attr) {
    /** @todo check that attr is actually an Attribute node */
    const oldAttr = this.getNamedItem(attr.localName);
    if (oldAttr === attr) {
      return attr;
    }
    const _attributeNameIndexMap = getContextPropertyValue(
      this,
      "_attributeNameIndexMap"
    );
    if (oldAttr !== null) {
      /**
       * @todo queue a mutation record of "attributes" once the
       * mutation record queue is actually implemented.
       */
      const index = _attributeNameIndexMap[`::${oldAttr.localName}`];
      this[index] = attr;
    } else {
      const index = getContextPropertyValue(this, "length");
      _attributeNameIndexMap[`::${attr.localName}`] = index;
      this[index] = attr;
      setContextPropertyValue(this, "length", index + 1);
    }
    return oldAttr;
  }
  /**
   * The setNamedItemNS(attr) method, when invoked, must return the result of setting an
   * attribute given attr and element. Rethrow any exceptions.
   * @see https://dom.spec.whatwg.org/#dom-namednodemap-setnameditemns
   */
  setNamedItemNS(attr) {
    /** @todo check that attr is actually an Attribute node */
    const oldAttr = this.getNamedItemNS(attr.namespaceURI, attr.localName);
    if (oldAttr === attr) {
      return attr;
    }
    const _attributeNameIndexMap = getContextPropertyValue(
      this,
      "_attributeNameIndexMap"
    );
    if (oldAttr !== null) {
      /**
       * @todo queue a mutation record of "attributes" once the
       * mutation record queue is actually implemented.
       */
      const index = _attributeNameIndexMap[
        `${oldAttr.namespaceURI || ""}::${oldAttr.localName}`
      ];
      this[index] = attr;
    } else {
      const index = getContextPropertyValue(this, "length");
      _attributeNameIndexMap[
        `${attr.namespaceURI || ""}::${attr.localName}`
      ] = index;
      this[index] = attr;
      setContextPropertyValue(this, "length", index + 1);
    }
    return oldAttr;
  }
  /**
   * The removeNamedItem(qualifiedName) method, when invoked, must run these steps:
   *  1. Let attr be the result of removing an attribute given qualifiedName and element.
   *  2. If attr is null, then throw a NotFoundError.
   *  3. Return attr.
   * @see https://dom.spec.whatwg.org/#dom-namednodemap-removenameditem
   */
  removeNamedItem(qualifiedName) {
    const item = this.getNamedItem(qualifiedName);
    if (item === null) {
      /**
       * @todo this should be DOMException not Error, define a DOMException
       * error class that we can use.
       */
      throw new Error(
        `Failed to execute 'removeNamedItem' on 'NamedNodeMap': No item ` +
          `with the name '${qualifiedName}' was found.`
      );
    }
    /**
     * @todo this should queue a mutation record to remove the attribute
     * from the associated element.
     */
    const _attributeNameIndexMap = getContextPropertyValue(
      this,
      "_attributeNameIndexMap"
    );

    const index = _attributeNameIndexMap[`::${qualifiedName}`];
    console.log({ index });

    /**
     * A NamedNodeMap is array-like so we can call Array.prototype.slice
     * on it to get an array of the attributes. We then splice out the item
     * being removed and then iterate through each attribute to update their
     * index.
     * @todo this is wasteful, we dont need to iterate every item. Make this
     * more performant.
     */
    const attributes = Array.prototype.slice.call(this, 0);
    attributes.splice(index, 1);
    // Just remove every item because we're going to redefine them anyways
    Object.keys(this).forEach(index => {
      delete this[index];
    });
    attributes.forEach((attr, i) => {
      this[i] = attr;
      _attributeNameIndexMap[
        `${attr.namespaceURI || ""}::${attr.localName}`
      ] = i;
    });
    console.log(attributes);
    setContextPropertyValue(this, "length", attributes.length);
  }
  /**
   * The removeNamedItemNS(qualifiedName, localName) method, when invoked, must run these steps:
   *  1. Let attr be the result of removing an attribute given namespace, qualifiedName and element.
   *  2. If attr is null, then throw a NotFoundError.
   *  3. Return attr.
   * @see https://dom.spec.whatwg.org/#dom-namednodemap-removenameditemns
   */
  removeNamedItemNS(namespace, localName) {
    const attr = this.getNamedItemNS(namespace, localName);
    if (attr === null) {
      /**
       * @todo this should be DOMException not Error, define a DOMException
       * error class that we can use.
       */
      throw new Error(
        `Failed to execute 'removeNamedItemNS' on 'NamedNodeMap': No item ` +
          `with the name '${namespace}::${localName}' was found.`
      );
    }
    /**
     * @todo this should queue a mutation record to remove the attribute
     * from the associated element.
     */
    const _attributeNameIndexMap = getContextPropertyValue(
      this,
      "_attributeNameIndexMap"
    );

    const index = _attributeNameIndexMap[`${namespace || ""}::${localName}`];

    /**
     * A NamedNodeMap is array-like so we can call Array.prototype.slice
     * on it to get an array of the attributes. We then splice out the item
     * being removed and then iterate through each attribute to update their
     * index.
     * @todo this is wasteful, we dont need to iterate every item. Make this
     * more performant.
     */
    const attributes = Array.prototype.slice.call(this, 0);
    attributes.splice(index, 1);
    // Just remove every item because we're going to redefine them anyways
    Object.keys(this).forEach(index => {
      delete this[index];
    });
    attributes.forEach((attr, i) => {
      this[i] = attr;
      _attributeNameIndexMap[
        `${attr.namespaceURI || ""}::${attr.localName}`
      ] = i;
    });
    setContextPropertyValue(this, "length", attributes.length);
  }
}
