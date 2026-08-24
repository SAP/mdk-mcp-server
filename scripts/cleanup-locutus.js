#!/usr/bin/env node

/**
 * Post-install script to remove locutus/golang directory
 * This prevents case-collision issues when packaging on case-sensitive filesystems
 * and extracting on case-insensitive filesystems (macOS/Windows).
 *
 * The locutus package (via yo → yeoman-doctor → twig) contains both:
 * - golang/strings/Index.js
 * - golang/strings/index.js
 *
 * These collide on case-insensitive filesystems and cause "Extension archive contains
 * colliding entries" errors in Claude Desktop and other zip-based installations.
 *
 * Only locutus/php/* is used at runtime by twig, so removing golang/ is safe.
 *
 * Run with: node scripts/cleanup-locutus.js
 * Or automatically via npm postinstall hook
 */

import { existsSync, rmSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🔍 Checking for locutus case-collision issue...');

// Path to locutus package
const locutusPath = join(__dirname, '..', 'node_modules', 'locutus');
const locutusGolangPath = join(locutusPath, 'golang');

if (!existsSync(locutusPath)) {
  console.log('ℹ️  locutus package not found, skipping cleanup');
  process.exit(0);
}

if (!existsSync(locutusGolangPath)) {
  console.log('✅ locutus/golang already removed or not present');
  process.exit(0);
}

// Calculate size before cleanup
function getDirectorySize(dirPath) {
  try {
    return statSync(dirPath).size;
  } catch (error) {
    return 0;
  }
}

const sizeBefore = getDirectorySize(locutusGolangPath);

try {
  rmSync(locutusGolangPath, { recursive: true, force: true });
  console.log(`🗑️  Removed locutus/golang directory (${(sizeBefore / 1024).toFixed(1)}KB)`);
  console.log('   This prevents case-collision issues on macOS/Windows filesystems');
  console.log('   Only locutus/php/* is used at runtime by twig\n');
} catch (error) {
  console.warn(`⚠️  Failed to remove locutus/golang:`, error.message);
  console.warn('   This may cause case-collision issues when packaging\n');
  process.exit(1);
}
