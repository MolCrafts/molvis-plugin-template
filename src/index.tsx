/**
 * MolVis page plugin entry — domain-oriented registration.
 *
 * Each folder under `src/` is one contribution domain. UI for a domain is
 * registered *with* that domain (modifier panel, analysis form, command
 * toolbar, mode tools, settings section) — there is no `api.ui`.
 */

import { registerAtomCountAnalysis } from "./analysis/atom-count/register";
import { registerHelloCommand } from "./commands/hello/register";
import { registerScaleX } from "./modifiers/scale-x/register";
import { registerAboutSettings } from "./settings/about/register";
import type { MolvisPluginModule, PluginAPI } from "./types/plugin-api";

const plugin: MolvisPluginModule = {
  id: "com.molcrafts.plugin-template",
  name: "MolVis Plugin Template",
  version: "0.1.0",

  activate(api: PluginAPI) {
    api.log.info("plugin-template activate (domain-oriented)");

    registerScaleX(api); // modifiers/ + property panel
    registerAtomCountAnalysis(api); // analysis/ → left picker "Plugins"
    registerHelloCommand(api); // commands/ + optional toolbar
    registerAboutSettings(api); // settings/ (plugin prefs only)

    // modes/ and overlays/ — see README in those folders.
  },

  deactivate(api: PluginAPI) {
    api.log.info("plugin-template deactivate");
  },
};

export default plugin;
