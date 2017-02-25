/**
 * @todo modularize this
 */

/**
 * There are certain situations that must be tracked
 * globally so we can know when to call internal functions
 * vs. restrict users from calling them arbitrarily.
 */
export const internalBrowsingContextState = {
  /**
   * document is an instance of HTMLDocument, which
   * is an abstract class/interface as far as the user
   * is concerned. We only allow it to be called *once*,
   * when dommit is constructing the global document.
   */
  documentConstructed: false,
  /**
   * The document base URL is tracked in global state, as its accessible
   * from every node that implements the Node interface (Node.baseURL).
   * It can also be changed by the presence of a <base/> element.
   * 
   * @description
   * The document base URL of a Document object is the absolute URL
   * obtained by runningthese substeps:
   *  1. If there is no base element that has an href attribute in the
   *     Document, then the document base URL is the Document's fallback
   *     base URL; abort these steps.
   * 
   *  2. Otherwise, the document base URL is the frozen base URL of the first
   *     base element in the Document that has an href attribute, in tree order.
   * 
   * @see https://html.spec.whatwg.org/multipage/infrastructure.html#document-base-url
   *
   */
  documentBaseURI: null,
  /**
   * The rootDocument is the document that is automatically created and provided
   * by the browsing context. This is distinct from documents you can create
   * with DOMImplementation.createDocument(...), and should be both the ownerDocument
   * and return value of getRootNode for any nodes participating in the DOM tree.
   */
  rootDocument: null
}

export class InternalDOMMITError extends Error {
  constructor(message) {
    super(message);
    this.message = `
     ${message}

     This is an internal error with Dommit. If the issue persists, please
     file a bug at [REPO_URL]
    `;
    this.name = "InternalDOMMITError";
    this.stack = (new Error()).stack;
  }
}


