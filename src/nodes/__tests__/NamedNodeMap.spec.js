import NamedNodeMap from "../NamedNodeMap";

let nnp;

describe("NamedNodeMap", () => {
  beforeEach(() => {
    /**
     * @todo once we actually implement restricted construction
     * rules, we'll have to adapt this to work with those.
     */
    nnp = new NamedNodeMap();
  });
  it("should be a function/class", () => {
    expect(typeof NamedNodeMap).toBe("function");
  });
  it("can not be constructed directly", () => {
    expect(() => new NamedNodeMap()).toThrow();
  });

  describe("length", () => {
    it("should be a getter on the NamedNodeMap prototype", () => {
      const ownProp = Object.getOwnPropertyDescriptor(nnp, "length");
      expect(ownProp).toBe(undefined);
      const protoProp = Object.getOwnPropertyDescriptor(
        NamedNodeMap.prototype,
        "length"
      );
      expect(typeof protoProp.get).toBe("function");
    });

    it("should be 0 when empty", () => {
      expect(nnp.length).toBe(0);
    });

    it("should increase when an item is added", () => {
      /**
       * @todo this should fail once NamedNodeMap actually
       * validates that the argument is an istance of the Attr node
       */
      nnp.setNamedItem({ localName: "foo" });
      expect(nnp.length).toBe(1);
      nnp.setNamedItem({ localName: "bar" });
      expect(nnp.length).toBe(2);
    });
  });

  describe("item", () => {
    it("should return the item at the provided index", () => {
      const attr = { localName: "foo" };
      const attr2 = { localName: "bar" };
      nnp.setNamedItem(attr);
      nnp.setNamedItem(attr2);
      expect(nnp.item(0)).toBe(attr);
      expect(nnp.item(1)).toBe(attr2);
    });
  });

  describe("getNamedItem", () => {
    it("should return the attribute with the provided name", () => {
      const attr = { localName: "foobar" };
      nnp.setNamedItem(attr);
      expect(nnp.getNamedItem("foobar")).toBe(attr);
    });
    it("should return null for attributes that dont exist", () => {
      expect(nnp.getNamedItem("barfoo")).toBe(null);
    });
  });

  describe("getNamedItemNS", () => {
    it(
      "should return the attribute with the provided name and namespace",
      () => {
        const attr = { localName: "foobar", namespaceURI: "foo" };
        const attr2 = { localName: "foobar", namespaceURI: "bar" };
        const attr3 = { localName: "foobar" };
        nnp.setNamedItemNS(attr);
        nnp.setNamedItemNS(attr2);
        nnp.setNamedItem(attr3);
        expect(nnp.getNamedItemNS("foo", "foobar")).toBe(attr);
        expect(nnp.getNamedItemNS("bar", "foobar")).toBe(attr2);
        expect(nnp.getNamedItemNS("", "foobar")).toBe(attr3);
      }
    );
    it("should return null for attributes that dont exist", () => {
      expect(nnp.getNamedItem("barfoo")).toBe(null);
    });
  });

  describe("setNamedItem", () => {
    it('should set the attribute provided', () => {
      const attr = { localName: "foo" };
      nnp.setNamedItem(attr);
      expect(nnp[0]).toBe(attr);
    });
  });

  describe("setNamedItemNS", () => {
    it('should set the attribute provided', () => {
      const attr = { localName: "foo", namespaceURI: "foo" };
      const attr2 = { localName: "foo" };
      nnp.setNamedItemNS(attr);
      nnp.setNamedItem(attr2);
      expect(nnp[0]).toBe(attr);
      expect(nnp[1]).toBe(attr2);
    });
  });

  describe("removeNamedItemNS", () => {
    it("should remove the attribute and update indices", () => {
      const attr = { localName: "foo" };
      const attr2 = { localName: "bar" };
      const attr3 = { localName: "baz" };
      nnp.setNamedItem(attr);
      nnp.setNamedItem(attr2);
      nnp.setNamedItem(attr3);
      expect(nnp.length).toBe(3);
      expect(nnp.item(0)).toBe(attr);
      expect(nnp.item(1)).toBe(attr2);
      expect(nnp.item(2)).toBe(attr3);
      nnp.removeNamedItem("bar");
      expect(nnp.length).toBe(2);
      expect(nnp.item(0)).toBe(attr);
      expect(nnp.item(1)).toBe(attr3);
      expect(nnp.item(2)).toBe(null);
    });
  });

  describe("removeNamedItemNS", () => {
    it("should remove the attribute and update indices", () => {
      const attr = { localName: "foo", namespaceURI: "foo" };
      const attr2 = { localName: "bar", namespaceURI: "foo" };
      const attr3 = { localName: "bar", namespaceURI: "bar" };
      nnp.setNamedItemNS(attr);
      nnp.setNamedItemNS(attr2);
      nnp.setNamedItemNS(attr3);
      expect(nnp.length).toBe(3);
      expect(nnp.item(0)).toBe(attr);
      expect(nnp.item(1)).toBe(attr2);
      expect(nnp.item(2)).toBe(attr3);
      nnp.removeNamedItemNS("foo", "bar");
      expect(nnp.length).toBe(2);
      expect(nnp.item(0)).toBe(attr);
      expect(nnp.item(1)).toBe(attr3);
      expect(nnp.item(2)).toBe(null);
    });
  });
});
