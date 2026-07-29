/**
 * Minimal BaseModifier-compatible base for plugins.
 *
 * Prefer importing `BaseModifier` from `@molcrafts/molvis-core` once your
 * peer version exports it from the package root. This shim keeps the
 * template typechecking against published `0.1.1`.
 *
 * Host-side `Modifier` typing is structural; we intentionally use a loose
 * `context` type so nested `@molcrafts/molrs` versions do not fight.
 */

import type { Frame } from "@molcrafts/molrs";
import type { ModifierCapability } from "@molcrafts/molvis-core";

export abstract class BaseModifier {
  enabled = true;
  selectionScopeId: string | null = null;
  sourceOwnerId: string | null = null;
  protected _name: string;

  constructor(
    public readonly id: string,
    name: string,
    public readonly capabilities: ReadonlySet<ModifierCapability>,
  ) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  matches(_frame: Frame): boolean {
    return false;
  }

  isApplicable(_frame: Frame): boolean {
    return true;
  }

  validate(_input: Frame, _context: unknown): { valid: boolean } {
    return { valid: true };
  }

  applyVisibility(_app: unknown, _visible: boolean): void {}

  abstract apply(input: Frame, context: unknown): Frame | Promise<Frame>;

  getCacheKey(): string {
    return `${this.id}:${this.enabled}`;
  }
}
