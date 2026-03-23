import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
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

export const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <SEO
        title="The Horizons Blog"
        description="Stories, guides, and ideas about memory, meaningful connection, and the art of giving something that lasts."
        canonical="/blog"
      />
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#FFFAF8' }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(180deg,#FFF0F3 0%,#FFFAF8 100%)', padding: '72px 24px 56px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', color: '#C2475D', textTransform: 'uppercase', marginBottom: '16px' }}>
            The Horizons Blog
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 600, color: '#2C2028', lineHeight: 1.2, marginBottom: '20px' }}>
            Stories about memory,<br />connection, and time
          </h1>
          <p style={{ fontSize: '18px', color: '#6B5B6E', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Guides, ideas, and reflections on what it means to preserve the moments that matter.
          </p>
        </div>

        {/* Grid */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '28px' }}>
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                onClick={() => navigate(`/blog/${post.slug}`)}
                style={{
                  background: '#FFF', borderRadius: '16px', padding: '32px',
                  border: '1px solid rgba(212,144,154,0.15)',
                  boxShadow: '0 2px 12px rgba(212,144,154,0.06)',
                  cursor: 'pointer', transition: 'transform 0.2s,box-shadow 0.2s',
                  display: 'flex', flexDirection: 'column', gap: '14px',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(212,144,154,0.14)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(212,144,154,0.06)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ background: CAT_BG[post.category] || '#FDE8EC', color: CAT_FG[post.category] || '#9B2D42', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', padding: '4px 10px', borderRadius: '20px' }}>
                    {post.category}
                  </span>
                  <span style={{ fontSize: '13px', color: '#9D8F99' }}>{post.readTime} read</span>
                </div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 600, color: '#2C2028', lineHeight: 1.35, margin: 0 }}>
                  {post.title}
                </h2>
                <p style={{ fontSize: '15px', color: '#6B5B6E', lineHeight: 1.65, margin: 0, flexGrow: 1 }}>
                  {post.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                  <span style={{ fontSize: '13px', color: '#9D8F99' }}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#C2475D' }}>Read &rarr;</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
