// @flow
import Node from "./Node";
import {
  NodeInstanceContext,
  initializeContext,
  getContextAttribute,
  setContextAttribute
} from "./context";
import { internalBrowsingContextState } from "../internal";
import { inherits } from "../utils";

function Document() {
  throw new TypeError("Illegal constructor");
}

// $FlowFixMe
Document.prototype = Object.create(Node.prototype, {
  // document.documentURI
  URL: {
    get() {
      return getContextAttribute(this, "URL");
    }
  },

  documentURI: {
    get() {
      return getContextAttribute(this, "URL");
    }
  },

  origin: {
    get() {
      return getContextAttribute(this, "origin");
    }
  },
  /**
   * compatMode should always return "CSS1Compat" until
   * a good reason to support quirks mode ("BackCompat") arises
   */
  compatMode: {
    get() {
      return getContextAttribute(this, "compatMode");
    }
  },

  characterSet: {
    get() {
      return getContextAttribute(this, "encoding");
    }
  },

  charset: {
    get() {
      return getContextAttribute(this, "encoding");
    }
  },

  inputEncoding: {
    get() {
      return getContextAttribute(this, "encoding");
    }
  },

  contentType: {
    get() {
      return getContextAttribute(this, "contentType");
    }
  },

  doctype: {
    get() {
      return getContextAttribute(this, "doctype");
    }
  }
});

export default Document;
