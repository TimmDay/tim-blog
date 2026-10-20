// Starts a draft Post: pnpm new-post "My title"
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { localDate, postTemplate, slugify } from '../src/lib/new-post.ts';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Usage: pnpm new-post "My title"');
  process.exit(1);
}

const slug = slugify(title);
if (!slug) {
  console.error(
    `Can't make a URL slug from "${title}". Use some letters or numbers.`,
  );
  process.exit(1);
}

const dir = join('src/content/posts', slug);
if (existsSync(dir)) {
  console.error(`${dir} already exists. Pick another title.`);
  process.exit(1);
}

await mkdir(dir, { recursive: true });
const file = join(dir, 'index.mdx');
await writeFile(file, postTemplate(title, localDate(new Date())));

console.log(`Created ${file}
Preview: SHOW_DRAFTS=true pnpm dev, then open http://localhost:4321/posts/${slug}/
It stays a draft until you set draft: false. See widgets-demo/ for images and Widgets.`);
