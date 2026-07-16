import { Marked } from "marked";

const marked = new Marked({
  gfm: true,
  breaks: false,
});

export type Heading = { id: string; level: number; text: string };

export type InlineImage = {
  url: string;
  alt: string;
  credit?: { photographer: string; photographer_url: string; source: string } | null;
};

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
 * Inline images, if provided, are dropped in as section breaks before H2
 * headings spaced evenly through the piece (never before the first one —
 * that spot belongs to the intro). Returns the html and heading list (h2/h3).
 */
export async function renderArticleMarkdown(
  source: string,
  inlineImages: InlineImage[] = []
): Promise<{ html: string; headings: Heading[] }> {
  const headings: Heading[] = [];
  const seen = new Set<string>();
  const h2Count = (source.match(/^##\s+/gm) ?? []).length;
  const insertBeforeH2 = computeInsertPositions(h2Count, inlineImages.length);
  let h2Seen = 0;
  let imageIndex = 0;

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

      let prefix = "";
      if (depth === 2) {
        h2Seen += 1;
        if (
          imageIndex < inlineImages.length &&
          insertBeforeH2.includes(h2Seen)
        ) {
          prefix = renderInlineImage(inlineImages[imageIndex]);
          imageIndex += 1;
        }
      }

      return `${prefix}<h${depth} id="${id}">${escapeHtml(text)}</h${depth}>\n`;
    },
  };

  marked.use({ renderer });
  const html = await marked.parse(source);
  return { html, headings };
}

// Spread N images evenly across the H2 sections, skipping the first section
// (the intro/hook) so an image never lands before the reader has any context.
function computeInsertPositions(h2Count: number, imageCount: number): number[] {
  if (h2Count <= 1 || imageCount === 0) return [];
  const usable = h2Count - 1;
  const positions: number[] = [];
  for (let i = 1; i <= imageCount; i += 1) {
    const pos = 1 + Math.round((usable * i) / (imageCount + 1));
    positions.push(Math.min(pos, h2Count));
  }
  return positions;
}

function renderInlineImage(image: InlineImage): string {
  const credit = image.credit
    ? `<figcaption>Photo: <a href="${escapeHtml(image.credit.photographer_url)}" rel="noopener nofollow" target="_blank">${escapeHtml(image.credit.photographer)}</a> / ${escapeHtml(image.credit.source)}</figcaption>`
    : "";
  return `<figure class="inline-photo"><img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt)}" loading="lazy" />${credit}</figure>\n`;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
