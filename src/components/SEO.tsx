import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "business.business";
  schema?: Record<string, unknown> | Record<string, unknown>[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  locale?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export const SEO = ({ 
  title, 
  description, 
  keywords = [],
  image = "https://humblehalal.sg/og-image.jpg",
  url,
  type = "website",
  schema,
  author,
  publishedTime,
  modifiedTime,
  locale = "en_SG",
  noindex = false,
  nofollow = false
}: SEOProps) => {
  const siteName = "Humble Halal - Singapore Business Directory";
  const siteUrl = "https://humblehalal.sg";
  const fullTitle = title.includes("Humble Halal") ? title : `${title} | ${siteName}`;
  const canonicalUrl = url || (typeof window !== "undefined" ? window.location.href : siteUrl);
  const fullImageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

  // Handle array of schemas
  const schemas = Array.isArray(schema) ? schema : schema ? [schema] : [];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      <meta name="author" content={author || siteName} />
      <meta name="robots" content={`${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}`} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="geo.region" content="SG" />
      <meta name="geo.placename" content="Singapore" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@humblehalal" />
      <meta name="twitter:creator" content="@humblehalal" />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#0F766E" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Humble Halal" />
      <meta name="application-name" content="Humble Halal" />
      <meta name="msapplication-TileColor" content="#0F766E" />
      <meta name="msapplication-config" content="/browserconfig.xml" />

      {/* Schema.org JSON-LD */}
      {schemas.map((schemaItem, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schemaItem)}
        </script>
      ))}
    </Helmet>
  );
};