# Plugin architecture

## Goals

1. **Domain-oriented contributions** — modifiers / modes / analysis / commands /
   settings / overlays / rpc. UI is owned by the domain that owns the logic.
2. **Thin activate** — `index.tsx` only wires domain `register(api)` calls.
3. **OOP where it helps** — use classes for *stateful domain objects*
   (modifiers, modes, long-lived services). Keep registration as plain
   functions. See `src/plugin/MolvisPlugin.ts` for an optional entry base.
4. **No committed `dist/`** — build in CI; ship via **GitHub Release** assets.

## Layout

```
src/
  index.tsx                 # activate → domain registers only
  plugin/MolvisPlugin.ts    # optional OOP entry base
  types/                    # vendored host contract (hash-gated)
  modifiers/<feature>/      # Modifier class + panel + register()
  analysis/<feature>/
  commands/<feature>/
  modes/
  overlays/
  settings/
```

## OOP evaluation (decision)

| Use a class | Prefer a function / module |
|-------------|----------------------------|
| Pipeline `Modifier` with lifecycle | `register(api)` one-liners |
| Interaction `Mode` with event state | Pure param schemas / generators |
| Kernel / session host (long-lived) | Manifest constants |
| Optional `MolvisPlugin` entry | Random utils |

**Do not** invent a second plugin framework (decorators, DI containers). The
host `PluginAPI` is the composition root.

## Release

```bash
npm run build
node scripts/prepare-release-assets.mjs   # → release-assets/
# CI on tag v* uploads release-assets/* to GitHub Release
```

Install: `owner/repo@v1.2.3` → host loads Release download base (flat files).
Local debug: `npm run build && npx serve -l 4173 --cors .` then
`http://127.0.0.1:4173/dist/plugin.js` (or package root with `dist/` entry).
