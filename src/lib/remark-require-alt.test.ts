import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { describe, expect, it } from 'vitest';
import { remarkRequireAlt } from './remark-require-alt';

function run(markdown: string) {
  const processor = unified().use(remarkParse).use(remarkRequireAlt);
  return processor.run(processor.parse(markdown));
}

describe('remarkRequireAlt', () => {
  it('passes an image with alt text', async () => {
    await expect(
      run('![A chart of benchmark scores](./chart.png)'),
    ).resolves.toBeDefined();
  });

  it('rejects an image with no alt text', async () => {
    await expect(run('![](./chart.png)')).rejects.toThrow(
      /chart\.png.*no alt text/,
    );
  });

  it('rejects whitespace-only alt text', async () => {
    await expect(run('![   ](./chart.png)')).rejects.toThrow(/no alt text/);
  });
});
