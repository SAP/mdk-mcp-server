import { test, describe, beforeEach } from "node:test";
import assert from "node:assert";
import { Chunker } from "../../build/chunker.js";

describe("Chunker", () => {
  let chunker;

  beforeEach(() => {
    chunker = new Chunker();
  });

  describe("chunkifyJSON", () => {
    test("should create chunk for document with description", _t => {
      const documentName = "TestComponent";
      const documentDetails = {
        description: "A test component for MDK applications",
      };

      const chunks = chunker.chunkifyJSON(documentName, documentDetails);

      assert.strictEqual(chunks.length, 1);
      assert.ok(chunks[0].includes("PROPERTY OF TestComponent"));
      assert.ok(
        chunks[0].includes(
          "TestComponent: A test component for MDK applications"
        )
      );
    });

    test("should create chunks for properties recursively", _t => {
      const documentName = "ComplexComponent";
      const documentDetails = {
        description: "A complex component",
        properties: {
          width: {
            description: "Width of the component",
          },
          height: {
            description: "Height of the component",
          },
        },
      };

      const chunks = chunker.chunkifyJSON(documentName, documentDetails);

      assert.strictEqual(chunks.length, 3); // 1 for main + 2 for properties

      // Check main component chunk
      assert.ok(chunks[0].includes("PROPERTY OF ComplexComponent"));
      assert.ok(chunks[0].includes("ComplexComponent: A complex component"));

      // Check property chunks
      const widthChunk = chunks.find(chunk =>
        chunk.includes("width: Width of the component")
      );
      const heightChunk = chunks.find(chunk =>
        chunk.includes("height: Height of the component")
      );

      assert.ok(widthChunk);
      assert.ok(heightChunk);
      assert.ok(widthChunk.includes("FROM ComplexComponent"));
      assert.ok(heightChunk.includes("FROM ComplexComponent"));
    });

    test("should handle nested properties with parent hierarchy", _t => {
      const documentName = "NestedComponent";
      const documentDetails = {
        description: "A nested component",
        properties: {
          style: {
            description: "Style configuration",
            properties: {
              color: {
                description: "Text color",
              },
              fontSize: {
                description: "Font size",
              },
            },
          },
        },
      };

      const chunks = chunker.chunkifyJSON(documentName, documentDetails);

      assert.strictEqual(chunks.length, 4); // 1 main + 1 style + 2 nested properties

      // Check deeply nested property chunk
      const colorChunk = chunks.find(chunk =>
        chunk.includes("color: Text color")
      );
      assert.ok(colorChunk);
      assert.ok(colorChunk.includes("FROM style FROM NestedComponent"));
    });

    test("should handle component without description", _t => {
      const documentName = "NoDescComponent";
      const documentDetails = {
        properties: {
          value: {
            description: "Component value",
          },
        },
      };

      const chunks = chunker.chunkifyJSON(documentName, documentDetails);

      assert.strictEqual(chunks.length, 1); // Only property chunk, no main description chunk
      assert.ok(chunks[0].includes("value: Component value"));
      assert.ok(chunks[0].includes("FROM NoDescComponent"));
    });

    test("should handle component with no properties", _t => {
      const documentName = "SimpleComponent";
      const documentDetails = {
        description: "A simple component with no properties",
      };

      const chunks = chunker.chunkifyJSON(documentName, documentDetails);

      assert.strictEqual(chunks.length, 1);
      assert.ok(chunks[0].includes("PROPERTY OF SimpleComponent"));
      assert.ok(
        chunks[0].includes(
          "SimpleComponent: A simple component with no properties"
        )
      );
    });

    test("should handle empty document details", _t => {
      const documentName = "EmptyComponent";
      const documentDetails = {};

      const chunks = chunker.chunkifyJSON(documentName, documentDetails);

      assert.strictEqual(chunks.length, 0);
    });

    test("should handle property without description", _t => {
      const documentName = "TestComponent";
      const documentDetails = {
        properties: {
          propertyWithoutDesc: {
            type: "string",
          },
          propertyWithDesc: {
            description: "Property with description",
          },
        },
      };

      const chunks = chunker.chunkifyJSON(documentName, documentDetails);

      assert.strictEqual(chunks.length, 1); // Only one chunk for property with description
      assert.ok(
        chunks[0].includes("propertyWithDesc: Property with description")
      );
    });

    test("should remove properties from document details after processing", _t => {
      const documentName = "TestComponent";
      const documentDetails = {
        description: "Test component",
        properties: {
          testProp: {
            description: "Test property",
          },
        },
        otherField: "should remain",
      };

      chunker.chunkifyJSON(documentName, documentDetails);

      assert.strictEqual(documentDetails.properties, undefined);
      assert.strictEqual(documentDetails.description, "Test component");
      assert.strictEqual(documentDetails.otherField, "should remain");
    });
  });

  describe("splitText", () => {
    test("should parse JSON and return chunks", _t => {
      const jsonDocument = JSON.stringify({
        title: "ObjectHeader",
        description: "Displays object header information",
        properties: {
          DetailImage: {
            description: "Image displayed in the header",
          },
          HeadlineText: {
            description: "Main headline text",
          },
        },
      });

      const chunks = chunker.splitText(jsonDocument);

      assert.strictEqual(chunks.length, 3);

      // Check main component chunk
      const mainChunk = chunks.find(chunk =>
        chunk.includes("ObjectHeader: Displays object header information")
      );
      assert.ok(mainChunk);

      // Check property chunks
      const imageChunk = chunks.find(chunk =>
        chunk.includes("DetailImage: Image displayed in the header")
      );
      const headlineChunk = chunks.find(chunk =>
        chunk.includes("HeadlineText: Main headline text")
      );

      assert.ok(imageChunk);
      assert.ok(headlineChunk);
    });

    test("should handle JSON without title", _t => {
      const jsonDocument = JSON.stringify({
        description: "Component without title",
        properties: {
          prop1: {
            description: "First property",
          },
        },
      });

      const chunks = chunker.splitText(jsonDocument);

      assert.strictEqual(chunks.length, 2);

      // Should use empty string as document name when no title
      const mainChunk = chunks.find(chunk => chunk.includes("PROPERTY OF "));
      assert.ok(mainChunk);
    });

    test("should throw error for invalid JSON", _t => {
      const invalidJson = "{ invalid json }";

      assert.throws(() => chunker.splitText(invalidJson), SyntaxError);
    });

    test("should handle empty JSON object", _t => {
      const emptyJson = JSON.stringify({});

      const chunks = chunker.splitText(emptyJson);

      assert.strictEqual(chunks.length, 0);
    });

    test("should handle complex nested structure", _t => {
      const complexJson = JSON.stringify({
        title: "FormCell",
        description: "Form cell component",
        properties: {
          Control: {
            description: "Control configuration",
            properties: {
              Type: {
                description: "Type of control",
              },
              Properties: {
                description: "Control properties",
                properties: {
                  Value: {
                    description: "Control value",
                  },
                },
              },
            },
          },
        },
      });

      const chunks = chunker.splitText(complexJson);

      assert.strictEqual(chunks.length, 5); // 1 main + 1 Control + 1 Type + 1 Properties + 1 Value

      // Check deeply nested chunk
      const valueChunk = chunks.find(chunk =>
        chunk.includes("Value: Control value")
      );
      assert.ok(valueChunk);
      assert.ok(
        valueChunk.includes("FROM Properties FROM Control FROM FormCell")
      );
    });
  });
});
