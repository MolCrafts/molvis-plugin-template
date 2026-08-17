import type { PluginAPI } from "@molcrafts/molvis-plugin";

export function registerHelloCommand(api: PluginAPI): void {
  api.commands.register(
    "hello",
    () => {
      api.log.info("Hello from {{pluginName}}");
    },
    { toolbar: { label: "Hello ({{pluginName}})" } },
  );
}
