// Schema.org structured data generators

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Humble Halal",
  description: "Singapore's trusted guide to verified Halal businesses",
  url: "https://humblehalal.sg",
  logo: "https://humblehalal.sg/logo.png",
  sameAs: [
    "https://facebook.com/humblehalal",
    "https://instagram.com/humblehalal",
    "https://twitter.com/humblehalal",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    email: "hello@humblehalal.sg",
  },
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Humble Halal",
  url: "https://humblehalal.sg",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://humblehalal.sg/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
});

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const generateLocalBusinessSchema = (business: {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  priceRange?: string;
  latitude?: number;
  longitude?: number;
  isVerified?: boolean;
}) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.description,
    image: business.image,
    telephone: business.phone,
    url: business.website,
    priceRange: business.priceRange,
  };

  if (business.address) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressCountry: "SG",
    };
  }

  if (business.latitude && business.longitude) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: business.latitude,
      longitude: business.longitude,
    };
  }

  if (business.rating && business.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: business.rating,
      reviewCount: business.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (business.isVerified) {
    schema.certification = {
      "@type": "Certification",
      name: "MUIS Halal Certification",
      issuedBy: {
        "@type": "Organization",
        name: "Majlis Ugama Islam Singapura",
      },
    };
  }

  return schema;
};

export const generateCollectionPageSchema = (
  name: string,
  description: string,
  url: string,
  numberOfItems: number
) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name,
  description,
  url,
  mainEntity: {
    "@type": "ItemList",
    numberOfItems,
  },
});

export const generateArticleSchema = (article: {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.description,
  image: article.image,
  datePublished: article.datePublished,
  dateModified: article.dateModified || article.datePublished,
  author: {
    "@type": "Person",
    name: article.author || "Humble Halal",
  },
  publisher: {
    "@type": "Organization",
    name: "Humble Halal",
    logo: {
      "@type": "ImageObject",
      url: "https://humblehalal.sg/logo.png",
    },
  },
});