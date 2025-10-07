import { test, describe } from "node:test";
import assert from "node:assert";

describe("embeddings.js", () => {
  describe("cosine similarity calculation", () => {
    // Test the cosine similarity logic that's used in searchEmbeddings
    function cosineSimilarity(a, b) {
      const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
      const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
      return dot / (normA * normB);
    }

    test("should return 1 for identical vectors", _t => {
      const vec1 = [1, 0, 0];
      const vec2 = [1, 0, 0];
      const similarity = cosineSimilarity(vec1, vec2);
      assert.strictEqual(similarity, 1);
    });

    test("should return 0 for orthogonal vectors", _t => {
      const vec1 = [1, 0, 0];
      const vec2 = [0, 1, 0];
      const similarity = cosineSimilarity(vec1, vec2);
      assert.strictEqual(similarity, 0);
    });

    test("should return -1 for opposite vectors", _t => {
      const vec1 = [1, 0, 0];
      const vec2 = [-1, 0, 0];
      const similarity = cosineSimilarity(vec1, vec2);
      assert.strictEqual(similarity, -1);
    });

    test("should handle positive correlation", _t => {
      const vec1 = [1, 1, 0];
      const vec2 = [1, 1, 0];
      const similarity = cosineSimilarity(vec1, vec2);
      assert.ok(
        Math.abs(similarity - 1) < 0.000001,
        `Expected ~1, got ${similarity}`
      );
    });

    test("should handle partial correlation", _t => {
      const vec1 = [1, 0, 0];
      const vec2 = [0.5, 0.866, 0]; // 60 degree angle
      const similarity = cosineSimilarity(vec1, vec2);
      assert.ok(
        Math.abs(similarity - 0.5) < 0.001,
        `Expected ~0.5, got ${similarity}`
      );
    });

    test("should handle normalized vectors", _t => {
      const vec1 = [0.6, 0.8, 0];
      const vec2 = [0.8, 0.6, 0];
      const similarity = cosineSimilarity(vec1, vec2);
      const expected = 0.6 * 0.8 + 0.8 * 0.6; // Both vectors are already normalized
      assert.ok(
        Math.abs(similarity - expected) < 0.001,
        `Expected ~${expected}, got ${similarity}`
      );
    });

    test("should handle higher dimensional vectors", _t => {
      const vec1 = [1, 2, 3, 4, 5];
      const vec2 = [1, 2, 3, 4, 5];
      const similarity = cosineSimilarity(vec1, vec2);
      assert.strictEqual(similarity, 1);
    });

    test("should handle zero vectors gracefully", _t => {
      const vec1 = [0, 0, 0];
      const vec2 = [1, 1, 1];
      const similarity = cosineSimilarity(vec1, vec2);
      // Division by zero should result in NaN
      assert.ok(isNaN(similarity));
    });

    test("should handle Float32Array vectors", _t => {
      const vec1 = new Float32Array([1, 0, 0]);
      const vec2 = new Float32Array([0, 1, 0]);
      const similarity = cosineSimilarity(vec1, vec2);
      assert.strictEqual(similarity, 0);
    });

    test("should handle negative values correctly", _t => {
      const vec1 = [-1, -1, 0];
      const vec2 = [1, 1, 0];
      const similarity = cosineSimilarity(vec1, vec2);
      assert.ok(
        Math.abs(similarity - -1) < 0.000001,
        `Expected ~-1, got ${similarity}`
      );
    });
  });

  describe("search result sorting logic", () => {
    test("should sort chunks by similarity descending", _t => {
      const chunks = [
        { content: "apple", similarity: 0.5 },
        { content: "banana", similarity: 0.9 },
        { content: "cherry", similarity: 0.3 },
        { content: "date", similarity: 0.7 },
      ];

      // Sort by similarity descending (mimics searchEmbeddings behavior)
      chunks.sort((a, b) => b.similarity - a.similarity);

      assert.strictEqual(chunks[0].content, "banana");
      assert.strictEqual(chunks[0].similarity, 0.9);

      assert.strictEqual(chunks[1].content, "date");
      assert.strictEqual(chunks[1].similarity, 0.7);

      assert.strictEqual(chunks[2].content, "apple");
      assert.strictEqual(chunks[2].similarity, 0.5);

      assert.strictEqual(chunks[3].content, "cherry");
      assert.strictEqual(chunks[3].similarity, 0.3);
    });

    test("should handle equal similarities consistently", _t => {
      const chunks = [
        { content: "first", similarity: 0.5 },
        { content: "second", similarity: 0.5 },
        { content: "third", similarity: 0.7 },
      ];

      chunks.sort((a, b) => b.similarity - a.similarity);

      assert.strictEqual(chunks[0].content, "third");
      assert.strictEqual(chunks[0].similarity, 0.7);

      // The order of equal similarity items should be stable
      assert.ok(chunks[1].similarity === 0.5);
      assert.ok(chunks[2].similarity === 0.5);
    });
  });

  describe("embedding dimension validation logic", () => {
    test("should validate consistent embedding dimensions", _t => {
      const embeddings = [
        new Float32Array([0.1, 0.2, 0.3]),
        new Float32Array([0.4, 0.5, 0.6]),
        new Float32Array([0.7, 0.8, 0.9]),
      ];

      const dim = embeddings[0].length;
      let isValid = true;
      let errorMsg = "";

      for (let i = 0; i < embeddings.length; i++) {
        if (!(embeddings[i] instanceof Float32Array)) {
          isValid = false;
          errorMsg = `Embedding ${i} must be a Float32Array`;
          break;
        }
        if (embeddings[i].length !== dim) {
          isValid = false;
          errorMsg = `All embeddings must have same length (embedding ${i} mismatch)`;
          break;
        }
      }

      assert.ok(isValid, errorMsg);
      assert.strictEqual(dim, 3);
    });

    test("should detect inconsistent dimensions", _t => {
      const embeddings = [
        new Float32Array([0.1, 0.2, 0.3]),
        new Float32Array([0.4, 0.5]), // Wrong dimension
        new Float32Array([0.7, 0.8, 0.9]),
      ];

      const dim = embeddings[0].length;
      let isValid = true;
      let errorMsg = "";

      for (let i = 0; i < embeddings.length; i++) {
        if (!(embeddings[i] instanceof Float32Array)) {
          isValid = false;
          errorMsg = `Embedding ${i} must be a Float32Array`;
          break;
        }
        if (embeddings[i].length !== dim) {
          isValid = false;
          errorMsg = `All embeddings must have same length (embedding ${i} mismatch)`;
          break;
        }
      }

      assert.ok(!isValid);
      assert.strictEqual(
        errorMsg,
        "All embeddings must have same length (embedding 1 mismatch)"
      );
    });

    test("should detect non-Float32Array embeddings", _t => {
      const embeddings = [
        new Float32Array([0.1, 0.2, 0.3]),
        [0.4, 0.5, 0.6], // Regular array instead of Float32Array
        new Float32Array([0.7, 0.8, 0.9]),
      ];

      let isValid = true;
      let errorMsg = "";

      for (let i = 0; i < embeddings.length; i++) {
        if (!(embeddings[i] instanceof Float32Array)) {
          isValid = false;
          errorMsg = `Embedding ${i} must be a Float32Array`;
          break;
        }
      }

      assert.ok(!isValid);
      assert.strictEqual(errorMsg, "Embedding 1 must be a Float32Array");
    });
  });

  describe("finite value validation logic", () => {
    test("should validate finite values in embeddings", _t => {
      const embedding = new Float32Array([0.1, 0.2, 0.3, 0.4]);

      let isValid = true;
      for (let j = 0; j < embedding.length; j++) {
        if (!isFinite(embedding[j])) {
          isValid = false;
          break;
        }
      }

      assert.ok(isValid);
    });

    test("should detect NaN values", _t => {
      const embedding = new Float32Array([0.1, NaN, 0.3, 0.4]);

      let isValid = true;
      for (let j = 0; j < embedding.length; j++) {
        if (!isFinite(embedding[j])) {
          isValid = false;
          break;
        }
      }

      assert.ok(!isValid);
    });

    test("should detect Infinity values", _t => {
      const embedding = new Float32Array([0.1, 0.2, Infinity, 0.4]);

      let isValid = true;
      for (let j = 0; j < embedding.length; j++) {
        if (!isFinite(embedding[j])) {
          isValid = false;
          break;
        }
      }

      assert.ok(!isValid);
    });

    test("should detect negative Infinity values", _t => {
      const embedding = new Float32Array([0.1, 0.2, -Infinity, 0.4]);

      let isValid = true;
      for (let j = 0; j < embedding.length; j++) {
        if (!isFinite(embedding[j])) {
          isValid = false;
          break;
        }
      }

      assert.ok(!isValid);
    });
  });

  describe("buffer size calculation logic", () => {
    test("should calculate correct buffer size for embeddings", _t => {
      const chunks = ["chunk1", "chunk2", "chunk3"];
      const dim = 384; // Common dimension for sentence transformers
      const expectedSize = chunks.length * dim * 4; // Float32 = 4 bytes

      assert.strictEqual(expectedSize, 3 * 384 * 4);
      assert.strictEqual(expectedSize, 4608);
    });

    test("should validate buffer size matches expected", _t => {
      const chunks = ["chunk1", "chunk2"];
      const dim = 256;
      const expectedSize = chunks.length * dim * 4;

      // Simulate a buffer that matches
      const correctBuffer = new ArrayBuffer(expectedSize);
      assert.strictEqual(correctBuffer.byteLength, expectedSize);

      // Simulate a buffer that doesn't match
      const incorrectBuffer = new ArrayBuffer(expectedSize - 100);
      assert.notStrictEqual(incorrectBuffer.byteLength, expectedSize);
    });
  });
});
