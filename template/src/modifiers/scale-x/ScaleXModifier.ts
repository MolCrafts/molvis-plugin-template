/**
 * Example pipeline modifier — scales atom X via the host molrs gateway.
 */

import {
  type Frame,
  Frame as MolrsFrame,
} from "@molcrafts/molvis-core/molrs";
import { BaseModifier, ModifierCapability } from "@molcrafts/molvis-stage";

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

    const result = new MolrsFrame();
    result.insertBlock("atoms", atoms);
    const resultAtoms = result.getBlock("atoms");
    if (!resultAtoms) return input;
    resultAtoms.setColF("x", x);

    const bonds = input.getBlock("bonds");
    if (bonds) result.insertBlock("bonds", bonds);

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
