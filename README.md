# MolVis plugin template

[![ci](https://github.com/MolCrafts/molvis-plugin-template/actions/workflows/ci.yml/badge.svg)](https://github.com/MolCrafts/molvis-plugin-template/actions/workflows/ci.yml)

Official **template repository** for [MolVis](https://github.com/MolCrafts/molvis)
page plugins. Use **GitHub → Use this template** (or fork).

Reference collection:
[molvis-plugins-official](https://github.com/MolCrafts/molvis-plugins-official).

Architecture & OOP policy: [ARCHITECTURE.md](./ARCHITECTURE.md).

## Contribution domains

| Domain | Folder | Logic | UI |
|--------|--------|--------|-----|
| **modifiers** | `src/modifiers/` | pipeline factory | property panel |
| **modes** | `src/modes/` | interaction mode | tools panel |
| **analysis** | `src/analysis/` | compute | left Analysis picker |
| **commands** | `src/commands/` | named action | optional toolbar |
| **overlays** | `src/overlays/` | scene decoration | — |
| **settings** | `src/settings/` | plugin prefs | Settings section |
| **rpc** | (in activate) | JSON-RPC | — |

Optional OOP entry: extend `MolvisPlugin` in `src/plugin/MolvisPlugin.ts`.

## Quick start

```bash
npm install
npm run build
npm run check
# local install URL:
npx --yes serve -l 4173 --cors .
# MolVis → Settings → Plugins → http://127.0.0.1:4173/dist/plugin.js
```

## Release (no committed dist/)

```bash
npm run build
npm run prepare:release
git tag v0.1.2
git push origin master --tags   # release.yml uploads release-assets/*
```

Install: `YOUR_USER/YOUR_REPO@v0.1.2`
