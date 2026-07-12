import type { SchemaGraphDocument } from "@/lib/seo/schemaGraph";

export const SchemaGraphJsonLd = ({
  document,
}: {
  document: SchemaGraphDocument | Record<string, unknown>;
}) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(document) }}
  />
);
