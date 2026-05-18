// @ts-check
const { build } = require("esbuild");
const path = require("path");
const fs = require("fs");

/**
 * Recursively collect all .ts source files under `dir`, skipping the
 * `scripts/` sub-tree (seed scripts are run via ts-node, not compiled).
 */
function collectTs(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "scripts") collectTs(full, results);
    } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")) {
      results.push(full);
    }
  }
  return results;
}

build({
  entryPoints: collectTs("src"),
  outdir: "dist",
  outbase: "src",
  platform: "node",
  format: "cjs",
  target: "node20",
  sourcemap: true,
  bundle: false,
  logLevel: "info",
}).catch(() => process.exit(1));
