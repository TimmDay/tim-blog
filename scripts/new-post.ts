// Starts a draft Post:
//   pnpm new-post "My title"
//   pnpm new-post --from "path/to/Obsidian note.md" ["Optional title"]
import { existsSync } from 'node:fs';
import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  writeFile,
} from 'node:fs/promises';
import { basename, dirname, extname, join } from 'node:path';
import { parseArgs } from 'node:util';
import {
  convertObsidianNote,
  localDate,
  postTemplate,
  slugify,
} from '../src/lib/new-post.ts';

const usage =
  'Usage: pnpm new-post "My title"\n       pnpm new-post --from "path/to/note.md" ["My title"]';

const { values, positionals } = parseArgs({
  options: { from: { type: 'string' } },
  allowPositionals: true,
});
const from = values.from;

if (from && !existsSync(from)) {
  console.error(`Can't find ${from}.`);
  process.exit(1);
}

const title =
  positionals.join(' ').trim() || (from ? basename(from, extname(from)) : '');
if (!title) {
  console.error(usage);
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

const note = from ? convertObsidianNote(await readFile(from, 'utf8')) : null;

await mkdir(dir, { recursive: true });
const file = join(dir, 'index.md');
await writeFile(file, postTemplate(title, localDate(new Date()), note?.body));
console.log(`Created ${file}`);

if (from && note) {
  const vault = findVaultRoot(dirname(from));
  for (const image of note.images) {
    const source = await findFile(image, dirname(from), vault);
    if (source) {
      await copyFile(source, join(dir, image));
      console.log(`Copied ${image}. Add alt text for it.`);
    } else {
      console.warn(`Couldn't find ${image}. Copy it into ${dir}/.`);
    }
  }
  for (const embedded of note.notes) {
    console.warn(`"${embedded}" was an embedded note; it's now plain text.`);
  }
  console.log(`Your note in Obsidian is unchanged.`);
}

console.log(`Preview: SHOW_DRAFTS=true pnpm dev, then open http://localhost:4321/posts/${slug}/
It stays a draft until you set draft: false. To add Widgets, rename index.md to index.mdx (see widgets-demo/).`);

/** The nearest folder above the note that holds .obsidian, if any. */
function findVaultRoot(start: string): string | undefined {
  let current = start;
  while (true) {
    if (existsSync(join(current, '.obsidian'))) return current;
    const parent = dirname(current);
    if (parent === current) return undefined;
    current = parent;
  }
}

/** Looks beside the note first, then anywhere in the vault. */
async function findFile(
  name: string,
  noteDir: string,
  vault: string | undefined,
): Promise<string | undefined> {
  if (existsSync(join(noteDir, name))) return join(noteDir, name);
  if (!vault) return undefined;
  const entries = await readdir(vault, { recursive: true });
  const match = entries.find(
    (entry) => basename(entry) === name && !entry.startsWith('.obsidian'),
  );
  return match ? join(vault, match) : undefined;
}
