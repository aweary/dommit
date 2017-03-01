// @flow
import Node, { DOCUMENT_TYPE_NODE } from "./Node";
import {
  createContext,
  getContextPropertyValue,
  setContextPropertyValue
} from "./context";
import { internalBrowsingContextState } from "../internal";
import { inherits } from "../utils";

function DocumentType() {
  if (internalBrowsingContextState.documentConstructed) {
    throw new TypeError("Illegal constructor");
  }
  const initialDocumentTypeState = arguments[0];
  createContext(
    this,
    Object.assign({}, initialDocumentTypeState, {
      // nodeType cannot be overwritten or configured.
      nodeType: DOCUMENT_TYPE_NODE
    })
  );
}

inherits(DocumentType, Node, {
  name: {
    get() {
      return getContextPropertyValue(this, "name");
    }
  },
  publicId: {
    get() {
      return getContextPropertyValue(this, "publicId");
    }
  },
  systemId: {
    get() {
      return getContextPropertyValue(this, "systemId");
    }
  }
});

export default DocumentType;
