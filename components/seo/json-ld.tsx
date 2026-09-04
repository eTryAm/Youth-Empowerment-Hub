/**
 * Renders a JSON-LD structured data <script> tag for SEO.
 * Place this in any page JSX to inject schema.org markup.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
