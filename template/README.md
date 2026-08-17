# {{pluginName}}

MolVis page plugin scaffolded with `@molcrafts/create-molvis-plugin`.

## Develop

```bash
npm install
npm run build
npx --yes serve -l 4173 --cors .
```

In MolVis: **Settings → Plugins** → `owner/repo[@v1.2.3]` (or local
`http://127.0.0.1:4173/`).

## Author against the public SDK

```ts
import { MolvisPlugin, type PluginAPI } from "@molcrafts/molvis-plugin";
import { Button } from "@molcrafts/molvis-plugin/ui";
import { pluginExternals } from "@molcrafts/molvis-plugin/externals";
```

Do **not** import monorepo paths like `page/src/...`. CSS tokens and shadcn
primitives are re-exported from `@molcrafts/molvis-plugin`.

## Release

```bash
npm run build
npm run prepare:release
git tag v{{version}}
git push origin HEAD --tags
```
