#!/usr/bin/env node

import run from "./index.js";

const args = process.argv.slice(2);
const options = {};

if (args.length > 0 && !args[0].startsWith("-")) {
  const toolName = args[0];
  const toolArgs = args.slice(1);
  options.tools = toolName;
  options.args = toolArgs;
}

run(options).catch(error => {
  console.error("Server error:", error);
  process.exit(1);
});
