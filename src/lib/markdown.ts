import { Marked } from "marked";

const marked = new Marked({
  gfm: true,
  breaks: false,
});

export type Heading = { id: string; level: number; text: string };

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

/**
 * Render markdown to HTML with anchored headings (so the TOC can deep-link).
 * Returns the html and the extracted heading list (h2/h3).
 */
export async function renderArticleMarkdown(
  source: string
): Promise<{ html: string; headings: Heading[] }> {
  const headings: Heading[] = [];
  const seen = new Set<string>();

  const renderer = {
    heading({
      tokens,
      depth,
    }: {
      tokens: { raw?: string; text?: string }[];
      depth: number;
    }): string {
      const text = tokens
        .map((t) => t.raw ?? t.text ?? "")
        .join("")
        .trim();
      let id = slugifyHeading(text) || `section-${headings.length + 1}`;
      let suffix = 1;
      while (seen.has(id)) {
        suffix += 1;
        id = `${id}-${suffix}`;
      }
      seen.add(id);
      if (depth === 2 || depth === 3) {
        headings.push({ id, level: depth, text });
      }
      return `<h${depth} id="${id}">${escapeHtml(text)}</h${depth}>\n`;
    },
  };

  marked.use({ renderer });
  const html = await marked.parse(source);
  return { html, headings };
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
