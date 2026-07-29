import type { PluginAPI } from "../../types/plugin-api";

/**
 * Example command — toolbar button is optional chrome *of the command*,
 * not a free-floating UI contribution.
 */
export function registerHelloCommand(api: PluginAPI): void {
  api.commands.register(
    "hello",
    (_app, _args) => {
      api.log.info("hello command");
      globalThis.alert?.(
        "Hello from MolCrafts/molvis-plugin-template\n(command + toolbar)",
      );
    },
    {
      toolbar: {
        label: "Hello plugin",
      },
    },
  );
}
