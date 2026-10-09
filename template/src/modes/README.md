# modes/

Register interaction modes with `api.modes.register(id, factory, { panel? })`.

The optional `panel` is the **tools pane for that mode** (right inspector), not
a free-floating UI contribution.

```ts
api.modes.register("highlight", (app) => new HighlightMode(app), {
  panel: {
    id: "highlight-tools",
    title: "Highlight",
    render: ({ app }) => <HighlightTools app={app} />,
  },
});

// Or attach tools under a built-in mode:
api.modes.registerToolsPanel("view", {
  id: "my-view-tools",
  title: "Extra view tools",
  render: ({ app }) => <… />,
});
```

A full custom mode needs a `PluginMode` (`name`, `start`, `finish`). This
template ships analysis / modifier / command demos instead; add a mode when
you need exclusive pointer handling.

To hand a built molecule to Edit's stamp tool, call `stageEditMolecule`
from `@molcrafts/molvis-plugin` on a host that exports it. It frees the
frame and throws if Edit is not the active mode. The published 0.3.0 SDK
does not export that function yet.
