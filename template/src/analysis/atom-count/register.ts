import type { PluginAPI } from "@molcrafts/molvis-plugin";

export function registerAtomCountAnalysis(api: PluginAPI): void {
  api.analysis.register({
    id: "atom-count",
    label: "Atom count",
    description: "Count atoms in the current frame",
    params: [],
    resultKind: "scalar",
    run: ({ app }) => {
      const frame = app.system?.frame;
      const atoms = frame?.getBlock?.("atoms");
      const n = atoms?.nrows?.() ?? 0;
      return { data: { count: n } };
    },
  });
}
