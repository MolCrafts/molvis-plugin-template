/**
 * Optional OOP base for MolVis page plugins.
 *
 * Domain registration stays in small `register(api)` functions (one domain
 * concern each). The class only owns identity + activate/deactivate wiring
 * so entry points do not become free-form bags of side effects.
 *
 * Prefer composition of domain modules over deep inheritance.
 */

import type { MolvisPluginModule, PluginAPI } from "../types/plugin-api";

export abstract class MolvisPlugin implements MolvisPluginModule {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly version: string;

  abstract activate(api: PluginAPI): void;

  deactivate(_api: PluginAPI): void {
    /* default: no-op */
  }
}
