// @flow
import url from "url";
import { DOCUMENT_NODE } from "./Node";
import Document from "./Document";
import DocumentType from "./DocumentType";
import { createContext } from "./context";
import { internalBrowsingContextState } from "../internal";
import { inherits } from "../utils";

function parseInitialDocumentState(partialState) {
  const initialState = Object.assign(
    {
      URL: "about:blank",
      compatMode: "CSS1Compat",
      encoding: "UTF-8",
      nodeType: DOCUMENT_NODE
    },
    partialState
  );
  // Parse origin attribute if URL exists
  if (initialState.URL) {
    const parsedURL = url.parse(initialState.URL);
    // $FlowFixMe TODO ill fix this someday
    initialState.origin = `${parsedURL.protocol}//${parsedURL.hostname}`;
  }
  // Track the document URL in internal browsing context so it can be
  // accessed from any node implementing the Node interface easily.
  internalBrowsingContextState.documentBaseURI = initialState.URL;
  // Instantiate the DocumentType for the Document. It should only always
  // have a single DocumentType. The DocumentType constructor is also gaurded
  // and may only be called when internalBrowsingContextState.documentConstructed
  // is false, so this must be called before its set to true.
  initialState.doctype = new DocumentType({
    name: "html",
    publicId: "",
    systemId: ""
  });
  return initialState;
}


class HTMLDocument {
  constructor() {
    /**
     * HTMLDocument is the constructor that the global document
     * is instantiated with. It is not meant to be called directly
     * by users so we must check in the constructor that we are
     * calling HTMLDocument internally. It should only be called _once_
     * when we create the root document.
     */
    if (internalBrowsingContextState.documentConstructed) {
      throw new TypeError("Illegal constructor");
    }
    /**
     * HTMLDocument.length should be 0, but we need to initialize
     * a number of instance properties for the document, so we
     * access them from arguments.
     * 
     * @todo store document initialization state in internalBrowsingContextState
     */
    const initialDocumentState = arguments[0];
    createContext(this, parseInitialDocumentState(initialDocumentState));
    internalBrowsingContextState.documentConstructed = true;
  }
}

inherits(HTMLDocument, Document, {});

export default HTMLDocument;
