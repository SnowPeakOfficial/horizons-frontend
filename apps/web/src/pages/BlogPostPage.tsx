import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from '../data/blogPosts';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

const CAT_BG: Record<string, string> = {
  'Gift Ideas': '#FDE8EC', Memory: '#EDE8FD',
  Relationships: '#E8F4FD', Guides: '#E8FDE9', Wellness: '#FDF6E8',
};
const CAT_FG: Record<string, string> = {
  'Gift Ideas': '#9B2D42', Memory: '#4A2D9B',
  Relationships: '#2D609B', Guides: '#2D8B3A', Wellness: '#8B6E2D',
};

const SITE = 'https://horizons-garden.com';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    publisher: {
      '@type': 'Organization',
      name: 'Horizons',
      logo: { '@type': 'ImageObject', url: `${SITE}/images/horizons-logo.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${post.slug}` },
  });

  return (
    <>
      <Helmet>
        <title>{post.title} — Horizons Blog</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={`${SITE}/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:url" content={`${SITE}/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{jsonLd}</script>
      </Helmet>

      <Navbar />
      <div style={{ minHeight: '100vh', background: '#FFFAF8' }}>
        {/* Back */}
        <div style={{ maxWidth: '740px', margin: '0 auto', padding: '32px 24px 0' }}>
          <button
            onClick={() => navigate('/blog')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C2475D', fontSize: '14px', fontWeight: 600, padding: 0 }}
          >
            &larr; All articles
          </button>
        </div>

        {/* Header */}
        <div style={{ maxWidth: '740px', margin: '0 auto', padding: '36px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <span style={{ background: CAT_BG[post.category] || '#FDE8EC', color: CAT_FG[post.category] || '#9B2D42', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', padding: '5px 12px', borderRadius: '20px' }}>
              {post.category}
            </span>
            <span style={{ fontSize: '14px', color: '#9D8F99' }}>{post.readTime} read</span>
            <span style={{ fontSize: '14px', color: '#9D8F99' }}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 600, color: '#2C2028', lineHeight: 1.25, marginBottom: '20px' }}>
            {post.title}
          </h1>
          <p style={{ fontSize: '19px', color: '#6B5B6E', lineHeight: 1.7, marginBottom: '40px', fontStyle: 'italic' }}>
            {post.description}
          </p>
          <div style={{ height: '1px', background: 'rgba(212,144,154,0.2)', marginBottom: '48px' }} />
        </div>

        {/* Body */}
        <div style={{ maxWidth: '740px', margin: '0 auto', padding: '0 24px 80px' }}>
          {post.content()}

          {/* CTA card */}
          <div style={{ marginTop: '64px', padding: '40px 32px', background: 'linear-gradient(135deg,#FFF0F3 0%,#FDE8EC 100%)', borderRadius: '20px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 600, color: '#2C2028', marginBottom: '12px' }}>
              Ready to plant your first memory?
            </h3>
            <p style={{ fontSize: '16px', color: '#6B5B6E', marginBottom: '24px', lineHeight: 1.6 }}>
              Horizons is free to start. Create your garden and plant your first flower today.
            </p>
            <a
              href="/auth/register"
              style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg,#C2475D 0%,#9B2D42 100%)', color: '#fff', borderRadius: '40px', textDecoration: 'none', fontWeight: 700, fontSize: '16px' }}
            >
              Get started free
            </a>
          </div>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <button
              onClick={() => navigate('/blog')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C2475D', fontSize: '14px', fontWeight: 600 }}
            >
              &larr; Back to all articles
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
