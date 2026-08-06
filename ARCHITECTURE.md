# molvis-plugin CLI

## What this repo is

A scaffolder. Three pieces, nothing else:

| Path | Role |
|------|------|
| `bin/molvis-plugin.mjs` | argv parsing, `--help`, dispatch |
| `lib/scaffold.mjs` | pure substitution rules — slugs, ids, template rendering |
| `lib/create.mjs` | the interactive shell around those rules |
| `template/` | the project that gets written out; the only shipped artifact |
| `tests/` | unit tests for the substitution rules |

There is **no `scripts/` directory**, here or in the generated project. A
loose script has no owner, no test and no gate; checks belong in
`package.json` + CI + pre-commit, and packaging belongs in the release
workflow.

`package.json` `files` lists exactly `bin`, `lib`, `template` and the docs. If
something is not reachable from those, it does not belong here.

## Not Rspack

**Rspack** is a bundler (webpack-compatible). It has no scaffold/prompt library.

**Rsbuild**'s `create-rsbuild` → `create-rstack` uses:

| Piece | Role |
|-------|------|
| `@clack/prompts` | Interactive prompts (mainstream "pretty create CLI") |
| `minimist` | `argv` flags |
| rslib bundle | Published tarball often has **zero** runtime deps |

We match that: **Clack + minimist only** (no citty / picocolors).

## Entry

```
npx molvis-plugin create [dir] [--id] [--name] [--version] [-y]
```

`create-molvis-plugin` is an alias for the same bin.

## Why the pure/interactive split

`lib/scaffold.mjs` holds every rule that decides what lands on disk and imports
no prompt library, so `tests/scaffold.test.mjs` can drive it directly. The
project's own design rules permit extracting a helper when a unit test needs to
target it, which is the case here — before the split, 230 lines of substitution
logic had no coverage at all because reaching them meant driving a TTY.

## Two traps the tests exist to hold shut

**npm mangles dot-prefixed paths in published tarballs** — `.gitignore` is
dropped outright. The template therefore ships `_gitignore` and
`_github/workflows/`, and `scaffoldPathFor()` restores both on write. Without
this, every project scaffolded via `npx` (as opposed to a local checkout)
starts with no `.gitignore` and no release workflow. `npm pack --dry-run`
confirmed the gitignore was absent from the tarball for real.

**Unsubstituted placeholders are invisible until a user hits them.** One test
scaffolds into a temp directory and asserts no `{{var}}` survives in any
written file, so adding a placeholder to the template without adding it to
`vars` fails here rather than in someone's editor.

## What CI gates

The shipped artifact is `template/`, so gating this repo's own sources would
prove nothing — for a while the situation was exactly inverted, with `tsconfig`
covering a `src/` that was never published while `template/` compiled nowhere.

CI therefore has two jobs:

1. `test` — `node --test` over `tests/`.
2. `scaffold` — check out MolVis, build the SDK, scaffold a project beside it
   so sibling detection rewrites the deps to `file:../molvis/*`, then run the
   **generated** project's `npm install && npm run typecheck && npm run build`.

Job 2 exists because `@molcrafts/molvis-plugin` is not published yet. When it
is, the sibling checkout can go and the scaffold job becomes a plain
`npx molvis-plugin create && npm install && npm run build`.

## Contract distribution

The template used to vendor `contract.ts` + `contract.lock.json` and verify
them with a hash check. That is gone. The lockfile was a self-consistency hash:
it could tell you the vendored copy matched itself, not that it matched the
host — and by the time it was removed the copy had drifted 38 lines while
reporting "intact". The generated project depends on the published SDK
instead, and the host binds its inject map to `pluginExternals` with
`satisfies`, so drift is a compile error on the host side where it belongs.
