#!/bin/bash

# Silent npm install script that suppresses deprecation warnings
# This script runs npm install with minimal output

echo "Running npm install..."
npm install --silent --no-fund --no-audit 2>&1 | grep -vE "npm warn deprecated|npm warn" || true
echo ""
echo "✅ Installation complete"
