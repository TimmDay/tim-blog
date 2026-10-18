# Every Widget has a Fallback

Posts can embed interactive Widgets, but every Widget must ship a static Fallback (image, table or text summary) that makes the same point without JavaScript. The full-text RSS feed shows only Fallbacks, and so do visitors without JS. Everyone else gets the Widget, server-rendered so it is already at its final size before its JS loads.

## Consequences

- A Post must make sense with all its Widgets replaced by their Fallbacks.
- Widgets hydrate with `client:visible`, never `client:only`, so loading them causes no layout shift.
- Every interactive Widget is wrapped in `WidgetFrame`, which picks the Widget or the Fallback.
- A Widget built only from HTML (such as `<details>`) is its own Fallback.
