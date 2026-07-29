# MolVis plugin template

[![ci](https://github.com/MolCrafts/molvis-plugin-template/actions/workflows/ci.yml/badge.svg)](https://github.com/MolCrafts/molvis-plugin-template/actions/workflows/ci.yml)

Official **template repository** for [MolVis](https://github.com/MolCrafts/molvis)
page plugins. Use **GitHub → Use this template** (or fork) to start a plugin.

| Feature | Support |
|---------|---------|
| Runtime load from GitHub (`owner/repo@tag`) | ✅ |
| React property panels / toolbar / sidebar | ✅ |
| `@molcrafts/molrs` (`Frame` / columns) | ✅ peer + externalized |
| `@molcrafts/molvis-core` modifiers / commands | ✅ peer + externalized |
| Separate types npm package | ❌ (types ship in-repo — see below) |

## Quick start

```bash
# after "Use this template"
npm install
# edit src/
npm run build
git add dist && git commit -m "build plugin"
git tag v0.1.0 && git push origin main --tags
```

In MolVis → **Settings → Plugins** → paste:

```text
YOUR_USER/YOUR_REPO@v0.1.0
```

or, while developing against this official template:

```text
MolCrafts/molvis-plugin-template@master
```

> Trust model: MolVis loads remote ESM with no audit. Only install sources
> you trust.

## Layout

```
molvis.plugin.json     # host manifest (id, entry, version)
src/
  index.tsx            # default export: { id, activate, deactivate? }
  types/plugin-api.ts  # PluginAPI contracts (in-repo)
  modifiers/           # pipeline modifiers (use molrs Frame)
  ui/                  # React panels
dist/plugin.js         # single ESM bundle — commit after build
```

### `molvis.plugin.json`

```json
{
  "id": "com.example.my-plugin",
  "name": "My Plugin",
  "version": "0.1.0",
  "molvis": ">=0.1.0",
  "entry": "dist/plugin.js"
}
```

Change `id` / `name` when you fork.

## Dependencies

### Peers (must externalize — host provides them)

| Package | Why |
|---------|-----|
| `react` / `react-dom` / `react/jsx-runtime` | Shared React tree |
| `@molcrafts/molvis-core` | `BaseModifier`, commands, overlays |
| `@molcrafts/molrs` | `Frame` / `Block` WASM types **shared with host** |

**Never bundle molrs.** A second WASM instance breaks frame identity in the
pipeline. The rsbuild config already externalizes all peers.

### molrs usage pattern

```ts
import type { Frame } from "@molcrafts/molrs";
import { BaseModifier, ModifierCapability } from "@molcrafts/molvis-core";

apply(input: Frame, _ctx): Frame {
  const atoms = input.getBlock("atoms");
  // … copy columns, clone frame, write back …
  return next;
}
```

See `src/modifiers/ScaleXModifier.ts`.

## Types package?

**Not as a separate npm package (for now).** Reasons:

1. Plugin API is still experimental in MolVis.
2. Domain types already come from `@molcrafts/molvis-core` + `@molcrafts/molrs`.
3. `src/types/plugin-api.ts` is the contract surface; keep it in sync with
   molvis `page/src/plugins/types.ts`.

When the host API stabilizes, MolCrafts may publish
`@molcrafts/molvis-plugin-api` (types-only). Until then, fork this file.

## Build rules

```bash
npm run build      # → dist/plugin.js (single ESM file)
npm run typecheck
npm run check      # typecheck + build
```

Commit **`dist/`** before tagging so jsDelivr can serve:

`https://cdn.jsdelivr.net/gh/USER/REPO@TAG/dist/plugin.js`

CI fails if `dist/` is stale relative to source.

## Plugin API sketch

```ts
activate(api) {
  api.modifiers.register(kind, category, factory)
  api.modifiers.registerPanel(kind, Component)
  api.commands.register(name, fn)
  api.modes.register(id, factory)
  api.overlays.add(overlay)
  api.analysis.register(spec)
  api.ui.registerSidebarPanel(spec)
  api.ui.registerToolbarAction(spec)
  api.ui.registerSettingsSection(spec)
  api.ui.registerModePanel(mode, spec)
  api.rpc.registerMethod(name, handler) // → plugin.<id>.name
}
```

Full definitions: [`src/types/plugin-api.ts`](./src/types/plugin-api.ts).  
Host docs: [MolVis plugins](https://github.com/MolCrafts/molvis/blob/master/docs/development/plugins.md).

## License

BSD-3-Clause — see [LICENSE](./LICENSE).
