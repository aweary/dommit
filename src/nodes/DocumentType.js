// @flow
import Node, { DOCUMENT_TYPE_NODE } from "./Node";
import {
  NodeInstanceContext,
  initializeContext,
  getContextAttribute,
  setContextAttribute
} from "./context";
import { internalBrowsingContextState } from "../internal";
import { inherits } from "../utils";

function DocumentType() {
  if (internalBrowsingContextState.documentConstructed) {
    throw new TypeError("Illegal constructor");
  }
  const initialDocumentTypeState = arguments[0];
  initializeContext(
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
      return getContextAttribute(this, "name");
    }
  },
  publicId: {
    get() {
      return getContextAttribute(this, "publicId");
    }
  },
  systemId: {
    get() {
      return getContextAttribute(this, "systemId");
    }
  }
});

export default DocumentType;
