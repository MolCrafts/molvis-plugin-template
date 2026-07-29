import type { FC } from "react";
import { useState } from "react";
import type { ScaleXModifier } from "./ScaleXModifier";

/** Property panel for {@link ScaleXModifier} — owned by the modifier domain. */
export const ScaleXPanel: FC<{
  modifier: ScaleXModifier;
  onUpdate: () => void;
}> = ({ modifier, onUpdate }) => {
  const [value, setValue] = useState(modifier.factor);

  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        fontSize: 12,
        padding: "0 4px",
      }}
    >
      <span style={{ opacity: 0.7 }}>X scale factor</span>
      <input
        type="number"
        step={0.1}
        min={0.1}
        max={10}
        value={value}
        style={{
          height: 28,
          borderRadius: 4,
          border: "1px solid color-mix(in srgb, currentColor 25%, transparent)",
          background: "transparent",
          padding: "0 8px",
          color: "inherit",
        }}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (!Number.isFinite(next)) return;
          setValue(next);
          modifier.factor = next;
          onUpdate();
        }}
      />
    </label>
  );
};
