# MolVis plugin template

[![ci](https://github.com/MolCrafts/molvis-plugin-template/actions/workflows/ci.yml/badge.svg)](https://github.com/MolCrafts/molvis-plugin-template/actions/workflows/ci.yml)

Official **template repository** for [MolVis](https://github.com/MolCrafts/molvis)
page plugins. Use **GitHub → Use this template** (or fork).

Reference collection:
[molvis-plugins-official](https://github.com/MolCrafts/molvis-plugins-official).

## Contribution domains (not a free-form UI bag)

Each plugin extends one or more **domains**. UI for that domain is registered
**with the domain**, not under a separate `api.ui`:

| Domain | Folder | Logic | UI (owned by the domain) |
|--------|--------|--------|---------------------------|
| **modifiers** | `src/modifiers/` | pipeline factory | property panel |
| **modes** | `src/modes/` | interaction mode | tools panel while mode is active |
| **analysis** | `src/analysis/` | compute | left Analysis picker + params + result |
| **commands** | `src/commands/` | named action | optional toolbar button |
| **overlays** | `src/overlays/` | scene decoration | — |
| **settings** | `src/settings/` | plugin prefs | Settings section for *this* plugin |
| **rpc** | (in activate) | JSON-RPC | — |

```
src/
  index.tsx                 # activate → call each domain register()
  types/plugin-api.ts       # PluginAPI contract (vendored host types)
  modifiers/scale-x/        # example modifier + panel
  analysis/atom-count/      # example analysis (picker “Plugins” group)
  commands/hello/           # example command + toolbar
  settings/about/           # example plugin settings section
  modes/                    # README — how to add a mode
  overlays/                 # README — how to add overlays
```

### API sketch

```ts
// Modifier + its panel in one call
api.modifiers.register(kind, category, factory, { panel: ScaleXPanel });

// Analysis (form + run + result are part of the spec)
api.analysis.register({ id, label, params, run, resultKind });

// Command + optional toolbar chrome
api.commands.register("hello", fn, { toolbar: { label: "Hello" } });

// Mode + tools panel
api.modes.register("my-mode", factory, { panel: { id, render } });
api.modes.registerToolsPanel("view", { id, title, render });

// Plugin settings only
api.settings.registerSection({ id, title, render });

api.overlays.add(overlay);
api.rpc.registerMethod("ping", handler);
```

There is **no** generic `api.ui.registerSidebarPanel` /
`registerToolbarAction` host-chrome API.

## Quick start

```bash
npm install
# edit a domain under src/
npm run build
npm run check          # contract hash + typecheck + build
git add dist && git commit -m "build plugin"
git tag v0.1.0 && git push origin master --tags
```

Install in MolVis → **Settings → Plugins**:

```
YOUR_USER/YOUR_REPO@v0.1.0
```

jsDelivr serves the **git tree** (must commit `dist/`):

```
https://cdn.jsdelivr.net/gh/YOUR_USER/YOUR_REPO@v0.1.0/
```

Host inject:

```jsonc
// VS Code
"molvis.plugins": ["YOUR_USER/YOUR_REPO@v0.1.0"]
```

```python
Molvis(plugins=["YOUR_USER/YOUR_REPO@v0.1.0"])
```

> Trust model: remote ESM runs in the page. Only install sources you trust.

## Local debug

Browsers cannot load `file://`. After `npm run build`, serve the repo root over
HTTP and paste that origin in **Settings → Plugins**, then **Reload** on each
change:

```bash
npm run build
npx --yes serve -l 4173 --cors .
# plugin source: http://127.0.0.1:4173/
```

Or point at the entry / manifest explicitly:

| What | URL |
|------|-----|
| Directory (manifest) | `http://127.0.0.1:4173/` |
| Manifest | `http://127.0.0.1:4173/molvis.plugin.json` |
| Entry | `http://127.0.0.1:4173/dist/plugin.js` |

## Peers (externalize — never bundle)

| Package | Why |
|---------|-----|
| `react` / `react-dom` / `react/jsx-runtime` | Shared React 19 tree |
| `@molcrafts/molvis-core` | modifiers, modes, overlays, stage |
| `@molcrafts/molrs` **≥0.12** | `Frame` / WASM shared with host |

Keep peer ranges aligned with the host MolVis release (see official plugins).

## Multi-chunk

Host recursively rewrites **relative** imports under your entry. You may split:

```js
// dist/plugin.js
export { default } from "./activate.js";
```

Keep chunks on the same origin as `entry`.

## Build & CI

```bash
npm run build           # → dist/plugin.js
npm run typecheck
npm run check:contract  # vendored PluginAPI hash gate
npm run check           # contract + typecheck + build
```

CI runs `check:contract`, `typecheck`, and `build`, and fails if `dist/` is
dirty. Commit **`dist/`** before tagging.

## License

BSD-3-Clause — see [LICENSE](./LICENSE).
