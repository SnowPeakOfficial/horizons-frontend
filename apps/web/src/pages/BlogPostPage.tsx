import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogPosts, DEFAULT_AUTHOR } from '../data/blogPosts';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import SEO from '../components/common/SEO';

const CAT_BG: Record<string, string> = {
  'Gift Ideas':  'rgba(212, 144, 154, 0.12)',
  Memory:        'rgba(197, 169, 208, 0.15)',
  Relationships: 'rgba(155, 181, 212, 0.15)',
  Guides:        'rgba(107, 155, 122, 0.12)',
  Wellness:      'rgba(212, 175, 106, 0.12)',
};
const CAT_FG: Record<string, string> = {
  'Gift Ideas':  '#B87580',
  Memory:        '#9E7DAE',
  Relationships: '#5A8AAE',
  Guides:        '#4A7A58',
  Wellness:      '#9B7B30',
};

const SITE = 'https://horizons-garden.com';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;
  if (import.meta.env.MODE !== 'development' && new Date(post.publishedAt + 'T12:00:00') > new Date()) return <Navigate to="/blog" replace />;

  // Resolve the header image to a full URL for structured data
  const absoluteImage = post.headerImage
    ? post.headerImage.startsWith('http')
      ? post.headerImage
      : `${SITE}${post.headerImage}`
    : `${SITE}/images/og-social-card.jpg`;

  // Article JSON-LD — enriched with image, author, section, breadcrumb
  const articleJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: {
      '@type': 'ImageObject',
      url: absoluteImage,
      width: 1200,
      height: 630,
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    articleSection: post.category,
    inLanguage: 'en',
    author: {
      '@type': 'Organization',
      name: DEFAULT_AUTHOR,
      url: SITE,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Horizons',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE}/images/horizons-logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE}/blog/${post.slug}`,
    },
  });

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${SITE}/blog/${post.slug}`,
      },
    ],
  });

  return (
    <>
      {/* Per-page SEO — og:type=article, full image metadata, article dates */}
      <SEO
        title={post.title}
        description={post.description}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        ogImage={absoluteImage}
        ogImageAlt={post.title}
        publishedAt={post.publishedAt}
        modifiedAt={post.publishedAt}
        articleSection={post.category}
      />

      {/* Structured data — Article + BreadcrumbList */}
      <Helmet>
        <script type="application/ld+json">{articleJsonLd}</script>
        <script type="application/ld+json">{breadcrumbJsonLd}</script>
      </Helmet>

      <Navbar />

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF5F7 0%, #FAF7F5 50%, #F3EEF7 100%)' }}>

        {/* ── Header image — constrained to content width ── */}
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: 'clamp(24px, 4vw, 36px) 24px 0' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <img
              src={post.headerImage}
              alt={post.title}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>

        {/* ── Back link ── */}
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '20px 24px 0' }}>
          <button
            onClick={() => navigate('/blog')}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              color: '#C47A85', fontSize: '16px', fontWeight: 600,
              letterSpacing: '0.01em',
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#9A5A64';
              (e.currentTarget as HTMLElement).style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#C47A85';
              (e.currentTarget as HTMLElement).style.textDecoration = 'none';
            }}
          >
            ← All articles
          </button>
        </div>

        {/* ── Article header ── */}
        <div
          className="blog-post-header"
          style={{ maxWidth: '760px', margin: '0 auto', padding: 'clamp(24px, 4vw, 40px) 24px 0' }}
        >
          {/* Meta row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '24px', flexWrap: 'wrap',
          }}>
            <span style={{
              background: CAT_BG[post.category] || 'rgba(212,144,154,0.12)',
              color: CAT_FG[post.category] || '#B87580',
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
              padding: '5px 14px', borderRadius: '999px',
            }}>
              {post.category}
            </span>
            <span style={{ fontSize: '13px', color: '#9D8F99' }}>{post.readTime} read</span>
            <span style={{ fontSize: '13px', color: '#9D8F99' }}>
              {new Date(post.publishedAt + 'T12:00:00').toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric',
              })}
            </span>
            <span style={{ fontSize: '13px', color: '#9D8F99' }}>
              By <span style={{ fontWeight: 600, color: '#7A6B78' }}>{post.author ?? DEFAULT_AUTHOR}</span>
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(24px, 4vw, 40px)',
            fontWeight: 600,
            color: '#3D3340',
            lineHeight: 1.25,
            marginBottom: '20px',
          }}>
            {post.title}
          </h1>

          {/* Deck / description */}
          <p style={{
            fontSize: 'clamp(16px, 2vw, 19px)',
            color: '#6B5F68',
            lineHeight: 1.7,
            marginBottom: '40px',
            fontStyle: 'italic',
          }}>
            {post.description}
          </p>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(232, 180, 184, 0.25)', marginBottom: 'clamp(32px, 5vw, 52px)' }} />
        </div>

        {/* ── Article body ── */}
        <div
          className="blog-post-content"
          style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px clamp(40px, 6vw, 64px)' }}
        >
          {post.content()}
        </div>

        {/* ── End-of-article CTA ── */}
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px clamp(64px, 10vw, 96px)', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/auth/register')}
            style={{
              background: 'linear-gradient(135deg, #E8B4B8 0%, #D4909A 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '999px',
              padding: '16px 40px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 8px 28px rgba(212, 144, 154, 0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 36px rgba(212, 144, 154, 0.45)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(212, 144, 154, 0.35)';
            }}
          >
            {post.ctaText} →
          </button>
        </div>

      </div>

      <Footer />
    </>
  );
};
