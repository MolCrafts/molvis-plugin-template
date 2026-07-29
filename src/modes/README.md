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

A full custom mode needs a core `BaseMode`-compatible class (pointer
lifecycle). This template ships analysis / modifier / command demos instead;
add a mode when you need exclusive interaction.
