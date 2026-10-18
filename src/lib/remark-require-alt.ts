import type { Image, Root } from 'mdast';
import { visit } from 'unist-util-visit';

type VFileLike = { path?: string };

/** Fails the build when a Markdown image has no alt text. */
export function remarkRequireAlt() {
  return (tree: Root, file: VFileLike) => {
    visit(tree, 'image', (node: Image) => {
      if (!node.alt?.trim()) {
        const where = node.position ? `:${node.position.start.line}` : '';
        throw new Error(
          `Image "${node.url}" in ${file.path ?? 'a Post'}${where} has no alt text. ` +
            'Describe what it shows, or use alt="" only via a component for purely decorative images.',
        );
      }
    });
  };
}
