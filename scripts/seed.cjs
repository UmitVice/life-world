// scripts/seed.cjs
//
// CommonJS wrapper around the TS seed. We can't easily pass
// --compiler-options through yarn on Windows (the JSON quotes get
// mangled by cmd/PowerShell), so this script invokes ts-node
// programmatically with the right options.

const path = require('path');

// 1. Ensure a CommonJS-style compile for ts-node (the project's
//    tsconfig sets `module: "esnext"`, which makes Node 22 treat the
//    .ts file as ESM and refuse to load it).
process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({
  module: 'commonjs',
  rootDir: '.',
  esModuleInterop: true,
});
process.env.TS_NODE_TRANSPILE_ONLY = 'true';

require('ts-node/register');
require(path.resolve(__dirname, 'seedProperties.ts'));
