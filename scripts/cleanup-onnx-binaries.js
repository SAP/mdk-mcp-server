#!/usr/bin/env node

/**
 * Post-install script to remove unused platform-specific ONNX binaries
 * This can save ~120-140MB by removing binaries for platforms you're not using
 *
 * Run with: node scripts/cleanup-onnx-binaries.js
 * Or automatically via npm postinstall hook
 */

import { existsSync, rmSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Detect current platform
const currentPlatform = process.platform; // 'darwin', 'win32', 'linux'
const currentArch = process.arch; // 'x64', 'arm64', etc.

console.log(`\n🔍 Detecting platform: ${currentPlatform} ${currentArch}`);

// Path to onnxruntime-node binaries
// Try both napi-v6 (newer versions) and napi-v3 (older versions)
const onnxRuntimePathV6 = join(__dirname, '..', 'node_modules', 'onnxruntime-node', 'bin', 'napi-v6');
const onnxRuntimePathV3 = join(__dirname, '..', 'node_modules', 'onnxruntime-node', 'bin', 'napi-v3');

let onnxRuntimePath;
if (existsSync(onnxRuntimePathV6)) {
  onnxRuntimePath = onnxRuntimePathV6;
  console.log('ℹ️  Using ONNX Runtime napi-v6 binaries');
} else if (existsSync(onnxRuntimePathV3)) {
  onnxRuntimePath = onnxRuntimePathV3;
  console.log('ℹ️  Using ONNX Runtime napi-v3 binaries');
} else {
  console.log('ℹ️  onnxruntime-node binaries not found, skipping cleanup');
  process.exit(0);
}

// Calculate size before cleanup
function calculateDirectorySize(dirPath) {
  let totalSize = 0;
  try {
    const files = readdirSync(dirPath, { withFileTypes: true });
    for (const file of files) {
      const filePath = join(dirPath, file.name);
      if (file.isDirectory()) {
        totalSize += calculateDirectorySize(filePath);
      } else {
        totalSize += statSync(filePath).size;
      }
    }
  } catch (error) {
    // Ignore errors
  }
  return totalSize;
}

const sizeBefore = calculateDirectorySize(onnxRuntimePath);

// Get list of platform directories
const platforms = readdirSync(onnxRuntimePath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

console.log(`📦 Found ONNX binaries for platforms: ${platforms.join(', ')}`);

// Remove binaries for other platforms
let removedCount = 0;
let removedSize = 0;

for (const platform of platforms) {
  const platformPath = join(onnxRuntimePath, platform);
  const architectures = readdirSync(platformPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const arch of architectures) {
    const archPath = join(platformPath, arch);

    // Keep only current platform and architecture
    const shouldKeep = platform === currentPlatform && arch === currentArch;

    if (!shouldKeep) {
      const dirSize = calculateDirectorySize(archPath);
      try {
        rmSync(archPath, { recursive: true, force: true });
        removedCount++;
        removedSize += dirSize;
        console.log(`🗑️  Removed: ${platform}/${arch} (${(dirSize / 1024 / 1024).toFixed(1)}MB)`);
      } catch (error) {
        console.warn(`⚠️  Failed to remove ${platform}/${arch}:`, error.message);
      }
    } else {
      const dirSize = calculateDirectorySize(archPath);
      console.log(`✅ Keeping: ${platform}/${arch} (${(dirSize / 1024 / 1024).toFixed(1)}MB)`);
    }
  }

  // Remove empty platform directories
  try {
    const remainingArch = readdirSync(platformPath);
    if (remainingArch.length === 0) {
      rmSync(platformPath, { recursive: true, force: true });
    }
  } catch (error) {
    // Ignore
  }
}

const sizeAfter = calculateDirectorySize(onnxRuntimePath);
const savedSize = sizeBefore - sizeAfter;

console.log(`\n✨ Cleanup complete!`);
console.log(`   Removed: ${removedCount} platform(s)`);
console.log(`   Space saved: ${(savedSize / 1024 / 1024).toFixed(1)}MB`);
console.log(`   Before: ${(sizeBefore / 1024 / 1024).toFixed(1)}MB → After: ${(sizeAfter / 1024 / 1024).toFixed(1)}MB\n`);
