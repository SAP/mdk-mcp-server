import { test, describe } from "node:test";
import assert from "node:assert";
import { printResults } from "../../build/vector.js";

describe("vector.ts", () => {
  describe("printResults", () => {
    test("should format search results as JSON string", _t => {
      const mockResults = [
        {
          content:
            "/path/to/ObjectHeader.json, chunk 0\nObjectHeader: Main header component",
          similarity: 0.85,
        },
        {
          content:
            "/path/to/FormCell.schema, chunk 1\nProperty description here",
          similarity: 0.72,
        },
      ];

      const output = printResults(mockResults);
      const parsed = JSON.parse(output);

      assert.strictEqual(parsed.length, 2);

      // Check first result
      assert.strictEqual(parsed[0].source, "objectheader");
      assert.strictEqual(parsed[0].distance, "0.85");
      assert.strictEqual(
        parsed[0].content,
        "ObjectHeader: Main header component"
      );

      // Check second result
      assert.strictEqual(parsed[1].source, "formcell");
      assert.strictEqual(parsed[1].distance, "0.72");
      assert.strictEqual(parsed[1].content, "Property description here");
    });

    test("should handle results without clear source path", _t => {
      const mockResults = [
        {
          content: "SimpleContent\nJust content without path",
          similarity: 0.95,
        },
      ];

      const output = printResults(mockResults);
      const parsed = JSON.parse(output);

      assert.strictEqual(parsed.length, 1);
      assert.strictEqual(parsed[0].source, "simplecontent");
      assert.strictEqual(parsed[0].distance, "0.95");
      assert.strictEqual(parsed[0].content, "Just content without path");
    });

    test("should handle empty results array", _t => {
      const output = printResults([]);
      const parsed = JSON.parse(output);

      assert.strictEqual(parsed.length, 0);
      assert.deepStrictEqual(parsed, []);
    });

    test("should handle results with complex file paths", _t => {
      const mockResults = [
        {
          content:
            "/very/deep/nested/path/to/ComplexComponent.json, chunk 5\nThis is a complex component with detailed description",
          similarity: 0.92,
        },
      ];

      const output = printResults(mockResults);
      const parsed = JSON.parse(output);

      assert.strictEqual(parsed.length, 1);
      assert.strictEqual(parsed[0].source, "complexcomponent");
      assert.strictEqual(parsed[0].distance, "0.92");
      assert.strictEqual(
        parsed[0].content,
        "This is a complex component with detailed description"
      );
    });

    test("should handle results with no file extension", _t => {
      const mockResults = [
        {
          content:
            "/path/to/ComponentWithoutExt, chunk 0\nComponent without extension",
          similarity: 0.88,
        },
      ];

      const output = printResults(mockResults);
      const parsed = JSON.parse(output);

      assert.strictEqual(parsed.length, 1);
      assert.strictEqual(parsed[0].source, "componentwithoutext, chunk 0");
      assert.strictEqual(parsed[0].distance, "0.88");
      assert.strictEqual(parsed[0].content, "Component without extension");
    });

    test("should handle results with multiple extensions", _t => {
      const mockResults = [
        {
          content:
            "/path/MyComponent.example.md, chunk 2\nExample documentation content",
          similarity: 0.76,
        },
      ];

      const output = printResults(mockResults);
      const parsed = JSON.parse(output);

      assert.strictEqual(parsed.length, 1);
      assert.strictEqual(parsed[0].source, "mycomponent");
      assert.strictEqual(parsed[0].distance, "0.76");
      assert.strictEqual(parsed[0].content, "Example documentation content");
    });

    test("should handle similarity values with high precision", _t => {
      const mockResults = [
        {
          content: "TestComponent.json, chunk 0\nTest content",
          similarity: 0.123456789,
        },
      ];

      const output = printResults(mockResults);
      const parsed = JSON.parse(output);

      assert.strictEqual(parsed.length, 1);
      assert.strictEqual(parsed[0].distance, "0.12"); // Should be rounded to 2 decimal places
    });

    test("should handle results with newlines in content", _t => {
      const mockResults = [
        {
          content:
            "MultiLineComponent.json, chunk 0\nFirst line\nSecond line\nThird line",
          similarity: 0.8,
        },
      ];

      const output = printResults(mockResults);
      const parsed = JSON.parse(output);

      assert.strictEqual(parsed.length, 1);
      assert.strictEqual(
        parsed[0].content,
        "First line\nSecond line\nThird line"
      );
    });

    test("should handle results with special characters in filename", _t => {
      const mockResults = [
        {
          content:
            "Special-Component_Name@123.json, chunk 0\nSpecial component content",
          similarity: 0.67,
        },
      ];

      const output = printResults(mockResults);
      const parsed = JSON.parse(output);

      assert.strictEqual(parsed.length, 1);
      assert.strictEqual(parsed[0].source, "special-component_name@123");
      assert.strictEqual(parsed[0].content, "Special component content");
    });

    test("should handle results with empty content after newline", _t => {
      const mockResults = [
        {
          content: "EmptyContent.json, chunk 0\n",
          similarity: 0.5,
        },
      ];

      const output = printResults(mockResults);
      const parsed = JSON.parse(output);

      assert.strictEqual(parsed.length, 1);
      assert.strictEqual(parsed[0].content, "");
    });

    test("should handle multiple results with mixed formats", _t => {
      const mockResults = [
        {
          content: "/absolute/path/Component1.json, chunk 0\nFirst component",
          similarity: 0.95,
        },
        {
          content: "relative/Component2.schema, chunk 3\nSecond component",
          similarity: 0.87,
        },
        {
          content: "JustFilename.json, chunk 1\nThird component",
          similarity: 0.79,
        },
      ];

      const output = printResults(mockResults);
      const parsed = JSON.parse(output);

      assert.strictEqual(parsed.length, 3);

      assert.strictEqual(parsed[0].source, "component1");
      assert.strictEqual(parsed[0].content, "First component");

      assert.strictEqual(parsed[1].source, "component2");
      assert.strictEqual(parsed[1].content, "Second component");

      assert.strictEqual(parsed[2].source, "justfilename");
      assert.strictEqual(parsed[2].content, "Third component");
    });
  });
});
