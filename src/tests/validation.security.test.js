/**
 * Security tests for validateSecurePath function
 * Tests for CVE fix: Path Traversal vulnerability (CVSS 9.6)
 */

import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

// Import from build directory (tests run after build)
import {
  validateSecurePath,
  ValidationError,
  addAllowedBaseDirectory,
  getAllowedBaseDirectories,
} from "../../build/validation.js";

describe("validateSecurePath - Security Tests", () => {
  const originalCwd = process.cwd();
  let tempDir;

  beforeEach(() => {
    // Create a temporary directory for testing
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mdk-security-test-"));
  });

  afterEach(() => {
    // Cleanup temp directory
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe("Allowlist enforcement", () => {
    test("should allow paths within current working directory", () => {
      const validPath = path.join(process.cwd(), "src");

      assert.doesNotThrow(() => {
        validateSecurePath(validPath);
      });
    });

    test("should reject paths outside allowed directories", () => {
      const outsidePath = path.join(tempDir, "outside-workspace");
      fs.mkdirSync(outsidePath, { recursive: true });

      assert.throws(
        () => {
          validateSecurePath(outsidePath);
        },
        (err) => {
          return (
            err instanceof ValidationError && err.message.includes("Access denied")
          );
        }
      );
    });

    test("should reject absolute paths to system directories", () => {
      // These paths might not exist, but we should test the validation logic
      const systemPaths = ["/etc/passwd", "/proc/self", "/sys/kernel"];

      systemPaths.forEach((systemPath) => {
        // Only test if the path or its parent exists
        try {
          const parentExists = fs.existsSync(path.dirname(systemPath));
          if (parentExists) {
            assert.throws(
              () => {
                validateSecurePath(systemPath);
              },
              (err) => {
                return (
                  err instanceof ValidationError &&
                  (err.message.includes("Access denied") ||
                    err.message.includes("does not exist"))
                );
              },
              `Should reject system path: ${systemPath}`
            );
          }
        } catch (e) {
          // Skip test if path doesn't exist
        }
      });
    });

    test("should reject paths that escape via parent directory", () => {
      // Try to escape current directory using ../
      const escapePath = path.join(process.cwd(), "..", "..", "should-be-rejected");

      assert.throws(
        () => {
          validateSecurePath(escapePath);
        },
        (err) => {
          return (
            err instanceof ValidationError &&
            (err.message.includes("Access denied") ||
              err.message.includes("does not exist"))
          );
        }
      );
    });
  });

  describe("Symlink canonicalization", () => {
    test("should resolve symlinks before validation", () => {
      // Create a directory outside the workspace
      const outsideDir = path.join(tempDir, "outside");
      fs.mkdirSync(outsideDir, { recursive: true });

      // Create a symlink inside the workspace pointing outside
      const symlinkPath = path.join(process.cwd(), "test-evil-symlink");
      try {
        // Skip if we can't create symlinks (Windows permissions)
        fs.symlinkSync(outsideDir, symlinkPath, "dir");

        // Should reject because the real path is outside workspace
        assert.throws(
          () => {
            validateSecurePath(symlinkPath);
          },
          (err) => {
            return (
              err instanceof ValidationError &&
              err.message.includes("Access denied")
            );
          }
        );
      } catch (symlinkError) {
        // Skip test if symlink creation fails (e.g., Windows without admin)
        if (symlinkError.code !== "EPERM") {
          throw symlinkError;
        }
      } finally {
        // Cleanup symlink
        if (fs.existsSync(symlinkPath)) {
          fs.unlinkSync(symlinkPath);
        }
      }
    });

    test("should allow symlinks within workspace pointing to workspace paths", () => {
      // Create a real directory in workspace
      const realDir = path.join(process.cwd(), "test-real-dir");
      fs.mkdirSync(realDir, { recursive: true });

      // Create a symlink in workspace pointing to workspace
      const symlinkPath = path.join(process.cwd(), "test-good-symlink");
      try {
        fs.symlinkSync(realDir, symlinkPath, "dir");

        // Should allow because real path is within workspace
        assert.doesNotThrow(() => {
          validateSecurePath(symlinkPath);
        });
      } catch (symlinkError) {
        // Skip test if symlink creation fails
        if (symlinkError.code !== "EPERM") {
          throw symlinkError;
        }
      } finally {
        // Cleanup
        if (fs.existsSync(symlinkPath)) {
          fs.unlinkSync(symlinkPath);
        }
        if (fs.existsSync(realDir)) {
          fs.rmdirSync(realDir);
        }
      }
    });
  });

  describe("Path separator anchoring", () => {
    test("should prevent prefix bypass attacks", () => {
      // If workspace is /home/user, should reject /home/user-evil
      const allowedDir = process.cwd();
      const maliciousPath = allowedDir + "-evil-suffix";

      // Create the malicious directory
      if (!fs.existsSync(maliciousPath)) {
        fs.mkdirSync(maliciousPath, { recursive: true });
      }

      try {
        assert.throws(
          () => {
            validateSecurePath(maliciousPath);
          },
          (err) => {
            return (
              err instanceof ValidationError &&
              err.message.includes("Access denied")
            );
          }
        );
      } finally {
        if (fs.existsSync(maliciousPath)) {
          fs.rmdirSync(maliciousPath);
        }
      }
    });

    test("should correctly handle workspace root itself", () => {
      const workspaceRoot = process.cwd();
      assert.doesNotThrow(() => {
        validateSecurePath(workspaceRoot);
      });
    });

    test("should allow subdirectories with proper separator", () => {
      const subDir = path.join(process.cwd(), "test-valid-subdir");
      fs.mkdirSync(subDir, { recursive: true });

      try {
        assert.doesNotThrow(() => {
          validateSecurePath(subDir);
        });
      } finally {
        if (fs.existsSync(subDir)) {
          fs.rmdirSync(subDir);
        }
      }
    });
  });

  describe("Non-existent paths", () => {
    test("should reject paths whose parent doesn't exist", () => {
      const nonExistentParent = path.join(
        tempDir,
        "does-not-exist-" + Date.now(),
        "subfolder"
      );

      assert.throws(
        () => {
          validateSecurePath(nonExistentParent);
        },
        (err) => {
          return (
            err instanceof ValidationError &&
            err.message.includes("does not exist")
          );
        }
      );
    });

    test("should allow non-existent paths within existing workspace", () => {
      const futureFile = path.join(process.cwd(), "test-new-folder-" + Date.now());

      // Parent (cwd) exists, so this should be allowed
      assert.doesNotThrow(() => {
        validateSecurePath(futureFile);
      });
    });
  });

  describe("Additional allowed directories", () => {
    test("should allow adding additional workspace directories", () => {
      // Create file first
      const tempPath = path.join(tempDir, "allowed-file.txt");
      fs.writeFileSync(tempPath, "test");

      // Add temp directory - the directory must exist for realpathSync to work
      addAllowedBaseDirectory(tempDir);

      // Now validation should pass
      assert.doesNotThrow(() => {
        validateSecurePath(tempPath);
      });
    });

    test("should not add duplicate allowed directories", () => {
      const beforeCount = getAllowedBaseDirectories().length;

      // Try adding current directory twice
      addAllowedBaseDirectory(process.cwd());
      addAllowedBaseDirectory(process.cwd());

      const afterCount = getAllowedBaseDirectories().length;
      assert.strictEqual(afterCount, beforeCount);
    });
  });

  describe("Edge cases", () => {
    test("should reject empty paths", () => {
      assert.throws(
        () => {
          validateSecurePath("");
        },
        (err) => {
          return err instanceof ValidationError;
        }
      );
    });

    test("should reject paths with directory traversal sequences", () => {
      assert.throws(
        () => {
          validateSecurePath("../../should-be-rejected");
        },
        (err) => {
          return (
            err instanceof ValidationError &&
            err.message.includes("directory traversal")
          );
        }
      );
    });

    test("should reject paths with home directory references", () => {
      assert.throws(
        () => {
          validateSecurePath("~/../../should-be-rejected");
        },
        (err) => {
          return (
            err instanceof ValidationError &&
            err.message.includes("home directory")
          );
        }
      );
    });

    test("should handle relative paths correctly", () => {
      const relativePath = "./src";
      const result = validateSecurePath(relativePath);

      // Should resolve to absolute path within workspace
      assert.ok(path.isAbsolute(result));
      assert.ok(result.includes("src"));
    });

    test("should reject paths exceeding maximum length", () => {
      const longPath = "a".repeat(1001);
      assert.throws(
        () => {
          validateSecurePath(longPath);
        },
        (err) => {
          return err instanceof ValidationError;
        }
      );
    });
  });
});
