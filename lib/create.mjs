/**
 * Scaffold for `molvis-plugin create`.
 * Interactive UX: @clack/prompts only (create-rsbuild / create-rstack style).
 * The substitution rules live in `./scaffold.mjs`.
 */
import { existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as p from "@clack/prompts";
import { dependencyVars, slugify, titleCase, toPluginId, writeProject } from "./scaffold.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATE = join(root, "template");

/**
 * @param {{
 *   dir?: string | null;
 *   id?: string | null;
 *   name?: string | null;
 *   version?: string;
 *   yes?: boolean;
 * }} opts
 */
export async function createPlugin(opts = {}) {
  if (!existsSync(TEMPLATE)) {
    p.log.error(`Template missing at ${TEMPLATE}`);
    process.exit(1);
  }

  p.intro("molvis-plugin · create");

  let dir = opts.dir?.trim() || null;
  let pluginId = opts.id?.trim() || null;
  let pluginName = opts.name?.trim() || null;
  const version = opts.version?.trim() || "0.1.0";
  const yes = Boolean(opts.yes);

  if (yes && !dir) {
    p.log.error("Non-interactive mode requires a directory name.");
    p.outro("Aborted");
    process.exit(1);
  }

  if (!yes) {
    if (!dir) {
      const ans = await p.text({
        message: "Project directory",
        placeholder: "my-molvis-plugin",
        defaultValue: "my-molvis-plugin",
        validate(value) {
          if (!value?.trim()) return "Directory is required";
        },
      });
      if (p.isCancel(ans)) {
        p.cancel("Cancelled.");
        process.exit(0);
      }
      dir = String(ans).trim();
    }

    const slugPreview = slugify(dir.split(/[/\\]/).pop() || "my-plugin");

    if (!pluginId) {
      const ans = await p.text({
        message: "Plugin id",
        placeholder: toPluginId(slugPreview),
        defaultValue: toPluginId(slugPreview),
        validate(value) {
          if (!value?.trim()) return "Id is required";
          if (!/^[a-z][a-z0-9_.-]*(\.[a-z0-9_.-]+)+$/i.test(value.trim())) {
            return "Use reverse-DNS form, e.g. com.acme.demo";
          }
        },
      });
      if (p.isCancel(ans)) {
        p.cancel("Cancelled.");
        process.exit(0);
      }
      pluginId = String(ans).trim();
    }

    if (!pluginName) {
      const ans = await p.text({
        message: "Display name",
        placeholder: titleCase(slugPreview),
        defaultValue: titleCase(slugPreview),
        validate(value) {
          if (!value?.trim()) return "Name is required";
        },
      });
      if (p.isCancel(ans)) {
        p.cancel("Cancelled.");
        process.exit(0);
      }
      pluginName = String(ans).trim();
    }
  } else {
    const slug = slugify(dir.split(/[/\\]/).pop() || "my-plugin");
    pluginId = pluginId || toPluginId(slug);
    pluginName = pluginName || titleCase(slug);
  }

  const target = resolve(process.cwd(), dir);
  if (existsSync(target) && readdirSync(target).length > 0) {
    p.log.error(`Target is not empty: ${target}`);
    p.outro("Aborted");
    process.exit(1);
  }

  const slug = slugify(dir.split(/[/\\]/).pop() || "my-plugin");
  const siblingRoot = resolve(target, "..", "molvis");
  const hasSibling =
    existsSync(join(siblingRoot, "package.json")) &&
    existsSync(join(siblingRoot, "plugin", "package.json"));

  const vars = {
    pluginId,
    pluginName,
    packageName: slug,
    version,
    year: String(new Date().getFullYear()),
    ...dependencyVars(hasSibling),
  };

  const s = p.spinner();
  s.start("Writing project files");

  try {
    writeProject(TEMPLATE, target, vars);
    s.stop("Project files written");
  } catch (err) {
    s.stop("Failed");
    p.log.error(err instanceof Error ? err.message : String(err));
    p.outro("Aborted");
    process.exit(1);
  }

  if (hasSibling) {
    p.log.info(`Linked sibling monorepo ${siblingRoot}`);
  }

  p.note(
    [
      `id      ${pluginId}`,
      `name    ${pluginName}`,
      `version ${version}`,
      `path    ${target}`,
    ].join("\n"),
    "Plugin",
  );

  p.note(
    [
      `cd ${dir}`,
      `npm install`,
      `npm run build`,
      ``,
      `# local debug`,
      `npx serve -l 4173 --cors .`,
      `# MolVis Settings → Plugins`,
      `owner/repo  or  owner/repo@v${version}`,
    ].join("\n"),
    "Next steps",
  );

  p.note(
    [
      `import { MolvisPlugin, type PluginAPI } from "@molcrafts/molvis/plugin";`,
      `import { Button } from "@molcrafts/molvis/plugin/ui";`,
    ].join("\n"),
    "SDK (never import page/)",
  );

  p.outro("Done — happy hacking");
}
