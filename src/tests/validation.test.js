/**
 * Security system tests for MDK MCP Server
 * Tests input validation
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { ZodError } from 'zod';

// Import security modules from build directory
import { 
  ValidationSchemas, 
  ValidationError, 
  validateSecurePath, 
  sanitizeInput, 
  validateToolArguments,
  validateInput 
} from '../../build/validation.js';

describe('Input Validation Tests', () => {
  test('should validate folder paths securely', () => {
    // Valid paths
    assert.doesNotThrow(() => {
      validateSecurePath("/Users/test/project");
    });

    // Invalid paths with directory traversal
    assert.throws(() => {
      validateSecurePath("../../../etc/passwd");
    }, ValidationError);

    assert.throws(() => {
      validateSecurePath("/project/../../../etc/shadow");
    }, ValidationError);

    // System directory access
    assert.throws(() => {
      validateSecurePath("/etc/passwd");
    }, ValidationError);

    assert.throws(() => {
      validateSecurePath("/System/Library");
    }, ValidationError);
  });

  test('should validate template types', () => {
    // Valid template types
    const validTypes = ["crud", "list detail", "base"];
    validTypes.forEach(type => {
      assert.doesNotThrow(() => {
        validateInput(ValidationSchemas.templateType, type, "templateType");
      });
    });

    // Invalid template type
    assert.throws(() => {
      validateInput(ValidationSchemas.templateType, "invalid-type", "templateType");
    }, ValidationError);
  });

  test('should validate OData entity sets', () => {
    // Valid entity sets
    assert.doesNotThrow(() => {
      validateInput(ValidationSchemas.oDataEntitySets, "Users,Projects,Tasks", "oDataEntitySets");
    });

    // Invalid entity sets
    assert.throws(() => {
      validateInput(ValidationSchemas.oDataEntitySets, "", "oDataEntitySets");
    }, ValidationError);

    assert.throws(() => {
      validateInput(ValidationSchemas.oDataEntitySets, "Invalid-Entity-Name!", "oDataEntitySets");
    }, ValidationError);
  });

  test('should sanitize input correctly', () => {
    assert.strictEqual(sanitizeInput("Hello World"), "Hello World");
    assert.strictEqual(sanitizeInput("  Test  "), "Test");
    assert.strictEqual(sanitizeInput("Test<script>"), "Testscript");
    assert.strictEqual(sanitizeInput("Test>alert"), "Testalert");
    assert.strictEqual(sanitizeInput("Test\x00\x08"), "Test");
  });

  test('should validate tool arguments', () => {
    // Valid mdk-create arguments
    const args = {
      folderRootPath: "/Users/test/project",
      scope: "project",
      templateType: "crud",
      oDataEntitySets: "Users,Projects",
      offline: false
    };

    assert.doesNotThrow(() => {
      validateToolArguments("mdk-create", args);
    });

    // Invalid arguments - these throw ZodError, not ValidationError
    assert.throws(() => {
      validateToolArguments("mdk-create", {
        ...args,
        templateType: "invalid"
      });
    }, ZodError);

    assert.throws(() => {
      validateToolArguments("unknown-tool", args);
    }, ValidationError);
  });

  test('should validate mdk-gen rule arguments', () => {
    // Valid mdk-gen arguments with rule artifact type
    const validQueryArgs = {
      artifactType: "rule",
      query: "get app name"
    };

    assert.doesNotThrow(() => {
      validateToolArguments("mdk-gen", validQueryArgs);
    });

    // Test with different valid user queries
    const validQueries = [
      "navigate to page",
      "handle form validation", 
      "send HTTP request",
      "get current user",
      "format date"
    ];

    validQueries.forEach(query => {
      assert.doesNotThrow(() => {
        validateToolArguments("mdk-gen", { artifactType: "rule", query });
      }, `Should accept valid user query: ${query}`);
    });

    // Invalid user query - empty string (throws ValidationError because Zod validates it)
    assert.throws(() => {
      validateToolArguments("mdk-gen", { artifactType: "rule", query: "" });
    }, Error); // Can be either ZodError or ValidationError

    // Invalid user query - contains invalid characters
    assert.throws(() => {
      validateToolArguments("mdk-gen", { artifactType: "rule", query: "Invalid<script>" });
    }, ZodError);

    // Invalid user query - too long
    assert.throws(() => {
      validateToolArguments("mdk-gen", { artifactType: "rule", query: "a".repeat(1001) });
    }, ZodError);

    // Missing required argument (artifactType)
    assert.throws(() => {
      validateToolArguments("mdk-gen", { query: "test" });
    }, ZodError);
  });

  test('should validate user prompt schema directly', () => {
    // Valid queries
    const validQueries = [
      "get app name",
      "navigate to page", 
      "handle form validation",
      "send HTTP request",
      "get current user info",
      "format date and time",
      "validate input fields",
      "show loading banner",
      "handle navigation events",
      "process API response"
    ];

    validQueries.forEach(query => {
      assert.doesNotThrow(() => {
        validateInput(ValidationSchemas.searchQuery, query, "query");
      }, `Should validate query: ${query}`);
    });

    // Invalid queries
    const invalidQueries = [
      "",              // Empty string
      null,            // Null value
      undefined,       // Undefined value
      123,             // Number instead of string
      "a".repeat(1001) // Too long
    ];

    invalidQueries.forEach(query => {
      assert.throws(() => {
        validateInput(ValidationSchemas.searchQuery, query, "query");
      }, ValidationError, `Should reject invalid query: ${query}`);
    });
  });
});

// Test that validation module is properly initialized
try {
  assert.ok(ValidationSchemas, 'Validation schemas loaded');
} catch (error) {
  console.error('❌ Security system initialization failed:', error);
  process.exit(1);
}
