import type { PluginAPI } from "../../types/plugin-api";

/** Plugin-owned Settings section (prefs for *this* plugin only). */
export function registerAboutSettings(api: PluginAPI): void {
  api.settings.registerSection({
    id: "about",
    title: "Plugin template",
    order: 100,
    render: () => (
      <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.45 }}>
        Official domain-oriented scaffold. Contribution folders under{" "}
        <code>src/</code>: modifiers · modes · analysis · commands · overlays ·
        settings.
      </div>
    ),
  });
}
