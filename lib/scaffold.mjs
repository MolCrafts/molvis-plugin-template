/**
 * Pure scaffolding logic for `molvis-plugin create`.
 *
 * Everything here is prompt-free and side-effect-free apart from
 * `writeProject`, so the substitution rules can be unit tested without
 * driving the interactive CLI.
 */
import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

/** Files whose contents carry `{{var}}` placeholders. */
const TEMPLATED = /\.(tsx?|jsx?|json|md|css|mjs|cjs)$/i;

/**
 * npm mangles dot-prefixed paths in published tarballs — `.gitignore` is
 * dropped outright — so the template ships them underscore-prefixed and they
 * are restored on write. `_github` is a directory segment, hence the two
 * patterns rather than one.
 */
const DOTFILE = /(^|[/\\])_(gitignore|npmrc|npmignore)$/;
const DOTDIR = /(^|[/\\])_(github)([/\\])/g;

export function slugify(s) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function toPluginId(slug) {
  const parts = slug.replace(/-/g, ".").replace(/^\.+|\.+$/g, "");
  return `com.example.${parts}`;
}

export function titleCase(slug) {
  return slug
    .split(/[-_.]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Template-relative paths, `node_modules` / `dist` pruned. */
export function collectTemplateFiles(dir, base = dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist") continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) collectTemplateFiles(path, base, acc);
    else acc.push(path.slice(base.length + 1));
  }
  return acc;
}

/** Template-relative path → path written into the generated project. */
export function scaffoldPathFor(rel) {
  return rel.replace(DOTDIR, "$1.$2$3").replace(DOTFILE, "$1.$2");
}

/** Unknown placeholders are left verbatim so they surface in review. */
export function applyTemplate(text, vars) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    key in vars ? String(vars[key]) : `{{${key}}}`,
  );
}

/** Dependency specifiers, pinned to a sibling checkout when one is present. */
export function dependencyVars(hasSibling) {
  return {
    molvisDep: hasSibling ? "file:../molvis" : "^0.2.0",
    molvisPluginDep: hasSibling ? "file:../molvis/plugin" : "^0.2.0",
    molvisCoreDep: hasSibling ? "file:../molvis/core" : "^0.2.0",
    molvisStageDep: hasSibling ? "file:../molvis/stage" : "^0.2.0",
  };
}

/** Renders `templateDir` into `target`. Returns the written relative paths. */
export function writeProject(templateDir, target, vars) {
  const written = [];
  mkdirSync(target, { recursive: true });
  for (const rel of collectTemplateFiles(templateDir)) {
    const out = scaffoldPathFor(rel);
    const dest = join(target, out);
    mkdirSync(dirname(dest), { recursive: true });
    if (TEMPLATED.test(rel) || !rel.includes(".")) {
      writeFileSync(dest, applyTemplate(readFileSync(join(templateDir, rel), "utf8"), vars));
    } else {
      copyFileSync(join(templateDir, rel), dest);
    }
    written.push(out);
  }
  return written;
}
