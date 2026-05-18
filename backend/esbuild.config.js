// @ts-check
const { build } = require("esbuild");

/**
 * Bundle the server into a single dist/index.js.
 *
 * `bundle: true` is required because the source imports use explicit `.ts`
 * extensions (e.g. `import app from "./app.ts"`). esbuild only rewrites those
 * specifiers when bundling; with bundle:false the `.ts` paths leak into the
 * output and Node throws MODULE_NOT_FOUND at runtime. Bundling also inlines
 * the generated Prisma client, which otherwise never reaches dist/.
 *
 * `packages: "external"` keeps everything in node_modules (express, pg,
 * @prisma/adapter-pg, dotenv, …) as runtime require() calls — only our own
 * src/** code is bundled.
 */
build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node20",
  packages: "external",
  sourcemap: true,
  logLevel: "info",
}).catch(() => process.exit(1));
