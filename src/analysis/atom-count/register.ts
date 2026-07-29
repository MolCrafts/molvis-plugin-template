import type { PluginAPI } from "../../types/plugin-api";

/**
 * Example analysis — appears in the left Analysis picker under **Plugins**.
 * Params form + result view are part of this domain (no separate ui.* API).
 */
export function registerAtomCountAnalysis(api: PluginAPI): void {
  api.analysis.register({
    id: "atom-count",
    label: "Atom count (template)",
    description: "Count atoms in the current frame (demo plugin analysis).",
    params: [
      {
        name: "label",
        label: "Result label",
        kind: "text",
        default: "N",
      },
    ],
    resultKind: "scalar",
    run: async ({ app, params }) => {
      const frame = app.frame as
        | { getBlock?: (n: string) => { nrows: () => number } | undefined }
        | null
        | undefined;
      const n = frame?.getBlock?.("atoms")?.nrows() ?? 0;
      const label = String(params.label ?? "N");
      return { data: { value: n, label } };
    },
  });
}
