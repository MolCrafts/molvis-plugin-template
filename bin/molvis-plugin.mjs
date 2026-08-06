#!/usr/bin/env node
/**
 * MolVis plugin CLI (same stack as create-rsbuild / create-rstack:
 * @clack/prompts + minimist — not Rspack; Rspack is a bundler only.)
 *
 *   npx molvis-plugin create
 *   npx molvis-plugin create my-plugin
 *   npx molvis-plugin create my-plugin --id com.acme.demo --name "Acme Demo" -y
 */
import minimist from "minimist";
import { createPlugin } from "../lib/create.mjs";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pkg = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "..", "package.json"),
    "utf8",
  ),
);

const argv = minimist(process.argv.slice(2), {
  boolean: ["yes", "help", "version"],
  alias: { y: "yes", h: "help", v: "version" },
  string: ["id", "name", "version"],
  // allow --version=0.1.0 without colliding with -v package version
  default: {},
});

// `npx molvis-plugin` / `… create` / `… create my-dir`
const positionals = argv._.map(String);
let cmd = positionals[0];
let dir = positionals[1];

// Default subcommand = create (bare `npx molvis-plugin` or `… my-dir`)
if (!cmd || cmd === "create") {
  if (cmd === "create") {
    dir = positionals[1];
  } else {
    // first token is the directory, not a subcommand
    dir = cmd;
    cmd = "create";
  }
}

if (argv.help || cmd === "help") {
  console.log(`molvis-plugin v${pkg.version}

Usage:
  npx molvis-plugin create [dir] [options]
  npx molvis-plugin [dir]              # same as create

Options:
  --id <id>         Plugin id (e.g. com.acme.demo)
  --name <name>     Display name
  --version <ver>   Initial package version (default 0.1.0)
  -y, --yes         Non-interactive
  -h, --help        Show help

Scaffold uses @clack/prompts (same family as create-rsbuild).
`);
  process.exit(0);
}

// Package version flag only when no create version string was intended as -v alone
if (argv.version === true || (positionals.length === 0 && argv.v === true)) {
  console.log(pkg.version);
  process.exit(0);
}

if (cmd !== "create") {
  console.error(`Unknown command: ${cmd}\nRun: npx molvis-plugin create --help`);
  process.exit(1);
}

const initialVersion =
  typeof argv.version === "string" && argv.version.length > 0
    ? argv.version
    : "0.1.0";

await createPlugin({
  dir: dir ?? null,
  id: argv.id ?? null,
  name: argv.name ?? null,
  version: initialVersion,
  yes: Boolean(argv.yes),
});
