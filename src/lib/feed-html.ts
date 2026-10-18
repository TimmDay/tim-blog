import sanitizeHtml from 'sanitize-html';

function absolute(url: string | undefined, base: string): string | undefined {
  return url ? new URL(url, base).href : url;
}

/** Makes rendered Post HTML safe for feed readers: no scripts or styles, absolute URLs. */
export function feedHtml(html: string, base: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'details',
      'summary',
    ]),
    allowedAttributes: {
      a: ['href'],
      img: ['src', 'alt', 'width', 'height'],
    },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, href: absolute(attribs.href, base) ?? '' },
      }),
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, src: absolute(attribs.src, base) ?? '' },
      }),
    },
  });
}
