import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://horizons-garden.com';
const SITE_NAME = 'Horizons — Memory Garden';
const DEFAULT_TITLE = 'Horizons — Memory Garden';
const DEFAULT_DESCRIPTION =
  'Plant memories that bloom forever. Horizons is a private 3D memory garden where you plant digital flowers to preserve your most meaningful moments, send timed messages to loved ones, and keep memories that actually last.';
const DEFAULT_IMAGE = `${SITE_URL}/images/og-social-card.jpg`;
const DEFAULT_IMAGE_ALT = 'Horizons — A private 3D memory garden app';

interface SEOProps {
  /** Page title — will be suffixed with " — Horizons" unless it already contains "Horizons" */
  title?: string;
  /** Meta description — keep 150–160 chars for best SERP display */
  description?: string;
  /** Canonical path, e.g. "/blog/my-post" — SITE_URL is prepended automatically */
  canonical?: string;
  /** Absolute URL or path to a 1200×630 JPG/PNG social card image */
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  /**
   * "website" for most pages, "article" for blog posts.
   * Defaults to "website".
   */
  ogType?: 'website' | 'article';
  /** ISO date string — only relevant for ogType="article" */
  publishedAt?: string;
  /** ISO date string — only relevant for ogType="article" */
  modifiedAt?: string;
  /** Article section / category — only relevant for ogType="article" */
  articleSection?: string;
  /** Pass true for pages that should NOT be indexed (e.g. authenticated pages) */
  noIndex?: boolean;
}

/**
 * Per-page SEO component using react-helmet-async.
 *
 * Implements:
 * - Primary meta (title, description, canonical, robots)
 * - Open Graph (full set, including article metadata)
 * - Twitter Card (summary_large_image)
 * - Robots AI-readability directives (max-snippet, max-image-preview, max-video-preview)
 *
 * Place inside any page component to override the global index.html meta tags.
 */
export default function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogImageAlt,
  ogImageWidth = 1200,
  ogImageHeight = 630,
  ogType = 'website',
  publishedAt,
  modifiedAt,
  articleSection,
  noIndex = false,
}: SEOProps) {
  const fullTitle = title
    ? title.includes('Horizons')
      ? title
      : `${title} — Horizons`
    : DEFAULT_TITLE;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const image = ogImage
    ? ogImage.startsWith('http')
      ? ogImage
      : `${SITE_URL}${ogImage}`
    : DEFAULT_IMAGE;
  const imageAlt = ogImageAlt || DEFAULT_IMAGE_ALT;

  return (
    <Helmet>
      {/* ── Primary ───────────────────────────────────────────────── */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots — AI-readability directives (Google, Bing, Perplexity, etc.) */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
      )}

      {/* ── Open Graph ────────────────────────────────────────────── */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:width" content={String(ogImageWidth)} />
      <meta property="og:image:height" content={String(ogImageHeight)} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:image:type" content="image/jpeg" />

      {/* Article-specific OG tags */}
      {ogType === 'article' && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
      {ogType === 'article' && modifiedAt && (
        <meta property="article:modified_time" content={modifiedAt} />
      )}
      {ogType === 'article' && articleSection && (
        <meta property="article:section" content={articleSection} />
      )}
      {ogType === 'article' && (
        <meta property="article:author" content="https://horizons-garden.com" />
      )}

      {/* ── Twitter Card ──────────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@HorizonsGarden" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />
    </Helmet>
  );
}
