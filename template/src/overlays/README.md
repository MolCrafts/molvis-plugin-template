# overlays/

Scene decorations (arrows, labels, cages) via `api.overlays.add(overlay)`.

Overlays own their Babylon meshes / dispose lifecycle — there is no separate
UI API. If the user needs controls, expose them through a **mode tools panel**
or **command** that configures the overlay.
