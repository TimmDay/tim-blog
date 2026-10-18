declare namespace App {
  // Extending Astro's Locals needs declaration merging, which only interfaces support.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Locals {
    /** Set when rendering a Post for the RSS feed: Widgets render their Fallback only. */
    rss?: boolean;
  }
}
