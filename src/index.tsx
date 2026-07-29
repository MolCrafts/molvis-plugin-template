/**
 * MolVis page plugin entry.
 *
 * Default-export a module with `id` + `activate`. The host loads this ESM
 * file, injects shared React / molvis-core / molrs, and calls activate.
 */

import { SCALE_X_KIND, ScaleXModifier } from "./modifiers/ScaleXModifier";
import type { MolvisPluginModule, PluginAPI } from "./types/plugin-api";
import { ScaleXPanel } from "./ui/ScaleXPanel";

const plugin: MolvisPluginModule = {
  id: "com.molcrafts.plugin-template",
  name: "MolVis Plugin Template",
  version: "0.1.0",

  activate(api: PluginAPI) {
    api.log.info("plugin-template activated (molrs Frame path enabled)");

    api.modifiers.register(
      SCALE_X_KIND,
      "Geometry",
      // Structural Modifier — host accepts any object with apply/id/…
      () => new ScaleXModifier() as never,
    );

    // Panel is typed against ScaleXModifier; cast is safe — only this kind
    // resolves to this panel.
    api.modifiers.registerPanel(SCALE_X_KIND, (props) => (
      <ScaleXPanel
        modifier={props.modifier as unknown as ScaleXModifier}
        onUpdate={props.onUpdate}
      />
    ));

    api.ui.registerToolbarAction({
      id: "hello",
      label: "Hello plugin",
      onClick: () => {
        api.log.info("toolbar: hello");
        globalThis.alert?.(
          "Hello from MolCrafts/molvis-plugin-template\n(molrs is a peer dep)",
        );
      },
    });

    // Demo: read molrs Frame from the host scene (no second WASM instance).
    api.ui.registerSidebarPanel({
      id: "atom-count",
      title: "Template / molrs",
      order: 100,
      render: ({ app }) => {
        const frame = app?.frame as
          | { getBlock?: (n: string) => { nrows: () => number } | undefined }
          | undefined
          | null;
        const n = frame?.getBlock?.("atoms")?.nrows() ?? 0;
        return (
          <div style={{ padding: "8px 12px", fontSize: 12, opacity: 0.85 }}>
            Current frame atoms (host Frame / molrs): <strong>{n}</strong>
          </div>
        );
      },
    });
  },

  deactivate(api: PluginAPI) {
    api.log.info("plugin-template deactivated");
  },
};

export default plugin;
