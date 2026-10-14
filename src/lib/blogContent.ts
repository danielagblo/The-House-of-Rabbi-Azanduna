const ALLOWED_TAGS = new Set(['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'blockquote']);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, '&#39;');
}

export function looksLikeHtml(content: string): boolean {
  return /<\/?[a-z][^>]*>/i.test(content);
}

export function plainTextToBlogHtml(content: string): string {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

export function sanitizeBlogHtml(input: string): string {
  const withoutDanger = input
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');

  return withoutDanger.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (full, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return '';
    if (full.startsWith('</')) return `</${tag}>`;
    if (tag === 'br') return '<br>';
    if (tag === 'a') {
      const match = /href\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(rawAttrs);
      const url = (match?.[1] || match?.[2] || '').trim();
      const safe = /^(https?:\/\/|mailto:|\/)/i.test(url) && !/^javascript:/i.test(url);
      if (!safe) return '<a>';
      return `<a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">`;
    }
    return `<${tag}>`;
  });
}

export function renderBlogHtml(content: string): string {
  const source = content?.trim() ? content : '';
  if (!source) return '';
  const html = looksLikeHtml(source) ? source : plainTextToBlogHtml(source);
  return sanitizeBlogHtml(html);
}
