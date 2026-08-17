import type { PluginAPI } from "@molcrafts/molvis-plugin";
import { Button } from "@molcrafts/molvis-plugin/ui";

export function registerAboutSettings(api: PluginAPI): void {
  api.settings.registerSection({
    id: "about",
    title: "{{pluginName}}",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ margin: 0, fontSize: "var(--text-body, 0.8125rem)" }}>
          {{pluginName}} ({{pluginId}} @ {{version}})
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => api.log.info("ping from settings")}
        >
          Ping log
        </Button>
      </div>
    ),
  });
}
