import type { PluginAPI } from "@molcrafts/molvis-plugin";
import { SCALE_X_KIND, ScaleXModifier } from "./ScaleXModifier";
import { ScaleXPanel } from "./ScaleXPanel";

export function registerScaleX(api: PluginAPI): void {
  api.modifiers.register(SCALE_X_KIND, "Modification", () => new ScaleXModifier(), {
    panel: ScaleXPanel,
  });
}
