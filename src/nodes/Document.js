// @flow
import Node from "./Node";
import {
  NodeInstanceContext,
  createContext,
  getContextPropertyValue,
  setContextPropertyValue
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
      return getContextPropertyValue(this, "URL");
    }
  },

  documentURI: {
    get() {
      return getContextPropertyValue(this, "URL");
    }
  },

  origin: {
    get() {
      return getContextPropertyValue(this, "origin");
    }
  },
  /**
   * compatMode should always return "CSS1Compat" until
   * a good reason to support quirks mode ("BackCompat") arises
   */
  compatMode: {
    get() {
      return getContextPropertyValue(this, "compatMode");
    }
  },

  characterSet: {
    get() {
      return getContextPropertyValue(this, "encoding");
    }
  },

  charset: {
    get() {
      return getContextPropertyValue(this, "encoding");
    }
  },

  inputEncoding: {
    get() {
      return getContextPropertyValue(this, "encoding");
    }
  },

  contentType: {
    get() {
      return getContextPropertyValue(this, "contentType");
    }
  },

  doctype: {
    get() {
      return getContextPropertyValue(this, "doctype");
    }
  }
});

export default Document;
