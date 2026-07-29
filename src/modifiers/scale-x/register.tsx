import type { PluginAPI } from "../../types/plugin-api";
import { SCALE_X_KIND, ScaleXModifier } from "./ScaleXModifier";
import { ScaleXPanel } from "./ScaleXPanel";

/** Register Scale-X modifier + its property panel (UI lives on the modifier). */
export function registerScaleX(api: PluginAPI): void {
  api.modifiers.register(
    SCALE_X_KIND,
    "Geometry",
    () => new ScaleXModifier() as never,
    {
      panel: (props) => (
        <ScaleXPanel
          modifier={props.modifier as unknown as ScaleXModifier}
          onUpdate={props.onUpdate}
        />
      ),
    },
  );
}
