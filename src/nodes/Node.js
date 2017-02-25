// @flow
import {
  EventTarget
} from "../events";
import {
  internalBrowsingContextState,
  InternalDOMMITError
} from "../internal";
import {
  getContextAttribute,
  setContextAttribute
} from "./context";
import {
  inherits
} from "../utils";

export const ELEMENT_NODE = 1;
export const ATTRIBUTE_NODE = 2;
export const TEXT_NODE = 3;
export const CDATA_SECTION_NODE = 4;
export const ENTITY_REFERENCE_NODE = 5; // historical
export const ENTITY_NODE = 6; // historical
export const PROCESSING_INSTRUCTION_NODE = 7;
export const COMMENT_NODE = 8;
export const DOCUMENT_NODE = 9;
export const DOCUMENT_TYPE_NODE = 10;
export const DOCUMENT_FRAGMENT_NODE = 1;
export const NOTATION_NODE = 12; // historical

export const DOCUMENT_POSITION_DISCONNECTED = 0x01;
export const DOCUMENT_POSITION_PRECEDING = 0x02;
export const DOCUMENT_POSITION_FOLLOWING = 0x04;
export const DOCUMENT_POSITION_CONTAINS = 0x08;
export const DOCUMENT_POSITION_CONTAINED_BY = 0x10;
export const DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 0x20;

class Node {
  static ELEMENT_NODE = ELEMENT_NODE;
  static ATTRIBUTE_NODE = ATTRIBUTE_NODE;
  static TEXT_NODE = TEXT_NODE;
  static CDATA_SECTION_NODE = CDATA_SECTION_NODE;
  static ENTITY_REFERENCE_NODE = ENTITY_REFERENCE_NODE;
  static ENTITY_NODE = ENTITY_NODE;
  static PROCESSING_INSTRUCTION_NODE = PROCESSING_INSTRUCTION_NODE;
  static COMMENT_NODE = COMMENT_NODE;
  static DOCUMENT_NODE = DOCUMENT_NODE;
  static DOCUMENT_TYPE_NODE = DOCUMENT_TYPE_NODE;
  static DOCUMENT_FRAGMENT_NODE = DOCUMENT_FRAGMENT_NODE;
  static NOTATION_NODE = NOTATION_NODE;

  static DOCUMENT_POSITION_DISCONNECTED = DOCUMENT_POSITION_DISCONNECTED;
  static DOCUMENT_POSITION_PRECEDING = DOCUMENT_POSITION_PRECEDING;
  static DOCUMENT_POSITION_FOLLOWING = DOCUMENT_POSITION_FOLLOWING;
  static DOCUMENT_POSITION_CONTAINS = DOCUMENT_POSITION_CONTAINS;
  static DOCUMENT_POSITION_CONTAINED_BY = DOCUMENT_POSITION_CONTAINED_BY;
  static DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  constructor() {
    throw new TypeError("Illegal constructor");
  }
}

