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
    // Valid mdk-gen-project arguments
    const args = {
      folderRootPath: "/Users/test/project",
      templateType: "crud",
      oDataEntitySets: "Users,Projects"
    };

    assert.doesNotThrow(() => {
      validateToolArguments("mdk-gen-project", args);
    });

    // Invalid arguments - these throw ZodError, not ValidationError
    assert.throws(() => {
      validateToolArguments("mdk-gen-project", {
        ...args,
        templateType: "invalid"
      });
    }, ZodError);

    assert.throws(() => {
      validateToolArguments("unknown-tool", args);
    }, ValidationError);
  });
});

// Test that validation module is properly initialized
try {
  assert.ok(ValidationSchemas, 'Validation schemas loaded');
} catch (error) {
  console.error('❌ Security system initialization failed:', error);
  process.exit(1);
}
