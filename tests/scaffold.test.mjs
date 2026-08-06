import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  applyTemplate,
  collectTemplateFiles,
  dependencyVars,
  scaffoldPathFor,
  slugify,
  titleCase,
  toPluginId,
  writeProject,
} from "../lib/scaffold.mjs";

const TEMPLATE = resolve(dirname(fileURLToPath(import.meta.url)), "..", "template");

function inTempDir(fn) {
  const dir = mkdtempSync(join(tmpdir(), "molvis-plugin-"));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("slugify lowercases and collapses runs of non-alphanumerics", () => {
  assert.equal(slugify("  My Cool Plugin!! "), "my-cool-plugin");
});

test("slugify caps the slug at 64 characters", () => {
  assert.equal(slugify("a".repeat(100)).length, 64);
});

test("toPluginId builds a reverse-DNS id under com.example", () => {
  assert.equal(toPluginId("my-cool-plugin"), "com.example.my.cool.plugin");
});

test("toPluginId output satisfies the CLI's own id validator", () => {
  const validator = /^[a-z][a-z0-9_.-]*(\.[a-z0-9_.-]+)+$/i;
  assert.match(toPluginId(slugify("Acme Demo")), validator);
});

test("titleCase splits on dashes, underscores and dots", () => {
  assert.equal(titleCase("my-cool_plugin.v2"), "My Cool Plugin V2");
});

test("applyTemplate substitutes known placeholders", () => {
  assert.equal(applyTemplate("id={{pluginId}}", { pluginId: "com.acme.x" }), "id=com.acme.x");
});

test("applyTemplate leaves unknown placeholders verbatim", () => {
  assert.equal(applyTemplate("{{nope}}", { pluginId: "x" }), "{{nope}}");
});

test("scaffoldPathFor restores underscore-prefixed dotfiles", () => {
  assert.equal(scaffoldPathFor("_gitignore"), ".gitignore");
  assert.equal(scaffoldPathFor(join("nested", "_npmrc")), join("nested", ".npmrc"));
});

test("scaffoldPathFor restores the _github directory segment", () => {
  assert.equal(
    scaffoldPathFor(join("_github", "workflows", "release.yml")),
    join(".github", "workflows", "release.yml"),
  );
});

test("scaffoldPathFor leaves ordinary paths untouched", () => {
  assert.equal(scaffoldPathFor("src/index.tsx"), "src/index.tsx");
});

test("collectTemplateFiles prunes node_modules and dist", () => {
  const files = collectTemplateFiles(TEMPLATE);
  assert.ok(files.length > 0);
  assert.equal(
    files.filter((f) => f.includes("node_modules") || f.startsWith("dist")).length,
    0,
  );
});

test("dependencyVars points at a sibling checkout when one exists", () => {
  assert.equal(dependencyVars(true).molvisPluginDep, "file:../molvis/plugin");
});

test("dependencyVars falls back to the published range", () => {
  assert.equal(dependencyVars(false).molvisPluginDep, "^0.2.0");
});

test("writeProject ships the template gitignore as a real dotfile", () => {
  inTempDir((dir) => {
    const target = join(dir, "proj");
    writeProject(TEMPLATE, target, { pluginId: "com.acme.x", pluginName: "X" });
    assert.ok(readdirSync(target).includes(".gitignore"));
    assert.ok(!readdirSync(target).includes("_gitignore"));
  });
});

test("writeProject ships a runnable release workflow under .github", () => {
  inTempDir((dir) => {
    const target = join(dir, "proj");
    const written = writeProject(TEMPLATE, target, {
      pluginId: "com.acme.x",
      pluginName: "X",
    });
    assert.ok(written.includes(join(".github", "workflows", "release.yml")));
    assert.ok(!written.some((p) => p.startsWith("_github")));
  });
});

test("the generated project has no scripts/ directory", () => {
  inTempDir((dir) => {
    const target = join(dir, "proj");
    const written = writeProject(TEMPLATE, target, {
      pluginId: "com.acme.x",
      pluginName: "X",
    });
    assert.deepEqual(
      written.filter((p) => p.split(/[/\\]/).includes("scripts")),
      [],
    );
  });
});

test("writeProject leaves no unsubstituted placeholders in the generated project", () => {
  inTempDir((dir) => {
    const target = join(dir, "proj");
    const vars = {
      pluginId: "com.acme.demo",
      pluginName: "Acme Demo",
      packageName: "acme-demo",
      version: "0.1.0",
      year: "2026",
      ...dependencyVars(false),
    };
    const written = writeProject(TEMPLATE, target, vars);
    const leftovers = written
      .map((rel) => [rel, readFileSync(join(target, rel), "utf8")])
      .filter(([, text]) => /\{\{\w+\}\}/.test(text))
      .map(([rel, text]) => `${rel}: ${text.match(/\{\{\w+\}\}/g).join(", ")}`);
    assert.deepEqual(leftovers, []);
  });
});
