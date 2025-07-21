import { describe, it, expect, vi } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

vi.mock('../src/pages/blog/[slug].astro', async () => {
  const filePath = fileURLToPath(new URL('../src/pages/blog/[slug].astro', import.meta.url));
  const contentDir = fileURLToPath(new URL('../src/content/blog', import.meta.url));
  const text = readFileSync(filePath, 'utf8');
  const match = text.match(/export async function getStaticPaths\(\)[\s\S]*?}\n/);
  if (!match) throw new Error('getStaticPaths not found');
  const files = readdirSync(contentDir).filter(f => f.endsWith('.md'));
  const entries = files.map(f => `['../../content/blog/${f}',{}]`).join(',');
  const fnCode = match[0].replace("import.meta.glob('../../content/blog/*.md', { eager: true })", `Object.fromEntries([${entries}])`);
  const url = 'data:text/javascript;base64,' + Buffer.from(fnCode).toString('base64');
  return await import(url);
});

import { getStaticPaths } from '../src/pages/blog/[slug].astro';

describe('blog getStaticPaths', () => {
  it('returns paths for existing posts', async () => {
    const result = await getStaticPaths();
    expect(result).toEqual([{ params: { slug: 'first-post' } }]);
  });
});
