var Node = require('./dist/nodes/Node').default;
var Document = require('./dist/nodes/Document').default;
var HTMLDocument = require('./dist/nodes/HTMLDocument').default;
var document = new HTMLDocument({});

global.Node = Node;
global.Document = Document;
global.HTMLDocument = HTMLDocument;
global.document = document;
