#!/usr/bin/env node
/**
 * Flatten `dist/` into `release-assets/` for GitHub Releases.
 * Manifest entry → `plugin.js`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "release-assets");
const dist = path.join(root, "dist");

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

if (!fs.existsSync(path.join(dist, "plugin.js"))) {
  console.error("dist/plugin.js missing — run npm run build first");
  process.exit(1);
}

for (const name of fs.readdirSync(dist)) {
  if (name.endsWith(".map") || name.endsWith(".LICENSE.txt")) continue;
  const s = path.join(dist, name);
  if (fs.statSync(s).isFile()) {
    fs.copyFileSync(s, path.join(outDir, name));
  }
}

const man = JSON.parse(
  fs.readFileSync(path.join(root, "molvis.plugin.json"), "utf8"),
);
man.entry = "plugin.js";
fs.writeFileSync(
  path.join(outDir, "molvis.plugin.json"),
  `${JSON.stringify(man, null, 2)}\n`,
);
console.log("[prepare-release] → release-assets/");
