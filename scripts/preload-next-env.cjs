/* eslint-disable @typescript-eslint/no-require-imports */
// @next/env sets __esModule:true via webpack but ships no .default export.
// tsx/esbuild's default-import interop sees __esModule and accesses .default → undefined.
// payload has its own nested copy; patch both so loadEnv.js finds a .default.
[
  require('@next/env'),
  require(__dirname + '/../node_modules/payload/node_modules/@next/env'),
].forEach((m) => { if (!m.default) m.default = m; });
