/**
 * MolVis page plugin contracts — shipped **in this template**, not as a
 * separate npm package (yet).
 *
 * ## Types package decision
 *
 * **No separate `@molcrafts/molvis-plugin-api` package for now.**
 *
 * Reasons:
 * 1. The page plugin surface is still experimental; a published types-only
 *    package would lag or freeze the API prematurely.
 * 2. Domain types already come from `@molcrafts/molvis-core` +
 *    `@molcrafts/molrs` (`Modifier`, `Frame`, `Overlay`, …).
 * 3. This file is the contribution-surface contract; fork/copy it until the
 *    host API stabilizes, then extract a versioned types package from molvis.
 *
 * Keep aligned with molvis monorepo `page/src/plugins/types.ts` when you
 * bump host compatibility.
 */

import type { Modifier, Molvis, Overlay } from "@molcrafts/molvis-core";
import type { FC, ReactNode } from "react";

export type PluginCommandFn<A = unknown, R = unknown> = (
  app: Molvis,
  args: A,
) => R | Promise<R>;

/** Factory for a plugin interaction mode (host ModeManager). */
export type PluginModeFactory = (app: Molvis) => unknown;

/** Repo-root manifest (`molvis.plugin.json`). */
export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  molvis?: string;
  entry: string;
  description?: string;
}

/** Default export of the plugin ESM entry. */
export interface MolvisPluginModule {
  id: string;
  name?: string;
  version?: string;
  activate(api: PluginAPI): void | Promise<void>;
  deactivate?(api: PluginAPI): void | Promise<void>;
}

export interface PluginLogger {
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
}

export interface PluginStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type ModifierPanelComponent = FC<{
  modifier: Modifier;
  app: Molvis | null;
  onUpdate: () => void;
}>;

export interface SidebarPanelSpec {
  id: string;
  title: string;
  order?: number;
  icon?: ReactNode;
  render: FC<{ app: Molvis | null }>;
}

export interface ToolbarActionSpec {
  id: string;
  label: string;
  icon?: ReactNode;
  order?: number;
  onClick: (app: Molvis) => void;
  isVisible?: (app: Molvis) => boolean;
}

export interface SettingsSectionSpec {
  id: string;
  title: string;
  order?: number;
  render: FC<{ app: Molvis | null }>;
}

export interface ModePanelSpec {
  id: string;
  title?: string;
  order?: number;
  render: FC<{ app: Molvis | null }>;
}

export type PluginAnalysisParamKind =
  | "int"
  | "float"
  | "bool"
  | "select"
  | "text";

export interface PluginAnalysisParamSpec {
  name: string;
  label: string;
  kind: PluginAnalysisParamKind;
  default?: unknown;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
}

export interface PluginAnalysisContext {
  app: Molvis;
  params: Record<string, unknown>;
}

export interface PluginAnalysisResult {
  data: unknown;
}

export interface PluginAnalysisSpec {
  id: string;
  label: string;
  description?: string;
  params: PluginAnalysisParamSpec[];
  run: (
    ctx: PluginAnalysisContext,
  ) => Promise<PluginAnalysisResult> | PluginAnalysisResult;
  resultKind?: "table" | "scalar" | "custom";
  renderResult?: FC<{ result: PluginAnalysisResult }>;
}

export type PluginRpcHandler = (
  params: Record<string, unknown>,
  ctx: { app: Molvis },
) => unknown | Promise<unknown>;

/**
 * Host facade. Every `register*` is disposed when the plugin is disabled
 * or removed.
 */
export interface PluginAPI {
  readonly app: Molvis;
  readonly pluginId: string;
  readonly log: PluginLogger;
  readonly storage: PluginStorage;

  modifiers: {
    register(kind: string, category: string, factory: () => Modifier): void;
    registerPanel(kind: string, component: ModifierPanelComponent): void;
  };

  commands: {
    register<A = unknown, R = unknown>(
      name: string,
      fn: PluginCommandFn<A, R>,
    ): void;
  };

  modes: {
    register(id: string, factory: PluginModeFactory): void;
  };

  overlays: {
    add(overlay: Overlay): void;
  };

  analysis: {
    register(spec: PluginAnalysisSpec): void;
  };

  ui: {
    registerSidebarPanel(spec: SidebarPanelSpec): void;
    registerToolbarAction(spec: ToolbarActionSpec): void;
    registerSettingsSection(spec: SettingsSectionSpec): void;
    registerModePanel(mode: string, spec: ModePanelSpec): void;
  };

  rpc: {
    /** Host prefixes with `plugin.<pluginId>.` when needed. */
    registerMethod(name: string, handler: PluginRpcHandler): void;
  };
}
