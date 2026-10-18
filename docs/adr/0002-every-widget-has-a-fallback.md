# Every Widget has a Fallback

Posts can embed interactive Widgets, but every Widget must ship a static Fallback (image, table or text summary) that makes the same point without JavaScript. The Fallback is what screen readers, RSS readers, no-JS visitors and crawlers get, and it is server-rendered in the Widget's place until the interactive version loads.

## Consequences

- A Post must make sense with all its Widgets replaced by their Fallbacks.
- The full-text RSS feed renders Fallbacks only.
- The Fallback and the interactive Widget must occupy the same space, so the swap causes no layout shift.
