import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/common/SEO';
import { blogPosts } from '../data/blogPosts';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common';
import { typography } from '../styles/typography';

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

const blogJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'The Horizons Blog',
  description:
    'Stories, guides, and ideas about memory, meaningful connection, and the art of giving something that lasts.',
  url: `${SITE}/blog`,
  publisher: {
    '@type': 'Organization',
    name: 'Horizons',
    logo: { '@type': 'ImageObject', url: `${SITE}/images/horizons-logo.svg` },
  },
  inLanguage: 'en',
});

export const BlogPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="The Horizons Blog"
        description="Stories, guides, and ideas about memory, meaningful connection, and the art of giving something that lasts."
        canonical="/blog"
      />
      <Helmet>
        <script type="application/ld+json">{blogJsonLd}</script>
      </Helmet>
      <Navbar />

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF5F7 0%, #FAF7F5 50%, #F3EEF7 100%)' }}>

        {/* ── Hero ── */}
        <div
          className="blog-hero"
          style={{
            padding: 'clamp(56px, 8vw, 88px) 24px clamp(40px, 6vw, 64px)',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Soft decorative orbs */}
          <div style={{
            position: 'absolute', top: '20%', left: '8%',
            width: '240px', height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,180,184,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', right: '6%',
            width: '180px', height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(197,169,208,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <p style={{
            display: 'inline-block',
            fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em',
            color: '#B87580', textTransform: 'uppercase',
            background: 'rgba(212,144,154,0.12)',
            padding: '6px 18px', borderRadius: '999px',
            marginBottom: '24px',
          }}>
            The Horizons Blog
          </p>
          <h1 style={{
            fontFamily: typography.fontFamily.serif,
            fontSize: 'clamp(48px, 6vw, 80px)',
            fontWeight: 600,
            color: '#3D3340',
            lineHeight: 1.15,
            marginBottom: '20px',
          }}>
            Stories about memory,<br />connection, and time
          </h1>
          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: '#6B5F68',
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Guides, ideas, and reflections on what it means to preserve the moments that matter.
          </p>
        </div>

        {/* ── Card Grid ── */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px clamp(60px, 8vw, 96px)' }}>
          <div
            className="blog-card-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {blogPosts.filter((post) => import.meta.env.MODE === 'development' || new Date(post.publishedAt) <= new Date()).map((post) => (
              <article
                key={post.slug}
                onClick={() => navigate(`/blog/${post.slug}`)}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '0',
                  border: '1.5px solid rgba(232, 180, 184, 0.35)',
                  boxShadow: '0 4px 20px rgba(212, 144, 154, 0.08)',
                  cursor: 'pointer',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 36px rgba(212,144,154,0.16)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(212,144,154,0.08)';
                }}
              >
                {/* Header image */}
                {post.headerImage && (
                  <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', flexShrink: 0 }}>
                    <img
                      src={post.headerImage}
                      alt={post.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.35s ease',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                    />
                  </div>
                )}

                {/* Card body */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '24px 28px 28px', flexGrow: 1 }}>

                {/* Category + read time */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{
                    background: CAT_BG[post.category] || 'rgba(212,144,154,0.12)',
                    color: CAT_FG[post.category] || '#B87580',
                    fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
                    padding: '4px 12px', borderRadius: '999px',
                  }}>
                    {post.category}
                  </span>
                  <span style={{ fontSize: '12px', color: '#9D8F99' }}>{post.readTime} read</span>
                </div>

                {/* Title */}
                <h2 style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 'clamp(17px, 2vw, 20px)',
                  fontWeight: 600,
                  color: '#3D3340',
                  lineHeight: 1.35,
                  margin: 0,
                }}>
                  {post.title}
                </h2>

                {/* Description */}
                <p style={{
                  fontSize: '14px', color: '#6B5F68', lineHeight: 1.65,
                  margin: 0, flexGrow: 1,
                }}>
                  {post.description}
                </p>

                {/* Footer row */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', marginTop: '4px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(232, 180, 184, 0.15)',
                }}>
                  <span style={{ fontSize: '12px', color: '#9D8F99' }}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric',
                    })}
                  </span>
                  <span style={{
                    fontSize: '13px', fontWeight: 600, color: '#D4909A',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    Read <span style={{ fontSize: '16px' }}>→</span>
                  </span>
                </div>
                </div>{/* end card body */}
              </article>
            ))}
          </div>
        </div>

        {/* ── Final CTA — exact LandingPage final CTA, no flower ── */}
        <section style={{
          padding: '120px 40px 120px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9F7 50%, #FDFCFA 100%)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontFamily: typography.fontFamily.serif,
              fontWeight: 400,
              marginBottom: '48px',
              color: '#3D3340',
              lineHeight: 1.2,
            }}>
              When you're ready,
              <br />
              your garden is waiting
            </h2>
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate('/auth/register')}
              style={{
                fontSize: '18px',
                padding: '20px 56px',
                boxShadow: '0 12px 40px rgba(212, 144, 154, 0.35)',
              }}
            >
              Enter your garden
            </Button>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};
