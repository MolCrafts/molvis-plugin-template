import { defineConfig } from "@rsbuild/core";

/**
 * Library build for MolVis page plugins.
 *
 * - Single ESM file at `dist/plugin.js` (host + jsDelivr entry).
 * - Peer packages externalized so the host injects shared singletons.
 *
 * Do **not** bundle `@molcrafts/molrs` — a second WASM instance breaks Frame
 * identity across the pipeline.
 */
export default defineConfig({
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
    // No HTML shell — plugins are pure ESM modules.
    injectStyles: false,
  },
  html: {
    // Disable default index.html generation for library builds.
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
        "react/jsx-runtime": "react/jsx-runtime",
        "@molcrafts/molvis-core": "@molcrafts/molvis-core",
        "@molvis/core": "@molvis/core",
        "@molcrafts/molrs": "@molcrafts/molrs",
      },
    },
  },
  performance: {
    chunkSplit: {
      strategy: "all-in-one",
    },
  },
});
