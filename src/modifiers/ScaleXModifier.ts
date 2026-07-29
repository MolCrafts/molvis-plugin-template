/**
 * Example data modifier that scales atom X coordinates.
 *
 * Uses `@molcrafts/molrs` `Frame` (shared with the host — never bundle molrs).
 * Frame transforms follow the core convention: new Frame + insertBlock + write.
 */

import { type Frame, Frame as MolrsFrame } from "@molcrafts/molrs";
import { ModifierCapability } from "@molcrafts/molvis-core";
import { BaseModifier } from "../shims/BaseModifier";

/** Registry / panel kind — keep in sync with `register` + `registerPanel`. */
export const SCALE_X_KIND = "Scale X";

export class ScaleXModifier extends BaseModifier {
  factor = 1.0;

  constructor() {
    super(
      `scale-x-${Math.random().toString(36).slice(2, 9)}`,
      SCALE_X_KIND,
      new Set([ModifierCapability.TransformsData]),
    );
  }

  apply(input: Frame, _ctx: unknown): Frame {
    if (this.factor === 1) return input;

    const atoms = input.getBlock("atoms");
    if (!atoms || atoms.nrows() === 0) return input;

    const x = atoms.copyColF("x");
    for (let i = 0; i < x.length; i++) {
      x[i] *= this.factor;
    }

    // Immutable transform: copy blocks onto a new Frame, then mutate columns.
    const result = new MolrsFrame();
    result.insertBlock("atoms", atoms);
    const resultAtoms = result.getBlock("atoms");
    if (!resultAtoms) return input;
    resultAtoms.setColF("x", x);

    const bonds = input.getBlock("bonds");
    if (bonds) result.insertBlock("bonds", bonds);

    // Preserve simulation cell when present (optional on Frame).
    const box = (input as Frame & { box?: unknown }).box;
    if (box !== undefined) {
      (result as Frame & { box?: unknown }).box = box;
    }

    return result;
  }

  getCacheKey(): string {
    return `${super.getCacheKey()}:f=${this.factor}`;
  }
}
