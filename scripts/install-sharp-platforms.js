#!/usr/bin/env node

/**
 * Pre-packaging script to install ALL sharp platform binaries
 *
 * Sharp's @img/* platform packages are version- and ABI-coupled to the installed sharp.
 * A bundle assembled on one platform needs ALL platform binaries injected for cross-platform
 * compatibility.
 *
 * This script:
 * - Runs ONLY during CI/packaging (not on local installs to save bandwidth/disk)
 * - Reads sharp's optionalDependencies from node_modules/sharp/package.json
 * - Installs all missing platform packages with exact versions
 *
 * Run with: node scripts/install-sharp-platforms.js
 * Or add to CI workflow before npm pack/publish
 *
 * To force run locally: set INSTALL_ALL_SHARP_PLATFORMS=1
 */

import { existsSync, readFileSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Only run in CI/packaging environments (skip on local installs to save bandwidth)
const isCI = process.env.CI === 'true' || process.env.CI === '1';
const forceInstall = process.env.INSTALL_ALL_SHARP_PLATFORMS === '1' || process.env.INSTALL_ALL_SHARP_PLATFORMS === 'true';
const isPackaging = process.env.npm_command === 'pack' || process.env.npm_lifecycle_event === 'pack';

if (!isCI && !forceInstall && !isPackaging) {
  console.log('ℹ️  Skipping sharp platform installation (not in CI/packaging mode)');
  console.log('   To install all platforms locally: INSTALL_ALL_SHARP_PLATFORMS=1 node scripts/install-sharp-platforms.js\n');
  process.exit(0);
}

console.log('\n🔍 Installing all sharp platform binaries for cross-platform compatibility...');

const sharpPackageJsonPath = join(__dirname, '..', 'node_modules', 'sharp', 'package.json');

if (!existsSync(sharpPackageJsonPath)) {
  console.log('⚠️  sharp package.json not found, skipping');
  process.exit(0);
}

// Read sharp's optionalDependencies
const sharpPackageJson = JSON.parse(readFileSync(sharpPackageJsonPath, 'utf-8'));
const optionalDeps = sharpPackageJson.optionalDependencies || {};
const sharpVersion = sharpPackageJson.version;

console.log(`📦 sharp version: ${sharpVersion}`);
console.log(`🌍 Found ${Object.keys(optionalDeps).length} platform packages\n`);

// Check which platforms are missing
const missingPlatforms = [];
for (const [pkgName, version] of Object.entries(optionalDeps)) {
  const pkgPath = join(__dirname, '..', 'node_modules', pkgName);
  if (!existsSync(pkgPath)) {
    missingPlatforms.push(`${pkgName}@${version}`);
  }
}

if (missingPlatforms.length === 0) {
  console.log('✅ All sharp platform binaries already installed\n');
  process.exit(0);
}

console.log(`📥 Installing ${missingPlatforms.length} missing platform(s):\n`);
missingPlatforms.forEach(pkg => console.log(`   - ${pkg}`));

// Install missing platforms
try {
  console.log('\n🔧 Running npm install...');

  // Use --no-save to avoid modifying package-lock.json
  // Use --force to bypass platform checks (npm refuses to install platform-specific packages otherwise)
  const installCmd = `npm install --no-save --no-audit --force ${missingPlatforms.join(' ')}`;

  execSync(installCmd, {
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  });

  console.log('\n✅ All sharp platform binaries installed successfully!');
  console.log('   Bundle will now work on all supported platforms\n');

} catch (error) {
  console.error('\n❌ Failed to install sharp platform binaries:', error.message);
  console.error('   Bundle may not work on all platforms');
  process.exit(1);
}
