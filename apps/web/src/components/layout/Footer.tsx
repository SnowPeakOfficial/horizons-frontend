/**
 * Footer Component - Shared across pages
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Instagram from '@mui/icons-material/Instagram';
import X from '@mui/icons-material/X';

/** Small circular icon button for social media links */
const SocialIconButton: React.FC<{ href: string; label: string; children: React.ReactNode }> = ({ href, label, children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '34px',
        height: '34px',
        borderRadius: '50%',
        background: hovered ? 'rgba(212, 144, 154, 0.15)' : 'rgba(212, 144, 154, 0.08)',
        color: hovered ? '#B87580' : '#D4909A',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        border: '1px solid rgba(212, 144, 154, 0.2)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  );
};

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const footerStyle: React.CSSProperties = {
    background: 'linear-gradient(180deg, #FFF5F7 0%, #FAF0F2 100%)',
    borderTop: '1px solid rgba(232, 180, 184, 0.3)',
    padding: '48px 24px 32px',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1100px',
    margin: '0 auto',
  };

  const topRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '32px',
    marginBottom: '40px',
  };

  const logoStyle: React.CSSProperties = {
    fontFamily: 'Georgia, serif',
    fontWeight: 500,
    fontSize: '18px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#9D8F99',
    opacity: 0.7,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const taglineStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#B0A0AC',
    marginTop: '6px',
    lineHeight: 1.5,
    maxWidth: '220px',
  };

  const columnTitleStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: '#9D8F99',
    textTransform: 'uppercase',
    marginBottom: '14px',
  };

  const linkStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    color: '#7A6E78',
    marginBottom: '10px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  };

  const dividerStyle: React.CSSProperties = {
    height: '1px',
    background: 'rgba(232, 180, 184, 0.25)',
    marginBottom: '24px',
  };

  const bottomRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  };

  const copyrightStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#B0A0AC',
  };

  const handleLinkHover = (e: React.MouseEvent<HTMLSpanElement>, entering: boolean) => {
    (e.currentTarget as HTMLElement).style.color = entering ? '#D4909A' : '#7A6E78';
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={topRowStyle}>
          {/* Brand */}
          <div>
            <div style={logoStyle} onClick={() => navigate('/')}>
              <img
                src="/images/horizons-logo-wordmark.svg"
                alt="Horizons"
                style={{ height: '24px', width: 'auto', display: 'block' }}
              />
            </div>
            <p style={taglineStyle}>
              A digital garden to grow and share meaningful moments.
            </p>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
              {/* Instagram */}
              <SocialIconButton href="https://www.instagram.com/horizons.memory.garden/" label="Instagram">
                <Instagram sx={{ fontSize: 20 }} />
              </SocialIconButton>
              {/* Twitter / X */}
              <SocialIconButton href="https://x.com/horizonsmemory" label="Twitter / X">
                <X sx={{ fontSize: 20 }} />
              </SocialIconButton>
              {/* TikTok — inline SVG since MUI doesn't include it */}
              <SocialIconButton href="#" label="TikTok">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.82a8.18 8.18 0 0 0 4.78 1.52V6.89a4.85 4.85 0 0 1-1.01-.2z"/>
                </svg>
              </SocialIconButton>
            </div>
          </div>

          {/* Product */}
          <div>
            <div style={columnTitleStyle}>Product</div>
            <span
              style={linkStyle}
              onClick={() => navigate('/my-gardens')}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              My Gardens
            </span>
            <span
              style={linkStyle}
              onClick={() => navigate('/pricing')}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Pricing
            </span>
          </div>

          {/* Legal */}
          <div>
            <div style={columnTitleStyle}>Legal</div>
            <span
              style={linkStyle}
              onClick={() => navigate('/privacy')}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Privacy Policy
            </span>
            <span
              style={linkStyle}
              onClick={() => navigate('/terms')}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Terms of Service
            </span>
          </div>

          {/* Support */}
          <div>
            <div style={columnTitleStyle}>Support</div>
            <span
              style={linkStyle}
              onClick={() => navigate('/contact')}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Contact Us
            </span>
          </div>
        </div>

        <div style={dividerStyle} />

        <div style={bottomRowStyle}>
          <span style={copyrightStyle}>
            © {year} Horizons. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span
              style={{ ...linkStyle, marginBottom: 0, fontSize: '13px' }}
              onClick={() => navigate('/privacy')}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Privacy
            </span>
            <span
              style={{ ...linkStyle, marginBottom: 0, fontSize: '13px' }}
              onClick={() => navigate('/terms')}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Terms
            </span>
            <span
              style={{ ...linkStyle, marginBottom: 0, fontSize: '13px' }}
              onClick={() => navigate('/contact')}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Contact
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
