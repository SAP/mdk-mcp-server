/**
 * Security tests for validateSecurePath function
 * Tests for CVE fix: Path Traversal vulnerability (CVSS 9.6)
 */
import { describe, test, expect, beforeEach } from "@jest/globals";
import path from "path";
import fs from "fs";
import os from "os";
import { validateSecurePath, ValidationError, addAllowedBaseDirectory, getAllowedBaseDirectories, } from "./validation.js";
describe("validateSecurePath - Security Tests", () => {
    const originalCwd = process.cwd();
    let tempDir;
    beforeEach(() => {
        // Create a temporary directory for testing
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mdk-security-test-"));
        // Reset to original state
        process.chdir(originalCwd);
        // Clear any added directories (reset to CWD only)
        const allowed = getAllowedBaseDirectories();
        while (allowed.length > 1) {
            allowed.pop();
        }
    });
    afterEach(() => {
        // Cleanup temp directory
        if (tempDir && fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });
    describe("Allowlist enforcement", () => {
        test("should allow paths within current working directory", () => {
            const validPath = path.join(process.cwd(), "subfolder");
            fs.mkdirSync(validPath, { recursive: true });
            expect(() => validateSecurePath(validPath)).not.toThrow();
        });
        test("should reject paths outside allowed directories", () => {
            const outsidePath = "/tmp/outside-workspace";
            fs.mkdirSync(outsidePath, { recursive: true });
            expect(() => validateSecurePath(outsidePath)).toThrow(ValidationError);
            expect(() => validateSecurePath(outsidePath)).toThrow(/Access denied/);
        });
        test("should reject absolute paths to system directories", () => {
            const systemPaths = [
                "/etc/passwd",
                "/proc/self",
                "/sys/kernel",
                "/dev/null",
            ];
            systemPaths.forEach(systemPath => {
                expect(() => validateSecurePath(systemPath)).toThrow(ValidationError);
                expect(() => validateSecurePath(systemPath)).toThrow(/Access denied/);
            });
        });
        test("should reject paths that escape via parent directory", () => {
            // Try to escape current directory using ../
            const escapePath = path.join(process.cwd(), "..", "..", "etc", "passwd");
            expect(() => validateSecurePath(escapePath)).toThrow(ValidationError);
            expect(() => validateSecurePath(escapePath)).toThrow(/Access denied/);
        });
    });
    describe("Symlink canonicalization", () => {
        test("should resolve symlinks before validation", () => {
            // Create a directory outside the workspace
            const outsideDir = path.join(tempDir, "outside");
            fs.mkdirSync(outsideDir, { recursive: true });
            // Create a symlink inside the workspace pointing outside
            const symlinkPath = path.join(process.cwd(), "evil-symlink");
            try {
                fs.symlinkSync(outsideDir, symlinkPath, "dir");
                // Should reject because the real path is outside workspace
                expect(() => validateSecurePath(symlinkPath)).toThrow(ValidationError);
                expect(() => validateSecurePath(symlinkPath)).toThrow(/Access denied/);
            }
            finally {
                // Cleanup symlink
                if (fs.existsSync(symlinkPath)) {
                    fs.unlinkSync(symlinkPath);
                }
            }
        });
        test("should allow symlinks within workspace pointing to workspace paths", () => {
            // Create a real directory in workspace
            const realDir = path.join(process.cwd(), "real-dir");
            fs.mkdirSync(realDir, { recursive: true });
            // Create a symlink in workspace pointing to workspace
            const symlinkPath = path.join(process.cwd(), "good-symlink");
            try {
                fs.symlinkSync(realDir, symlinkPath, "dir");
                // Should allow because real path is within workspace
                expect(() => validateSecurePath(symlinkPath)).not.toThrow();
            }
            finally {
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
            const maliciousPath = allowedDir + "-evil";
            // Create the malicious directory
            fs.mkdirSync(maliciousPath, { recursive: true });
            try {
                expect(() => validateSecurePath(maliciousPath)).toThrow(ValidationError);
                expect(() => validateSecurePath(maliciousPath)).toThrow(/Access denied/);
            }
            finally {
                fs.rmdirSync(maliciousPath);
            }
        });
        test("should correctly handle workspace root itself", () => {
            const workspaceRoot = process.cwd();
            expect(() => validateSecurePath(workspaceRoot)).not.toThrow();
        });
        test("should allow subdirectories with proper separator", () => {
            const subDir = path.join(process.cwd(), "valid-subdir");
            fs.mkdirSync(subDir, { recursive: true });
            expect(() => validateSecurePath(subDir)).not.toThrow();
            fs.rmdirSync(subDir);
        });
    });
    describe("Non-existent paths", () => {
        test("should reject paths whose parent doesn't exist", () => {
            const nonExistentParent = path.join("/tmp/does-not-exist-" + Date.now(), "subfolder");
            expect(() => validateSecurePath(nonExistentParent)).toThrow(ValidationError);
            expect(() => validateSecurePath(nonExistentParent)).toThrow(/does not exist/);
        });
        test("should allow non-existent paths within existing workspace", () => {
            const futureFile = path.join(process.cwd(), "new-folder", "file.txt");
            // Parent (cwd) exists, so this should be allowed
            // The function will use the canonical parent path
            expect(() => validateSecurePath(futureFile)).not.toThrow();
        });
    });
    describe("Additional allowed directories", () => {
        test("should allow adding additional workspace directories", () => {
            addAllowedBaseDirectory(tempDir);
            const tempPath = path.join(tempDir, "allowed-file.txt");
            fs.writeFileSync(tempPath, "test");
            expect(() => validateSecurePath(tempPath)).not.toThrow();
        });
        test("should not add duplicate allowed directories", () => {
            const beforeCount = getAllowedBaseDirectories().length;
            addAllowedBaseDirectory(process.cwd());
            addAllowedBaseDirectory(process.cwd());
            const afterCount = getAllowedBaseDirectories().length;
            expect(afterCount).toBe(beforeCount);
        });
    });
    describe("Edge cases", () => {
        test("should reject empty paths", () => {
            expect(() => validateSecurePath("")).toThrow(ValidationError);
        });
        test("should reject paths with null bytes", () => {
            expect(() => validateSecurePath("path\x00evil")).toThrow(ValidationError);
        });
        test("should reject paths with directory traversal sequences", () => {
            expect(() => validateSecurePath("../../etc/passwd")).toThrow(ValidationError);
        });
        test("should reject paths with home directory references", () => {
            expect(() => validateSecurePath("~/../../etc/passwd")).toThrow(ValidationError);
        });
        test("should handle relative paths correctly", () => {
            const relativePath = "./subfolder";
            const subfolderPath = path.join(process.cwd(), "subfolder");
            fs.mkdirSync(subfolderPath, { recursive: true });
            const result = validateSecurePath(relativePath);
            // Should resolve to absolute path within workspace
            expect(path.isAbsolute(result)).toBe(true);
            expect(result).toContain("subfolder");
            fs.rmdirSync(subfolderPath);
        });
    });
});
