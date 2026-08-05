/**
 * MolVis page plugin entry — domain-oriented registration.
 *
 * Each folder under `src/` is one contribution domain. UI for a domain is
 * registered *with* that domain. Optional OOP base: {@link MolvisPlugin}.
 */

import { registerAtomCountAnalysis } from "./analysis/atom-count/register";
import { registerHelloCommand } from "./commands/hello/register";
import { registerScaleX } from "./modifiers/scale-x/register";
import { MolvisPlugin } from "./plugin/MolvisPlugin";
import { registerAboutSettings } from "./settings/about/register";
import type { PluginAPI } from "./types/plugin-api";

class TemplatePlugin extends MolvisPlugin {
  readonly id = "com.molcrafts.plugin-template";
  readonly name = "MolVis Plugin Template";
  readonly version = "0.1.1";

  activate(api: PluginAPI): void {
    api.log.info("plugin-template activate (domain-oriented)");

    registerScaleX(api);
    registerAtomCountAnalysis(api);
    registerHelloCommand(api);
    registerAboutSettings(api);
  }

  deactivate(api: PluginAPI): void {
    api.log.info("plugin-template deactivate");
  }
}

export default new TemplatePlugin();
