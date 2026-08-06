import type { ModifierPanelComponent } from "@molcrafts/molvis-plugin";
import type { ScaleXModifier } from "./ScaleXModifier";

export const ScaleXPanel: ModifierPanelComponent = ({
  modifier,
  onUpdate,
}) => {
  const m = modifier as ScaleXModifier;
  return (
    <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <span>Scale X</span>
      <input
        type="number"
        step={0.1}
        value={m.factor}
        onChange={(e) => {
          m.factor = Number(e.target.value) || 1;
          onUpdate();
        }}
      />
    </label>
  );
};
