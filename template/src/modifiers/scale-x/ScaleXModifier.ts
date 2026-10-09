/**
 * Example pipeline modifier — scales atom X.
 *
 * `SCALE_X_KIND` is the local registry id. The host stores it as
 * `plugin.<pluginId>.scale-x`, which is what project files and
 * `pipeline.add_modifier` use. `toProjectParams` / `fromProjectParams`
 * keep `factor` across save and reload.
 *
 * `BaseModifier` and `nextModifierId` come from `@molcrafts/molvis-stage`,
 * which the published SDK re-exports the host engines as. A menu `label`
 * separate from the registry id is a host option; pass it in `register`
 * once the installed `@molcrafts/molvis-plugin` accepts it.
 */

import type { Frame } from "@molcrafts/molvis-core/molrs";
import { Frame as MolrsFrame } from "@molcrafts/molvis-core/molrs";
import {
  BaseModifier,
  ModifierCapability,
  nextModifierId,
} from "@molcrafts/molvis-stage";

export const SCALE_X_KIND = "scale-x";
export const SCALE_X_LABEL = "Scale X";

function readNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export class ScaleXModifier extends BaseModifier {
  factor = 1;

  constructor() {
    super(
      nextModifierId(SCALE_X_KIND),
      SCALE_X_LABEL,
      new Set([ModifierCapability.TransformsData]),
    );
  }

  toProjectParams(): Record<string, unknown> {
    return { factor: this.factor };
  }

  fromProjectParams(params: Record<string, unknown>): void {
    this.factor = readNumber(params.factor, 1);
  }

  apply(input: Frame, _context: unknown): Frame {
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
