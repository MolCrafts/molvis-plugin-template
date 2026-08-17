# molvis-plugin

Scaffold a [MolVis](https://github.com/MolCrafts/molvis) page plugin.

```bash
npx molvis-plugin create
npx molvis-plugin create my-plugin
npx molvis-plugin create my-plugin --id com.acme.demo --name "Acme Demo" -y
```

This repo is a **CLI**, not a plugin you fork. It used to be a
template-repository you cloned and edited in place; everything that made it one
— a demo plugin under `src/`, a vendored copy of the host contract, a shadcn
kit, a build config — was deleted once `@molcrafts/molvis-plugin` started
shipping those. The only artifact here is `template/`, and the CLI's job is to
fill it in.

UX stack is the same family as **create-rsbuild** (`@clack/prompts` +
`minimist`). Rspack is only the **build** engine inside generated projects —
not the CLI.

## What you get

```
my-plugin/
  molvis.plugin.json          # id, name, version, host floor, entry
  rsbuild.config.ts           # externals come from the SDK, not a local list
  tsconfig.json
  .github/workflows/release.yml   # tag v* → build + flat assets on a Release
  src/
    index.tsx                 # activate() → the domain registrations below
    modifiers/scale-x/        # pipeline modifier + its property panel
    analysis/atom-count/      # analysis contribution
    commands/hello/           # palette command
    settings/about/           # settings section
    modes/README.md           # how to add an interaction mode
    overlays/README.md        # how to add a scene overlay
```

One example per extension point, and no more. `modes/` and `overlays/` ship as
prose rather than code because a meaningful example of either needs a real
pointer lifecycle or Babylon meshes, which would be more scaffold than
demonstration.

Then:

```bash
cd my-plugin
npm install
npm run build      # → dist/plugin.js
```

Dependencies default to the published 0.2.0 range
(`@molcrafts/molvis-plugin`, plus the engines as peers). If a MolVis checkout
sits next to the new project (`../molvis`), the scaffolder pins `file:`
paths instead so you can hack the host and the plugin together.

## Public SDK

```ts
import { MolvisPlugin, type PluginAPI } from "@molcrafts/molvis-plugin";
import { Button } from "@molcrafts/molvis-plugin/ui";
```

Never import monorepo `page/` paths.

Take build externals from the SDK rather than retyping them — a plugin that
bundles a host module gets a second React or a second WASM instance:

```ts
import { pluginExternals } from "@molcrafts/molvis-plugin/externals";
```

## Install the plugin in MolVis

**Settings → Plugins** → `owner/repo` or `owner/repo[@v1.2.3]`.

## Developing the CLI

```bash
npm test           # node --test, no framework
```

The substitution rules live in `lib/scaffold.mjs`, kept free of prompts so
they can be tested directly; `lib/create.mjs` is the interactive shell around
them. CI scaffolds a project with no sibling MolVis checkout and runs the
generated project's own `typecheck` and `build` against published
`@molcrafts/molvis-plugin@^0.2.0` — the shipped artifact is `template/`, so
that is what has to be gated.
