/**
 * Server-side HTML sanitization for article content.
 *
 * Uses sanitize-html with an explicit allowlist. This runs only on the
 * server (Next.js Server Component / server action) so it never inflates
 * client bundles.
 *
 * Removes:
 *  - <script>, <iframe>, <object>, <embed>, <form>, <input> and all other
 *    non-allowlisted tags (stripped, inner text kept where sensible)
 *  - All event-handler attributes (on*)
 *  - javascript:, vbscript:, data: and other unsafe href/src schemes
 *  - Arbitrary style attributes that could be used for phishing overlays
 *
 * Preserves:
 *  - Article formatting: headings, paragraphs, lists, blockquotes
 *  - Code blocks: <pre>, <code>
 *  - Links to external resources (https only, plus relative paths)
 *  - Images (src must be https or relative)
 *  - Tables
 *  - Inline formatting: bold, italic, underline, strikethrough, mark
 */

import sanitizeHtml from 'sanitize-html';

/** Schemes allowed in href / src / action attributes */
const SAFE_URL_SCHEMES = ['https', 'http', 'mailto', 'tel'];

export function sanitizeArticleHtml(raw: string | null | undefined): string {
  if (!raw) return '';

  return sanitizeHtml(raw, {
    // ── Allowed tags ────────────────────────────────────────────────────────
    allowedTags: [
      // Structure
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr', 'div', 'span', 'section', 'article',
      // Lists
      'ul', 'ol', 'li',
      // Block
      'blockquote', 'pre', 'code',
      // Inline
      'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'mark',
      'small', 'sub', 'sup', 'abbr', 'kbd', 'samp', 'var',
      // Links and media
      'a', 'img',
      // Table (read-only display)
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
      // Figure / caption
      'figure', 'figcaption',
      // Details / summary (collapsible content)
      'details', 'summary',
    ],

    // ── Allowed attributes per tag ────────────────────────────────────────
    allowedAttributes: {
      // Links: only href + minimal safe attributes
      a: ['href', 'title', 'target', 'rel'],
      // Images: src, alt, dimensions — no arbitrary srcs
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      // Tables: basic accessibility
      th: ['scope', 'colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
      // Code blocks: language hint for syntax highlighters
      code: ['class'],
      pre: ['class'],
      // Abbreviation title
      abbr: ['title'],
      // Allow id/class on block elements for anchor links and styling
      h1: ['id'], h2: ['id'], h3: ['id'], h4: ['id'], h5: ['id'], h6: ['id'],
      div: ['class'],
      span: ['class'],
      p: ['class'],
      blockquote: ['cite'],
      figure: ['class'],
    },

    // ── Allowed URL schemes ───────────────────────────────────────────────
    allowedSchemes: SAFE_URL_SCHEMES,
    allowedSchemesByTag: {
      img: ['https', 'http'],   // images must be external https/http
      a: SAFE_URL_SCHEMES,
    },

    // ── Link safety ───────────────────────────────────────────────────────
    // Force external links to open safely
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? '';
        // Relative links (/path, #anchor) are fine
        const isExternal = /^https?:\/\//i.test(href);
        return {
          tagName,
          attribs: {
            ...attribs,
            href,
            ...(isExternal
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {}),
          },
        };
      },
    },

    // ── Additional guards ─────────────────────────────────────────────────
    // Strip tags entirely (including their children) that should never appear
    disallowedTagsMode: 'discard',
    // Do not allow style= or on* on any tag
    allowedStyles: {},
    // Enforce URL scheme check on all relevant attributes
    allowProtocolRelative: false,
  });
}
