import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginExternals } from "@molcrafts/molvis-plugin/externals";

/**
 * MolVis page plugin build.
 * Externals = host inject list from the public SDK.
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
    distPath: { root: "dist", js: "./" },
    filename: { js: "plugin.js" },
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
      } as Record<string, unknown>,
      externalsType: "module",
      externals: { ...pluginExternals },
    },
  },
  performance: {
    chunkSplit: { strategy: "all-in-one" },
  },
});
