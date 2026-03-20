import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.horizons-garden.com';
const DEFAULT_TITLE = 'Horizons - Memory Garden';
const DEFAULT_DESCRIPTION =
  'Plant Memories That Bloom Forever. Horizons is a 3D memory garden where you plant digital flowers to preserve your most meaningful moments. Send blooming memories to loved ones — free to start.';
const DEFAULT_IMAGE = `${SITE_URL}/images/horizons-logo.svg`;

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  /** Pass true for pages that should NOT be indexed (e.g. authenticated pages) */
  noIndex?: boolean;
}

/**
 * Per-page SEO component using react-helmet-async.
 * Place inside any page component to override the global index.html meta tags.
 */
export default function SEO({
  title,
  description,
  canonical,
  ogImage,
  noIndex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} — Horizons` : DEFAULT_TITLE;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const image = ogImage || DEFAULT_IMAGE;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Horizons - Memory Garden" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
