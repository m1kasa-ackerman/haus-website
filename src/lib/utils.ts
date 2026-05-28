import { prisma } from '@/lib/db';
import type { SiteContentT } from '@/lib/types';

// Fetch all SiteContent rows as a plain key→value map for easy lookup.
export async function getSiteContentMap(): Promise<Record<string, string>> {
  const rows = await prisma.siteContent.findMany();
  return Object.fromEntries(rows.map((r: SiteContentT) => [r.key, r.value]));
}

// Read one value with a fallback.
export function content(map: Record<string, string>, key: string, fallback = ''): string {
  return map[key] ?? fallback;
}

// We allow a small whitelist of inline tags in editable rich-text fields
// (<em>, <br>, <strong>). Strip everything else to avoid stored XSS.
const ALLOWED = /<(\/?(?:em|br|strong|b|i))\s*\/?>/gi;
export function sanitizeInline(html: string): string {
  if (!html) return '';
  // Replace allowed tags with placeholders, escape the rest, then restore.
  const stash: string[] = [];
  const withStash = html.replace(ALLOWED, (m) => {
    stash.push(m);
    return `\u0000${stash.length - 1}\u0000`;
  });
  const escaped = withStash
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(/\u0000(\d+)\u0000/g, (_, i) => stash[Number(i)]);
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