inherits(Node, EventTarget, {
  constructor: {
    value: Node,
    enumerable: false,
    writable: true,
    configurable: true,
  },
  // Node types!
  ELEMENT_NODE: {
    writable: false,
    enumerable: true,
    configurable: true,
    value: ELEMENT_NODE,
  },
  ATTRIBUTE_NODE: {
    writable: false,
    enumerable: true,
    configurable: true,
    value: ATTRIBUTE_NODE,
  },
  TEXT_NODE: {
    writable: false,
    enumerable: true,
    configurable: true,
    value: TEXT_NODE,
  },
  CDATA_SECTION_NODE: {
    writable: false,
    enumerable: true,
    configurable: true,
    value: CDATA_SECTION_NODE,
  },
  ENTITY_REFERENCE_NODE: {
    writable: false,
    enumerable: true,
    configurable: true,
    value: ENTITY_REFERENCE_NODE,
  },
  ENTITY_NODE: {
    writable: false,
    enumerable: true,
    configurable: true,
    value: ENTITY_NODE,
  },
  PROCESSING_INSTRUCTION_NODE: {
    writable: false,
    enumerable: true,
    configurable: true,
    value: PROCESSING_INSTRUCTION_NODE,
  },
  COMMENT_NODE: {
    writable: false,
    enumerable: true,
    configurable: true,
    value: COMMENT_NODE,
  },
  DOCUMENT_NODE: {
    writable: false,
    enumerable: true,
    configurable: true,
    value: DOCUMENT_NODE,
  },
  DOCUMENT_TYPE_NODE: {
    writable: false,
    enumerable: true,
    configurable: true,
    value: DOCUMENT_TYPE_NODE,
  },
  DOCUMENT_FRAGMENT_NODE: {
    writable: false,
    enumerable: true,
    configurable: true,
    value: DOCUMENT_FRAGMENT_NODE,
  },
  NOTATION_NODE: {
    writable: false,
    enumerable: true,
    configurable: true,
    value: NOTATION_NODE,
  },
  DOCUMENT_POSITION_DISCONNECTED: {
    writable: true,
    enumerable: false,
    configurable: true,
    value: DOCUMENT_POSITION_DISCONNECTED,
  },
  DOCUMENT_POSITION_PRECEDING: {
    writable: true,
    enumerable: false,
    configurable: true,
    value: DOCUMENT_POSITION_PRECEDING,
  },
  DOCUMENT_POSITION_FOLLOWING: {
    writable: true,
    enumerable: false,
    configurable: true,
    value: DOCUMENT_POSITION_FOLLOWING,
  },
  DOCUMENT_POSITION_CONTAINS: {
    writable: true,
    enumerable: false,
    configurable: true,
    value: DOCUMENT_POSITION_CONTAINS,
  },
  DOCUMENT_POSITION_CONTAINED_BY: {
    writable: true,
    enumerable: false,
    configurable: true,
    value: DOCUMENT_POSITION_CONTAINED_BY,
  },
  DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: {
    writable: true,
    enumerable: false,
    configurable: true,
    value: DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC,
  },
  nodeType: {
    enumerable: true,
    configurable: true,
    get() {
      return getContextAttribute(this, "nodeType");
    },
  },
  /**
   * The nodeName idenitifies the name of the node, which
   * depends on the node type.
   * @see https://dom.spec.whatwg.org/#dom-node-nodename
   */
  nodeName: {
    enumerable: true,
    configurable: true,
    get() {
      const nodeType = getContextAttribute(this, "nodeType");
      switch (nodeType) {
        case ELEMENT_NODE:
          return this.tagName;
        case ATTRIBUTE_NODE:
          /**
           * This is the "qualified name", which is the local name
           * if the namespace is null or the namespace concatenated
           * with the localname (with ":") otherwise.
           * @see https://dom.spec.whatwg.org/#concept-attribute-qualified-name
           * @todo review spec and verify correctnesss
           */
          return this.namespaceURI === null ?
            this.localName :
            `${this.namespaceURI}:${this.localName}`;
        case TEXT_NODE:
          return "#text";
        case CDATA_SECTION_NODE:
          return "#cdata-section";
        case PROCESSING_INSTRUCTION_NODE:
          return this.target;
        case COMMENT_NODE:
          return "#comment";
        case DOCUMENT_NODE:
          return "#document";
        case DOCUMENT_TYPE_NODE:
          return this.name;
        case DOCUMENT_FRAGMENT_NODE:
          return "#document-fragment";
        case ENTITY_REFERENCE_NODE:
        case ENTITY_NODE:
        case NOTATION_NODE:
        default:
          /**
           * The entity and notation nodes should not be used and
           * only exist for historical reasons. If we encounter a node
           * with those types, or with any other unknown type, we throw.
           * @todo use an internal error type
           */
          throw new Error(
            `Accessing nodeName on a node of an unsupported type: ${nodeType}`
          );
      }
    },
  },
  // The base URI for the document
  baseURI: {
    enumerable: true,
    configurable: true,
    get() {
      return internalBrowsingContextState.documentBaseURI;
    },
  },
  // Whether the node is connected to to the DOM tree
  isConnected: {
    enumerable: true,
    configurable: true,
    get() {
      return getContextAttribute(this, "isConnected");
    },
  },
  /**
   * The document this node is connected to. If the node is the document
   * object then this must return null, otherwise it returns the node's
   * context object's document.
   * @see https://dom.spec.whatwg.org/#dom-node-ownerdocument
   */
  ownerDocument: {
    enumerable: true,
    configurable: true,
    get() {
      if (this.nodeType === DOCUMENT_NODE) {
        return null;
      }
      return getContextAttribute(this, "ownerDocument");
    },
  },
  /**
   * The getRootNode(options) attribute’s getter must return context object’s
   * shadow-including root if options’s composed is true,
   * and context object’s root otherwise.
   * @see https://dom.spec.whatwg.org/#dom-node-getrootnode
   */
  getRootNode: {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function getRootNode(
      options = {
        composed: false,
      }
    ) {
      // @todo return the shadow root if options.composed is true
      return internalBrowsingContextState.rootDocument;
    },
  },
  /**
   * The parent node is the context object's parent. ATTRIBUTE_NODEs do
   * not have parents and assumedly return null in all cases.
   * @see https://dom.spec.whatwg.org/#dom-node-parentnode
   */
  parentNode: {
    enumerable: true,
    configurable: true,
    get() {
      return getContextAttribute(this, "parentNode");
    },
  },
  /**
   * The parentElement attribute’s getter must return the
   * context object’s parent element.
   * @see https://dom.spec.whatwg.org/#dom-node-parentelement
   */
  parentElement: {
    enumerable: true,
    configurable: true,
    get() {
      return getContextAttribute(this, "parentElement");
    },
  },
  /**
   * hasChildNodes returns whether the context object has
   * children or not
   * @see https://dom.spec.whatwg.org/#dom-node-haschildnodes
   */
  hasChildNodes: {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function hasChildNodes() {
      // @todo make sure `children` is always a NodeList
      return getContextAttribute(this, "children").length !== 0;
    },
  },
  /**
   * childNodes returns a NodeList of all the children of
   * this node.
   * @see https://dom.spec.whatwg.org/#dom-node-childnodes
   */
  childNodes: {
    enumerable: true,
    configurable: true,
    get() {
      // @todo make sure this returns a NodeList instance
      return getContextAttribute(this, "children");
    },
  },
  firstChild: {
    enumerable: true,
    configurable: true,
    get() {
      return getContextAttribute(this, "firstChild");
    },
  },
  lastChild: {
    enumerable: true,
    configurable: true,
    get() {
      return getContextAttribute(this, "lastChild");
    },
  },
  previousSibling: {
    enumerable: true,
    configurable: true,
    get() {
      return getContextAttribute(this, "previousSibling");
    },
  },
  nextSibling: {
    enumerable: true,
    configurable: true,
    get() {
      return getContextAttribute(this, "nextSibling");
    },
  },
  /**
   * The nodeValue attribute must return the following, depending on the context object
   *  1. Attribute nodes return the context object's value
   *  2. Text, Processing Instruction, and Comment nodes return the context
   *     object's data.
   *  3. All other nodes return null
   * 
   *  @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  nodeValue: {
    enumerable: true,
    configurable: true,
    get() {
      const nodeType = this.nodeType;
      switch (nodeType) {
        case ATTRIBUTE_NODE:
          return this.value;
        case COMMENT_NODE:
        case PROCESSING_INSTRUCTION_NODE:
        case TEXT_NODE:
          return this.data;
        default:
          return null;
      }
    },
    set(value) {
      // Treat null and undefined as empty strings.
      if (value == null) {
        value = "";
      } else {
        value = "" + value;
      }
      switch (this.nodeType) {
        case ATTRIBUTE_NODE:
          setContextAttribute(this, "value", value);
          return value;
          /**
           * Updating the nodeValue for these nodes should follow
           * the instructions for replacing data on a node.
           * @see https://dom.spec.whatwg.org/#concept-cd-replace
           * @todo do we need to queue MutationRecords like it said?
           *       are we safe just updated value and length?
           */
        case COMMENT_NODE:
        case PROCESSING_INSTRUCTION_NODE:
        case COMMENT_NODE:
          setContextAttribute(this, "data", value);
          setContextAttribute(this, "length", value.length);
          return value;
        default:
          // Do nothing but return the value for all other nodes.
          return value;
      }
    },
  },
  textContent: {
    enumerable: true,
    configurable: true,
    get() {
      switch (this.nodeType) {
        case DOCUMENT_FRAGMENT_NODE:
        case ELEMENT_NODE:
          // @todo traverse all descendants in tree order and concatenated
          // the data from every Text node.
          throw new InternalDOMMITError(
            `{DOCUMENT_FRAGMENT_NODE|ELEMENT_NODE}.textContent is not yet implemented`
          );
        case ATTRIBUTE_NODE:
          return this.value;
        case TEXT_NODE:
        case PROCESSING_INSTRUCTION_NODE:
        case COMMENT_NODE:
          return this.data;
        default:
          return null;
      }
    },
    set(value) {
      const stringifiedValue = value == null ? "" : "" + value;
      /**
       * For DOCUMENT_FRAGMENT_NODE and ELEMENT_NODE the textContent setter must:
       *  1. Let *node* be null
       *  2. If the given value is not the empty string, set *node* to a new Text node whose
       *     data is the given value and node document is content object's node document
       *  3. Replace all with node within the context object
       * @see https://dom.spec.whatwg.org/#dom-node-textcontent
       * @see https://dom.spec.whatwg.org/#concept-node-replace-all (replace all instructions) 
       * @todo implement setter behavior for document fragments and elements.
       */
      switch (this.nodeType) {
        case DOCUMENT_FRAGMENT_NODE:
        case ELEMENT_NODE:
          throw new InternalDOMMITError(
            `Setting {DOCUMENT_FRAGMENT_NODE|ELEMENT_NODE}.textContent is not yet implemented.`
          );
        case ATTRIBUTE_NODE:
          setContextAttribute(this, "value", stringifiedValue);
          return value;
        case TEXT_NODE:
        case PROCESSING_INSTRUCTION_NODE:
        case COMMENT_NODE:
          setContextAttribute(this, "data", stringifiedValue);
          setContextAttribute(this, "length", stringifiedValue.length);
          return value;
        default:
          return value;
      }
    },
  },
  /**
   * The normalize method, when invoked, much run these steps for each descendant exclusive Text node:
   *  1. Let length be node’s length.
   *  2. If length is zero, then remove node and continue with the next exclusive Text node, if any.
   *  3. Let data be the concatenation of the data of node’s contiguous exclusive Text nodes (excluding itself), in tree order.
   *  4. Replace data with node node, offset length, count 0, and data data.
   *  5. Let currentNode be node’s next sibling.
   *  6. While currentNode is an exclusive Text node:
   *     6a. For each range whose start node is currentNode, add length to its start offset and set its start node to node.
   *     6b. For each range whose end node is currentNode, add length to its end o:ffset and set its end node to node.
   *     6c. For each range whose start node is currentNode’s parent and start offset is currentNode’s index,
   *         set its start node to node and its start offset to length.
   *     6d. For each range whose end node is currentNode’s parent and end offset is currentNode’s index, set its
   *         end node to node and its end offset to length.
   *     6e. Add currentNode’s length to length.
   *     6f. Set currentNode to its next sibling.
   *  7. Remove node’s contiguous exclusive Text nodes (excluding itself), in tree order.
   * @see https://dom.spec.whatwg.org/#dom-node-normalize
   * @todo implement this!
   */
  normalize: {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function normalize() {
      throw new InternalDOMMITError(
        `Node.prototype.normalize(...) is not yet implemented.`
      );
    },
  },
  cloneNode: {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function cloneNode() {
      const deep = arguments[0] || false;
      throw new InternalDOMMITError(
        `Node.prototype.cloneNode(...) is not yet implemented.`
      );
    }
  },
  isEqualNode: {
    enumerable: true,
    configurable: true,
    writable: true,
    /**
     * @todo this is basically just the equality check defined by the DOM spec,
     * move this into a separate utility so that we can use it elsewhere
     * 
     * @see https://dom.spec.whatwg.org/#concept-node-equals
     */
    value: function isEqualNode(otherNode) {
      // Return false for null and undefined
      if (otherNode == null) {
        return false;
      }
      // otherNode must be an object that inherits from
      // the Node interface.
      if (!(otherNode instanceof Node)) {
        throw new TypeError(
          `Failed to execute 'isEqualNode' on 'Node': parameter 1 is not of type 'Node'`
        );
      }
      const nodeType = this.nodeType;
      // False for different node types
      if (nodeType !== otherNode.nodeType) {
        return false;
      }
      switch (nodeType) {
        case DOCUMENT_TYPE_NODE:
          // DocumentTypes are equal if their name, public ID and 
          // system ID are all equal
          return (
            this.name === otherNode.name &&
            this.publicId === otherNode.publicId &&
            this.systemId === otherNode.systemId
          );
        case ELEMENT_NODE:
          if (
            /**
             * The spec states that we must check the prefix value
             * first to determine how to compare elements. AFAIK we dont
             * need to support prefixes with HTML docs so this does not matter now
             * @todo verify prefix is unneeded.
             */
            this.namespaceURI !== otherNode.namespaceURI ||
            this.localName !== otherNode.localName ||
            this.attributes.length !== otherNode.attributes.length
          ) {
            return false;
          }

          /**
           * We now need to check: 
           *  1. Each attribute in the elements attribute list
           *  2. Each child of the element
           * @todo come back to this once Element is implemented
           */
          console.warn(
            `{NODE}.isEqualNode(...): Basic equality has been verified for ` +
            `some Elements, but attributes and children have not yet been verified.`
          )
          return true;

        case ATTRIBUTE_NODE:
          return (
            this.namespaceURI === otherNode.namespaceURI &&
            this.localName === otherNode.localName &&
            this.value === otherNode.value
          );
        case PROCESSING_INSTRUCTION_NODE:
          return (
            this.target === otherNode.target &&
            this.data === otherNode.data
          );
        case TEXT_NODE:
        case COMMENT_NODE:
          return this.data === otherNode.data;
        default:
          // Default behavior for any other Node is undefined
      }
    }
  },
  // historical alias of ===
  isSameNode: {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function isSameNode(otherNode) {
      return otherNode === this;
    }
  },
  compareDocumentPosition: {
    enumerable: true,
    configurable: true,
    writable: true,
    /**
     * @todo implement this!
     */
    value: function compareDocumentPosition(other) {
      throw new InternalDOMMITError(
        `Node.prototype.compareDocumentPosition is not yet implemented.`
      );
    }
  },
  lookupPrefix: {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function lookupPrefix(namespace) {
      if (!namespace) {
        return null;
      }
      switch (this.nodeType) {
        case ELEMENT_NODE:
          // matching namespaces
          if (namespace === this.namespaceURI && this.prefix !== null) {
            return this.prefix;
          }
          /**
           * @todo implement attribute parsing for namespace prefix
           * @see https://dom.spec.whatwg.org/#locate-a-namespace-prefix
           */
          return null;
      }
    },
  },
  lookupNamespaceURI: {
    enumerable: true,
    configurable: true,
    writable: true,
    /**
     * @todo implement this!
     * @see https://dom.spec.whatwg.org/#dom-node-lookupnamespaceuri
     */
    value: function lookupNamespaceURI(prefix) {
      throw new InternalDOMMITError(
        `Node.prototype.lookupNamespaceURI is not yet implemented.`
      );
    }
  },
  isDefaultNamespace: {
    enumerable: true,
    configurable: true,
    writable: true,
    /**
     * @todo implement this!
     * @see https://dom.spec.whatwg.org/#dom-node-isdefaultnamespace
     */
    value: function isDefaultNamespace(namespace) {
      throw new InternalDOMMITError(
        `Node.prototype.isDefaultNamespace is not yet implemented.`
      );
    }
  },
  insertBefore: {
    enumerable: true,
    configurable: true,
    writable: true,
    /**
     * @implement this!
     * @see https://dom.spec.whatwg.org/#dom-node-insertbefore
     */
    value: function insertBefore() {
      throw new InternalDOMMITError(
        `Node.prototype.insertBefore is not yet implemented.`
      )
    }
  },
  appendChild: {
    enumerable: true,
    configurable: true,
    writable: true,
    /**
     * @implement this!
     * @see https://dom.spec.whatwg.org/#dom-node-appendchild
     */
    value: function appendChild() {
      throw new InternalDOMMITError(
        `Node.prototype.appendChild is not yet implemented.`
      )
    }
  },
  replaceChild: {
    enumerable: true,
    configurable: true,
    writable: true,
    /**
     * @implement this!
     * @see https://dom.spec.whatwg.org/#dom-node-replacechild
     */
    value: function replaceChild() {
      throw new InternalDOMMITError(
        `Node.prototype.replaceChild is not yet implemented.`
      )
    }
  },
  removeChild: {
    enumerable: true,
    configurable: true,
    writable: true,
    /**
     * @implement this!
     * @see https://dom.spec.whatwg.org/#dom-node-removechild
     */
    value: function removeChild() {
      throw new InternalDOMMITError(
        `Node.prototype.removeChild is not yet implemented.`
      )
    }
  },


});
export default Node;