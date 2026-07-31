import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

/**
 * Library build for MolVis page plugins (React 19 + automatic JSX).
 *
 * - Single ESM file at `dist/plugin.js` (host + jsDelivr entry).
 * - Peer packages externalized so the host injects shared singletons.
 * - `@rsbuild/plugin-react` = modern JSX transform (no free `React.createElement`).
 *
 * Do **not** bundle `@molcrafts/molrs` — a second WASM instance breaks Frame
 * identity across the pipeline.
 */
export default defineConfig({
  plugins: [
    pluginReact({
      swcReactOptions: {
        runtime: "automatic",
        importSource: "react",
      },
    }),
  ],
  source: {
    entry: {
      index: "./src/index.tsx",
    },
  },
  output: {
    target: "web",
    distPath: {
      root: "dist",
      js: "./",
    },
    filename: {
      js: "plugin.js",
    },
    minify: true,
    sourceMap: false,
    cleanDistPath: true,
    injectStyles: false,
  },
  html: {
    template: false as unknown as string,
  },
  tools: {
    htmlPlugin: false,
    rspack: {
      output: {
        library: { type: "module" },
        chunkFormat: "module",
        module: true,
      },
      experiments: {
        outputModule: true,
      },
      externalsType: "module",
      externals: {
        react: "react",
        "react-dom": "react-dom",
        "react-dom/client": "react-dom/client",
        "react/jsx-runtime": "react/jsx-runtime",
        "react/jsx-dev-runtime": "react/jsx-dev-runtime",
        "@molcrafts/molvis-core": "@molcrafts/molvis-core",
        "@molvis/core": "@molvis/core",
        "@molcrafts/molrs": "@molcrafts/molrs",
        "@molcrafts/molplot": "@molcrafts/molplot",
        "@molvis/stage": "@molvis/stage",
        "@molcrafts/molvis-stage": "@molcrafts/molvis-stage",
      },
    },
  },
  performance: {
    chunkSplit: {
      strategy: "all-in-one",
    },
  },
});
