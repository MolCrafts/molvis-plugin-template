/**
 * {{pluginName}} — MolVis page plugin entry.
 *
 * Extend {@link MolvisPlugin} from the public SDK. Never import monorepo
 * `page/` paths — use `@molcrafts/molvis-plugin` only.
 */

import { MolvisPlugin, type PluginAPI } from "@molcrafts/molvis-plugin";
import { registerAtomCountAnalysis } from "./analysis/atom-count/register";
import { registerHelloCommand } from "./commands/hello/register";
import { registerScaleX } from "./modifiers/scale-x/register";
import { registerAboutSettings } from "./settings/about/register";

class Plugin extends MolvisPlugin {
  readonly id = "{{pluginId}}";
  readonly name = "{{pluginName}}";
  readonly version = "{{version}}";

  activate(api: PluginAPI): void {
    api.log.info("{{pluginId}} activate");
    registerScaleX(api);
    registerAtomCountAnalysis(api);
    registerHelloCommand(api);
    registerAboutSettings(api);
  }

  deactivate(api: PluginAPI): void {
    api.log.info("{{pluginId}} deactivate");
  }
}

export default new Plugin();
